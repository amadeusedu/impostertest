# RevenueCat Premium Setup

This app uses RevenueCat to unlock a **Premium** subscription entitlement.

## Required Dashboard Configuration

1. **Entitlement**
   - Name: `premium`
   - Use this entitlement to gate premium features.

2. **Offering**
   - Identifier: `default`
   - Include at least one package (monthly recommended).

3. **Packages**
   - Add a Monthly package to the `default` offering.
   - The app reads packages from `offerings.current.availablePackages`.

## Environment Variables

Add the RevenueCat public API keys to your environment:

```
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=
```

These keys must be present at runtime. The UI will show **Not configured** when missing.

## Expo Go Limitations

Purchases will **not** complete in Expo Go. Use a development build or production build
to test real purchases and restores.
