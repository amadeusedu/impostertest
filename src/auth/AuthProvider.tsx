import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Linking from 'expo-linking';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { missingSupabaseConfig } from '../config/supabase';
import { AUTH_CALLBACK_PATH, parseAuthCallbackUrl } from './deeplink';
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
  handleAuthCallback: (url: string) => Promise<void>;
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

  const isConfigured = useMemo(() => !missingSupabaseConfig, []);
  const { refresh: refreshPremium, clearCustomerInfo } = usePremium();

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const getOrCreateProfile = useCallback(async (user: User) => {
    if (!isConfigured) {
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (data) {
      setProfile(data as Profile);
      return;
    }

    const displayName = getDisplayNameFallback(user);
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
      setAuthError(upsertError.message);
      return;
    }

    setProfile(upserted as Profile);
  }, [isConfigured]);

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

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession?.user) {
        setProfile(null);
      }
    });

    return () => {
      data.subscription?.unsubscribe();
    };
  }, [refreshSession]);

  useEffect(() => {
    if (session?.user) {
      getOrCreateProfile(session.user);
    }
  }, [getOrCreateProfile, session?.user]);

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
      const redirectTo = Linking.createURL(AUTH_CALLBACK_PATH);
      console.log('[AUTH] emailRedirectTo:', redirectTo);
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

  const handleAuthCallback = useCallback(
    async (url: string) => {
      console.log('[AUTH] incoming url:', url);
      const { isAuthCallback, code, accessToken, refreshToken } = parseAuthCallbackUrl(url);
      if (!isAuthCallback) {
        return;
      }

      setAuthError(null);

      if (!isConfigured) {
        setAuthError('Supabase config missing. Unable to complete login.');
        return;
      }

      if (accessToken && refreshToken) {
        if (processedTokens.current.has(accessToken)) {
          return;
        }
        processedTokens.current.add(accessToken);

        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          setAuthError(error.message || 'Magic link expired or already used.');
          return;
        }

        setSession(data.session ?? null);
        if (data.session?.user) {
          await getOrCreateProfile(data.session.user);
        }
        setNeedsProfileNavigation(true);
        return;
      }

      if (code) {
        if (processedCodes.current.has(code)) {
          return;
        }

        processedCodes.current.add(code);

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setAuthError(error.message || 'Magic link expired or already used.');
          return;
        }

        setSession(data.session ?? null);

        if (data.session?.user) {
          await getOrCreateProfile(data.session.user);
        }

        setNeedsProfileNavigation(true);
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setAuthError(error.message);
        return;
      }

      setSession(data.session ?? null);
      if (data.session?.user) {
        await getOrCreateProfile(data.session.user);
        setNeedsProfileNavigation(true);
      }
    },
    [getOrCreateProfile, isConfigured]
  );

  useEffect(() => {
    const handleInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await handleAuthCallback(initialUrl);
      }
    };

    handleInitialUrl();

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleAuthCallback(url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleAuthCallback]);

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
      handleAuthCallback,
      updateDisplayName,
      signOut,
      clearAuthError,
      isConfigured,
    }),
    [
      authError,
      clearAuthError,
      handleAuthCallback,
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
