export const REVENUECAT_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;

export const assertRevenueCatConfigured = () => {
  if (__DEV__ && !REVENUECAT_API_KEY) {
    console.warn(
      '[RC] Missing RevenueCat API key. Set EXPO_PUBLIC_REVENUECAT_API_KEY to enable subscriptions.'
    );
  }

  return Boolean(REVENUECAT_API_KEY);
};
