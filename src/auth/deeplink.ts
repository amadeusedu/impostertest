import * as Linking from 'expo-linking';

export const AUTH_CALLBACK_PATH = 'auth/callback';

export const getSupabaseRedirectUrl = () => Linking.createURL(AUTH_CALLBACK_PATH);

export const parseAuthCallbackUrl = (url: string) => {
  const parsed = Linking.parse(url);
  const rawPath = parsed.path?.toLowerCase() ?? '';
  const normalizedPath = rawPath.startsWith('--/') ? rawPath.replace(/^--\//, '') : rawPath;
  const isAuthCallback = normalizedPath.startsWith(AUTH_CALLBACK_PATH);
  const codeParam = parsed.queryParams?.code;
  const code = typeof codeParam === 'string' ? codeParam : null;
  const fragment = url.split('#')[1] ?? '';
  const fragmentParams = new URLSearchParams(fragment);
  const accessToken = fragmentParams.get('access_token');
  const refreshToken = fragmentParams.get('refresh_token');

  return {
    isAuthCallback,
    code,
    accessToken: accessToken ?? null,
    refreshToken: refreshToken ?? null,
  };
};
