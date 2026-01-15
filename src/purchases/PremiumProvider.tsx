import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from 'react-native-purchases';
import {
  configureRevenueCat,
  getCustomerInfoSafe,
  getRevenueCatApiKey,
  purchasePackageSafe,
  restorePurchasesSafe,
} from './revenuecat';

interface PremiumContextValue {
  isPremium: boolean;
  customerInfo: CustomerInfo | null;
  loading: boolean;
  offerings: PurchasesOfferings | null;
  error: string | null;
  isConfigured: boolean;
  refresh: () => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<void>;
  restore: () => Promise<void>;
  clearCustomerInfo: () => void;
  clearError: () => void;
}

const PremiumContext = createContext<PremiumContextValue | undefined>(undefined);

export const PremiumProvider = ({ children }: { children: React.ReactNode }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = Boolean(getRevenueCatApiKey());
  const isPremium = Boolean(customerInfo?.entitlements?.active?.premium);

  const clearCustomerInfo = useCallback(() => {
    setCustomerInfo(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchOfferings = useCallback(async () => {
    try {
      configureRevenueCat();
      if (!isConfigured) {
        setOfferings(null);
        return;
      }
      const response = await Purchases.getOfferings();
      setOfferings(response);
    } catch (err) {
      console.warn('[RC] Failed to fetch offerings:', err);
      setOfferings(null);
      setError('Unable to load subscription options right now.');
    }
  }, [isConfigured]);

  const refresh = useCallback(async () => {
    setLoading(true);
    clearError();
    const info = await getCustomerInfoSafe();
    if (info) {
      setCustomerInfo(info);
    } else if (!isConfigured) {
      setCustomerInfo(null);
    }
    await fetchOfferings();
    setLoading(false);
  }, [clearError, fetchOfferings, isConfigured]);

  const purchasePackage = useCallback(async (pkg: PurchasesPackage) => {
    setLoading(true);
    clearError();
    const info = await purchasePackageSafe(pkg);
    if (info) {
      setCustomerInfo(info);
    } else {
      setError('Purchase did not complete. Please try again.');
    }
    setLoading(false);
  }, [clearError]);

  const restore = useCallback(async () => {
    setLoading(true);
    clearError();
    const info = await restorePurchasesSafe();
    if (info) {
      setCustomerInfo(info);
    } else {
      setError('Unable to restore purchases right now.');
    }
    setLoading(false);
  }, [clearError]);

  useEffect(() => {
    configureRevenueCat();
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      isPremium,
      customerInfo,
      loading,
      offerings,
      error,
      isConfigured,
      refresh,
      purchasePackage,
      restore,
      clearCustomerInfo,
      clearError,
    }),
    [
      isPremium,
      customerInfo,
      loading,
      offerings,
      error,
      isConfigured,
      refresh,
      purchasePackage,
      restore,
      clearCustomerInfo,
      clearError,
    ]
  );

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
};

export const usePremiumContext = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremiumContext must be used within PremiumProvider');
  }
  return context;
};
