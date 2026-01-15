import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedEntry from '../../components/AnimatedEntry';
import AnimatedPressable from '../../components/AnimatedPressable';
import Card from '../../components/Card';
import GradientBackground from '../../components/GradientBackground';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import { usePremium } from '../../purchases/usePremium';
import { isExpoGo } from '../../purchases/revenuecat';
import { PurchasesPackage } from 'react-native-purchases';

const BENEFITS = ['Unlimited game nights', 'Exclusive premium questions', 'Priority support'];

const packageTypeLabel: Record<string, string> = {
  MONTHLY: 'Monthly',
  ANNUAL: 'Annual',
  SIX_MONTH: '6 Months',
  THREE_MONTH: '3 Months',
  TWO_MONTH: '2 Months',
  WEEKLY: 'Weekly',
  LIFETIME: 'Lifetime',
};

const packageTypePeriod: Record<string, string> = {
  MONTHLY: 'month',
  ANNUAL: 'year',
  SIX_MONTH: '6 months',
  THREE_MONTH: '3 months',
  TWO_MONTH: '2 months',
  WEEKLY: 'week',
  LIFETIME: 'lifetime',
};

const getPackageTitle = (pkg: PurchasesPackage) => {
  const label = packageTypeLabel[pkg.packageType] ?? 'Premium';
  return `${label} Plan`;
};

const getPackagePrice = (pkg: PurchasesPackage) => {
  const price = pkg.product.priceString;
  const period = packageTypePeriod[pkg.packageType] ?? 'period';
  return price ? `${price} / ${period}` : 'Price unavailable';
};

const UnlockPremiumScreen = () => {
  const {
    isPremium,
    offerings,
    loading,
    error,
    isConfigured,
    refresh,
    purchasePackage,
    restore,
    clearError,
  } = usePremium();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const packages = offerings?.current?.availablePackages ?? [];

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  useEffect(() => {
    if (!selectedPackageId && packages.length > 0) {
      setSelectedPackageId(packages[0].identifier);
    }
  }, [packages, selectedPackageId]);

  useEffect(() => {
    if (isPremium) {
      setNotice('Premium Active ✅');
    }
  }, [isPremium]);

  const selectedPackage = useMemo(() => {
    if (!packages.length) {
      return null;
    }
    return packages.find((pkg) => pkg.identifier === selectedPackageId) ?? packages[0];
  }, [packages, selectedPackageId]);

  const handlePurchase = async () => {
    if (!selectedPackage) {
      return;
    }
    setNotice(null);
    clearError();
    await purchasePackage(selectedPackage);
    await refresh();
  };

  const handleRestore = async () => {
    setNotice(null);
    clearError();
    await restore();
    await refresh();
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <AnimatedEntry>
          <Text style={styles.title}>Premium</Text>
          <Text style={styles.subtitle}>
            {isPremium ? 'Premium Active' : 'Free'} • Unlock the full experience.
          </Text>
        </AnimatedEntry>

        <AnimatedEntry delay={120}>
          <Card style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status</Text>
              <View style={[styles.badge, isPremium ? styles.badgeActive : styles.badgeFree]}>
                <Text style={styles.badgeText}>{isPremium ? 'Premium Active' : 'Free'}</Text>
              </View>
            </View>
            {!isConfigured && (
              <Text style={styles.configWarning}>
                RevenueCat keys are missing. Add env vars to enable subscriptions.
              </Text>
            )}
          </Card>
        </AnimatedEntry>

        <AnimatedEntry delay={160}>
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Why Premium?</Text>
            <View style={styles.benefits}>
              {BENEFITS.map((benefit) => (
                <View key={benefit} style={styles.benefitRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </Card>
        </AnimatedEntry>

        <AnimatedEntry delay={200}>
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Choose your plan</Text>
            {packages.length === 0 ? (
              <Text style={styles.emptyText}>
                No packages available. Check that the RevenueCat default offering is configured.
              </Text>
            ) : (
              <View style={styles.packages}>
                {packages.map((pkg) => {
                  const isSelected = pkg.identifier === selectedPackage?.identifier;
                  return (
                    <AnimatedPressable
                      key={pkg.identifier}
                      onPress={() => setSelectedPackageId(pkg.identifier)}
                      pressableStyle={[
                        styles.packageCard,
                        isSelected && styles.packageCardSelected,
                      ]}
                    >
                      <Text style={styles.packageTitle}>{getPackageTitle(pkg)}</Text>
                      <Text style={styles.packagePrice}>{getPackagePrice(pkg)}</Text>
                      <Text style={styles.packageSubtitle}>{pkg.product.title}</Text>
                    </AnimatedPressable>
                  );
                })}
              </View>
            )}
          </Card>
        </AnimatedEntry>

        {error && (
          <AnimatedEntry delay={220}>
            <Text style={styles.errorText}>{error}</Text>
          </AnimatedEntry>
        )}

        {notice && (
          <AnimatedEntry delay={240}>
            <Text style={styles.noticeText}>{notice}</Text>
          </AnimatedEntry>
        )}

        <AnimatedEntry delay={260}>
          <AnimatedPressable
            onPress={handlePurchase}
            disabled={!selectedPackage || loading}
            pressableStyle={styles.ctaWrapper}
          >
            <LinearGradient
              colors={['#F5F5F5', '#C7C7D1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.ctaButton, (!selectedPackage || loading) && styles.ctaDisabled]}
            >
              <Text style={styles.ctaLabel}>{loading ? 'Starting…' : 'Start Premium'}</Text>
            </LinearGradient>
          </AnimatedPressable>
        </AnimatedEntry>

        <AnimatedEntry delay={300}>
          <AnimatedPressable
            onPress={handleRestore}
            disabled={loading}
            pressableStyle={styles.restoreButton}
          >
            <Text style={styles.restoreText}>{loading ? 'Restoring…' : 'Restore Purchases'}</Text>
          </AnimatedPressable>
        </AnimatedEntry>

        {isExpoGo() && (
          <AnimatedEntry delay={340}>
            <Text style={styles.expoNote}>
              Purchases won’t complete in Expo Go preview. Install a development build to test
              payments.
            </Text>
          </AnimatedEntry>
        )}
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: typography.title,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.icyBlue,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
  card: {
    gap: spacing.md,
  },
  statusCard: {
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    color: colors.amethystSmoke,
    fontSize: typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeActive: {
    backgroundColor: colors.success,
  },
  badgeFree: {
    backgroundColor: colors.surfaceAlt,
  },
  badgeText: {
    color: colors.black,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  configWarning: {
    color: colors.warning,
    fontSize: typography.caption,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  benefits: {
    gap: spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
  },
  benefitText: {
    color: colors.icyBlue,
    fontSize: typography.body,
  },
  packages: {
    gap: spacing.sm,
  },
  packageCard: {
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: spacing.xs,
  },
  packageCardSelected: {
    borderColor: colors.accentSoft,
    backgroundColor: '#372943',
  },
  packageTitle: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  packagePrice: {
    color: colors.success,
    fontSize: typography.body,
    fontWeight: '600',
  },
  packageSubtitle: {
    color: colors.amethystSmoke,
    fontSize: typography.caption,
  },
  emptyText: {
    color: colors.amethystSmoke,
    fontSize: typography.body,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.body,
  },
  noticeText: {
    color: colors.success,
    fontSize: typography.body,
  },
  ctaWrapper: {
    borderRadius: radii.pill,
  },
  ctaButton: {
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaLabel: {
    color: colors.black,
    fontSize: typography.subheading,
    fontWeight: '700',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.amethystSmoke,
  },
  restoreText: {
    color: colors.icyBlue,
    fontSize: typography.body,
    fontWeight: '600',
  },
  expoNote: {
    color: colors.amethystSmoke,
    fontSize: typography.caption,
    textAlign: 'center',
  },
});

export default UnlockPremiumScreen;
