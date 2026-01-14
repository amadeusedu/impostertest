import * as Linking from 'expo-linking';

export const AUTH_CALLBACK_PATH = 'auth/callback';

export const getRedirectUrl = () => Linking.createURL(AUTH_CALLBACK_PATH);

export const parseAuthCallbackUrl = (url: string) => {
  const parsed = Linking.parse(url);
  const rawPath = parsed.path?.toLowerCase() ?? '';
  const normalizedPath = rawPath.startsWith('--/') ? rawPath.replace(/^--\//, '') : rawPath;
  const isAuthCallback = normalizedPath.startsWith(AUTH_CALLBACK_PATH);
  const codeParam = parsed.queryParams?.code;
  const code = typeof codeParam === 'string' ? codeParam : null;

  return { isAuthCallback, code };
};
