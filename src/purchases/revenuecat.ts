import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import { assertRevenueCatConfigured, REVENUECAT_API_KEY } from '../config/revenuecat';

type ConstantsModule = { appOwnership?: string } | { default?: { appOwnership?: string } };

let isConfigured = false;
let configurationAttempted = false;

const getConstants = (): { appOwnership?: string } | null => {
  try {
    const module = require('expo-constants') as ConstantsModule;
    if ('default' in module && module.default) {
      return module.default;
    }
    return module as { appOwnership?: string };
  } catch (error) {
    console.warn('[RC] Constants unavailable:', error);
    return null;
  }
};

export const isExpoGo = () => {
  const constants = getConstants();
  return constants?.appOwnership === 'expo';
};

export const getRevenueCatApiKey = () => {
  return REVENUECAT_API_KEY;
};

export const configureRevenueCat = () => {
  if (configurationAttempted) {
    return;
  }

  configurationAttempted = true;
  const apiKey = getRevenueCatApiKey();
  if (!apiKey) {
    assertRevenueCatConfigured();
    return;
  }

  try {
    if (__DEV__) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }

    Purchases.configure({ apiKey });
    isConfigured = true;
  } catch (error) {
    console.warn('[RC] Failed to configure RevenueCat:', error);
  }
};

export const logInRevenueCat = async (appUserId: string) => {
  try {
    configureRevenueCat();
    if (!isConfigured) {
      return;
    }
    await Purchases.logIn(appUserId);
  } catch (error) {
    console.warn('[RC] Failed to log in:', error);
  }
};

export const logOutRevenueCat = async () => {
  try {
    configureRevenueCat();
    if (!isConfigured) {
      return;
    }
    await Purchases.logOut();
  } catch (error) {
    console.warn('[RC] Failed to log out:', error);
  }
};

export const getCustomerInfoSafe = async (): Promise<CustomerInfo | null> => {
  try {
    configureRevenueCat();
    if (!isConfigured) {
      return null;
    }
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.warn('[RC] Failed to fetch customer info:', error);
    return null;
  }
};

export const purchasePackageSafe = async (
  pkg: PurchasesPackage
): Promise<CustomerInfo | null> => {
  try {
    configureRevenueCat();
    if (!isConfigured) {
      return null;
    }
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo ?? null;
  } catch (error) {
    console.warn('[RC] Purchase failed:', error);
    return null;
  }
};

export const restorePurchasesSafe = async (): Promise<CustomerInfo | null> => {
  try {
    configureRevenueCat();
    if (!isConfigured) {
      return null;
    }
    return await Purchases.restorePurchases();
  } catch (error) {
    console.warn('[RC] Restore failed:', error);
    return null;
  }
};
