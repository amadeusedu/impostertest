import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../../components/GradientBackground';
import AnimatedEntry from '../../components/AnimatedEntry';
import AnimatedPressable from '../../components/AnimatedPressable';
import PrimaryButton from '../../components/PrimaryButton';
import Card from '../../components/Card';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../auth/AuthProvider';
import { missingSupabaseConfig } from '../../config/supabase';

const SignupScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { sendMagicLink, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSend = async () => {
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setLocalError('Enter a valid email address.');
      return;
    }

    setLocalError(null);
    clearAuthError();
    setIsSending(true);
    const result = await sendMagicLink(trimmed, 'signup');
    setIsSending(false);

    if (result.success) {
      navigation.navigate('CheckEmail', { email: trimmed, mode: 'signup' });
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <AnimatedEntry>
            <Text style={styles.title}>Sign up</Text>
            <Text style={styles.subtitle}>Start with a magic link—no password needed.</Text>
          </AnimatedEntry>

          {missingSupabaseConfig && (
            <AnimatedEntry delay={80}>
              <View style={styles.warningBanner}>
                <Text style={styles.warningText}>
                  Supabase env vars are missing. Add them to run auth.
                </Text>
              </View>
            </AnimatedEntry>
          )}

          <AnimatedEntry delay={120}>
            <Card style={styles.inputCard}>
              <Text style={styles.inputLabel}>Email address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@example.com"
                placeholderTextColor={colors.amethystSmoke}
                style={styles.input}
                editable={!isSending}
              />
            </Card>
          </AnimatedEntry>

          {(localError || authError) && (
            <AnimatedEntry delay={160}>
              <Text style={styles.errorText}>{localError ?? authError}</Text>
            </AnimatedEntry>
          )}

          <AnimatedEntry delay={200}>
            <PrimaryButton
              label={isSending ? 'Sending link…' : 'Send sign-up link'}
              onPress={handleSend}
              disabled={isSending || missingSupabaseConfig}
            />
          </AnimatedEntry>

          <AnimatedEntry delay={240}>
            <AnimatedPressable
              pressableStyle={styles.secondaryButton}
              onPress={() => navigation.replace('Login')}
            >
              <Text style={styles.secondaryText}>Already have an account? Log in</Text>
            </AnimatedPressable>
          </AnimatedEntry>

          <AnimatedEntry delay={280}>
            <AnimatedPressable
              pressableStyle={styles.guestButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.guestText}>Continue as Guest</Text>
            </AnimatedPressable>
          </AnimatedEntry>

          {__DEV__ && (
            <AnimatedEntry delay={320}>
              <AnimatedPressable
                pressableStyle={styles.advancedToggle}
                onPress={() => setShowAdvanced((prev) => !prev)}
              >
                <Text style={styles.advancedText}>
                  {showAdvanced ? 'Hide advanced' : 'Show advanced'}
                </Text>
              </AnimatedPressable>
              {showAdvanced && (
                <View style={styles.advancedPanel}>
                  <Text style={styles.advancedLabel}>Redirect URL</Text>
                  <Text style={styles.advancedValue}>{redirectUrl}</Text>
                </View>
              )}
            </AnimatedEntry>
          )}
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
  warningBanner: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  warningText: {
    color: colors.warning,
    fontSize: typography.caption,
  },
  inputCard: {
    gap: spacing.sm,
  },
  inputLabel: {
    color: colors.amethystSmoke,
    fontSize: typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.grapeSoda,
  },
  secondaryText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '600',
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  guestText: {
    color: colors.amethystSmoke,
    fontSize: typography.body,
  },
  advancedToggle: {
    alignItems: 'flex-start',
  },
  advancedText: {
    color: colors.icyBlue,
    fontSize: typography.caption,
  },
  advancedPanel: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceAlt,
  },
  advancedLabel: {
    color: colors.amethystSmoke,
    fontSize: typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  advancedValue: {
    color: colors.white,
    fontSize: typography.caption,
    marginTop: spacing.xs,
  },
});

export default SignupScreen;
