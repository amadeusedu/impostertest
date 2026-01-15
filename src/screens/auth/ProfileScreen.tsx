import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../../components/GradientBackground';
import AnimatedEntry from '../../components/AnimatedEntry';
import AnimatedPressable from '../../components/AnimatedPressable';
import PrimaryButton from '../../components/PrimaryButton';
import Card from '../../components/Card';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import { useAuth } from '../../auth/AuthProvider';
import { usePremium } from '../../purchases/usePremium';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

const ProfileScreen = () => {
  const { user, profile, updateDisplayName, signOut, authError, clearAuthError, loading } = useAuth();
  const { isPremium, isConfigured } = usePremium();
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  useEffect(() => {
    setDisplayName(profile?.display_name ?? '');
  }, [profile?.display_name]);

  const handleSave = async () => {
    setIsSaving(true);
    clearAuthError();
    await updateDisplayName(displayName.trim());
    setIsSaving(false);
  };

  const handlePremiumPress = () => {
    navigation.navigate('UnlockPremium');
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <AnimatedEntry>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Manage your account details.</Text>
          </AnimatedEntry>

          <AnimatedEntry delay={120}>
            <Card style={styles.card}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user?.email ?? 'Unknown email'}</Text>
            </Card>
          </AnimatedEntry>

          <AnimatedEntry delay={160}>
            <Card style={styles.card}>
              <Text style={styles.label}>Display name</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your name"
                placeholderTextColor={colors.amethystSmoke}
                style={styles.input}
              />
            </Card>
          </AnimatedEntry>

          <AnimatedEntry delay={200}>
            <Card style={styles.card}>
              <View style={styles.premiumHeader}>
                <Text style={styles.label}>Premium</Text>
                <View style={[styles.badge, isPremium ? styles.badgeActive : styles.badgeFree]}>
                  <Text style={styles.badgeText}>{isPremium ? 'Premium Active' : 'Free'}</Text>
                </View>
              </View>
              {!isConfigured && (
                <Text style={styles.configWarning}>RevenueCat not configured.</Text>
              )}
              <AnimatedPressable
                pressableStyle={styles.premiumButtonWrapper}
                onPress={handlePremiumPress}
              >
                <LinearGradient
                  colors={['#F5F5F5', '#C7C7D1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.premiumButton}
                >
                  <Text style={styles.premiumButtonText}>
                    {isPremium ? 'Manage Premium' : 'Unlock Premium'}
                  </Text>
                </LinearGradient>
              </AnimatedPressable>
            </Card>
          </AnimatedEntry>

          {authError && (
            <AnimatedEntry delay={240}>
              <Text style={styles.errorText}>{authError}</Text>
            </AnimatedEntry>
          )}

          <AnimatedEntry delay={280}>
            <PrimaryButton
              label={loading || isSaving ? 'Saving…' : 'Save'}
              onPress={handleSave}
              disabled={loading || isSaving}
            />
          </AnimatedEntry>

          <AnimatedEntry delay={320}>
            <AnimatedPressable pressableStyle={styles.signOutButton} onPress={signOut}>
              <Text style={styles.signOutText}>Sign out</Text>
            </AnimatedPressable>
          </AnimatedEntry>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
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
    gap: spacing.sm,
  },
  label: {
    color: colors.amethystSmoke,
    fontSize: typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    color: colors.white,
    fontSize: typography.body,
  },
  input: {
    color: colors.white,
    fontSize: typography.body,
    paddingVertical: spacing.sm,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  premiumButtonWrapper: {
    borderRadius: radii.pill,
  },
  premiumButton: {
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  premiumButtonText: {
    color: colors.black,
    fontSize: typography.subheading,
    fontWeight: '700',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption,
  },
  signOutButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  signOutText: {
    color: colors.danger,
    fontSize: typography.body,
    fontWeight: '600',
  },
});

export default ProfileScreen;
