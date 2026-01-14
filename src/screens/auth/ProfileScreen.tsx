import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import AnimatedEntry from '../../components/AnimatedEntry';
import AnimatedPressable from '../../components/AnimatedPressable';
import PrimaryButton from '../../components/PrimaryButton';
import Card from '../../components/Card';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import { useAuth } from '../../auth/AuthProvider';

const ProfileScreen = () => {
  const { user, profile, updateDisplayName, signOut, authError, clearAuthError, loading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name ?? '');
  }, [profile?.display_name]);

  const handleSave = async () => {
    setIsSaving(true);
    clearAuthError();
    await updateDisplayName(displayName.trim());
    setIsSaving(false);
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

          {authError && (
            <AnimatedEntry delay={200}>
              <Text style={styles.errorText}>{authError}</Text>
            </AnimatedEntry>
          )}

          <AnimatedEntry delay={240}>
            <PrimaryButton
              label={loading || isSaving ? 'Saving…' : 'Save'}
              onPress={handleSave}
              disabled={loading || isSaving}
            />
          </AnimatedEntry>

          <AnimatedEntry delay={280}>
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
