import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Linking from 'expo-linking';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { missingSupabaseConfig } from '../config/supabase';
import { getSupabaseRedirectUrl, parseAuthCallbackUrl } from './deeplink';
import { navigationRef } from '../navigation/navigationRef';
import { usePremium } from '../purchases/usePremium';
import { logInRevenueCat, logOutRevenueCat } from '../purchases/revenuecat';

export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at?: string;
  updated_at?: string;
};

type AuthMode = 'login' | 'signup';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  authError: string | null;
  pendingEmail: string | null;
  pendingMode: AuthMode | null;
  sendMagicLink: (email: string, mode: AuthMode) => Promise<{ success: boolean; error?: string }>;
  handleAuthRedirect: (url: string) => Promise<boolean>;
  updateDisplayName: (displayName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getDisplayNameFallback = (user: User) => {
  if (!user.email) {
    return 'Player';
  }
  return user.email.split('@')[0];
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingMode, setPendingMode] = useState<AuthMode | null>(null);
  const [needsProfileNavigation, setNeedsProfileNavigation] = useState(false);
  const processedCodes = useRef(new Set<string>());
  const processedTokens = useRef(new Set<string>());
  const lastHandledUrlRef = useRef<string | null>(null);
  const lastEnsuredUserIdRef = useRef<string | null>(null);

  const isConfigured = useMemo(() => !missingSupabaseConfig, []);
  const { refresh: refreshPremium, clearCustomerInfo } = usePremium();

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const getOrCreateProfile = useCallback(async (user: User) => {
    if (!isConfigured) {
      return;
    }

    if (__DEV__) {
      console.log('[AUTH] profile lookup start', { userId: user.id, email: user.email ?? null });
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      if (__DEV__) {
        console.log('[AUTH] profile lookup error', { message: error.message });
      }
      setAuthError(error.message);
      return;
    }

    if (data) {
      setProfile(data as Profile);
      return;
    }

    const displayName = getDisplayNameFallback(user);
    if (__DEV__) {
      console.log('[AUTH] profile upsert start', { userId: user.id });
    }
    const { data: upserted, error: upsertError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          email: user.email ?? null,
          display_name: displayName,
        },
        { onConflict: 'id' }
      )
      .select('*')
      .single();

    if (upsertError) {
      if (__DEV__) {
        console.log('[AUTH] profile upsert error', { message: upsertError.message });
      }
      setAuthError(upsertError.message);
      return;
    }

    if (__DEV__) {
      console.log('[AUTH] profile upsert success', { userId: user.id });
    }
    setProfile(upserted as Profile);
  }, [isConfigured]);

  const ensureProfileForUser = useCallback(
    async (user: User) => {
      if (lastEnsuredUserIdRef.current === user.id) {
        return;
      }

      lastEnsuredUserIdRef.current = user.id;
      await getOrCreateProfile(user);
    },
    [getOrCreateProfile]
  );

  const refreshSession = useCallback(async () => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      setAuthError(error.message);
    }

    setSession(data.session ?? null);
    setLoading(false);
  }, [isConfigured]);

  useEffect(() => {
    refreshSession();

    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      if (!nextSession?.user) {
        setProfile(null);
        lastEnsuredUserIdRef.current = null;
      } else if (event === 'SIGNED_IN') {
        void ensureProfileForUser(nextSession.user);
      }
    });

    return () => {
      data.subscription?.unsubscribe();
    };
  }, [ensureProfileForUser, refreshSession]);

  useEffect(() => {
    if (session?.user) {
      void ensureProfileForUser(session.user);
    }
  }, [ensureProfileForUser, session?.user]);

  useEffect(() => {
    const syncRevenueCat = async () => {
      if (session?.user?.id) {
        await logInRevenueCat(session.user.id);
        await refreshPremium();
        return;
      }

      await logOutRevenueCat();
      clearCustomerInfo();
    };

    syncRevenueCat();
  }, [clearCustomerInfo, refreshPremium, session?.user?.id]);

  const sendMagicLink = useCallback(
    async (email: string, mode: AuthMode) => {
      if (!isConfigured) {
        const message = 'Supabase config missing. Add env vars before sending links.';
        setAuthError(message);
        return { success: false, error: message };
      }

      setAuthError(null);
      const redirectTo = getSupabaseRedirectUrl();
      if (__DEV__) {
        console.log('[AUTH] emailRedirectTo:', redirectTo);
        console.log('[AUTH] Add this URL to Supabase Auth → Redirect URLs:', redirectTo);
      }
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true,
        },
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      setPendingEmail(email);
      setPendingMode(mode);
      return { success: true };
    },
    [isConfigured]
  );

  const handleAuthRedirect = useCallback(
    async (url: string) => {
      if (!url) {
        return false;
      }

      if (lastHandledUrlRef.current === url) {
        return false;
      }

      lastHandledUrlRef.current = url;

      if (__DEV__) {
        console.log('[AUTH] incoming url:', url);
      }

      const { isAuthCallback, code, accessToken, refreshToken } = parseAuthCallbackUrl(url);
      if (__DEV__) {
        console.log('[AUTH] parsed callback', {
          isAuthCallback,
          hasCode: Boolean(code),
          hasAccessToken: Boolean(accessToken),
          hasRefreshToken: Boolean(refreshToken),
        });
      }

      if (!isAuthCallback) {
        return false;
      }

      setAuthError(null);

      if (!isConfigured) {
        const message = 'Supabase config missing. Unable to complete login.';
        setAuthError(message);
        if (__DEV__) {
          console.log('[AUTH] config error:', message);
        }
        return false;
      }

      try {
        if (accessToken && refreshToken) {
          if (processedTokens.current.has(accessToken)) {
            return false;
          }
          processedTokens.current.add(accessToken);

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            setAuthError(error.message || 'Magic link expired or already used.');
            if (__DEV__) {
              console.log('[AUTH] setSession error', { message: error.message });
            }
            return false;
          }
        } else if (code) {
          if (processedCodes.current.has(code)) {
            return false;
          }

          processedCodes.current.add(code);

          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setAuthError(error.message || 'Magic link expired or already used.');
            if (__DEV__) {
              console.log('[AUTH] exchangeCodeForSession error', { message: error.message });
            }
            return false;
          }
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setAuthError(error.message);
          if (__DEV__) {
            console.log('[AUTH] getSession error', { message: error.message });
          }
          return false;
        }

        const nextSession = data.session ?? null;
        setSession(nextSession);

        if (__DEV__) {
          console.log('[AUTH] session after redirect', { hasSession: Boolean(nextSession) });
        }

        if (nextSession?.user) {
          await ensureProfileForUser(nextSession.user);
          setNeedsProfileNavigation(true);
          return true;
        }
      } catch (error) {
        if (__DEV__) {
          console.log('[AUTH] handle redirect error', { error });
        }
        setAuthError('Unable to complete login. Please try again.');
        return false;
      }

      return false;
    },
    [ensureProfileForUser, isConfigured]
  );

  useEffect(() => {
    const handleInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await handleAuthRedirect(initialUrl);
      }
    };

    handleInitialUrl();

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleAuthRedirect(url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleAuthRedirect]);

  useEffect(() => {
    if (!needsProfileNavigation) {
      return;
    }

    if (navigationRef.isReady()) {
      navigationRef.navigate('Settings');
      setNeedsProfileNavigation(false);
      return;
    }

    const interval = setInterval(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate('Settings');
        setNeedsProfileNavigation(false);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [needsProfileNavigation]);

  const updateDisplayName = useCallback(
    async (displayName: string) => {
      if (!session?.user) {
        return { success: false, error: 'Not signed in.' };
      }

      if (!isConfigured) {
        const message = 'Supabase config missing. Unable to save profile.';
        setAuthError(message);
        return { success: false, error: message };
      }

      setAuthError(null);
      const { data, error } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', session.user.id)
        .select('*')
        .single();

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      setProfile(data as Profile);
      return { success: true };
    },
    [isConfigured, session?.user]
  );

  const signOut = useCallback(async () => {
    setAuthError(null);
    await supabase.auth.signOut();
    await logOutRevenueCat();
    clearCustomerInfo();
    setSession(null);
    setProfile(null);
    lastEnsuredUserIdRef.current = null;
  }, [clearCustomerInfo]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      authError,
      pendingEmail,
      pendingMode,
      sendMagicLink,
      handleAuthRedirect,
      updateDisplayName,
      signOut,
      clearAuthError,
      isConfigured,
    }),
    [
      authError,
      clearAuthError,
      handleAuthRedirect,
      loading,
      pendingEmail,
      pendingMode,
      profile,
      sendMagicLink,
      session,
      signOut,
      updateDisplayName,
      isConfigured,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
