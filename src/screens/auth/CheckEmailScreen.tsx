import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../../components/GradientBackground';
import AnimatedEntry from '../../components/AnimatedEntry';
import AnimatedPressable from '../../components/AnimatedPressable';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../auth/AuthProvider';

interface CheckEmailScreenProps {
  route: RouteProp<AuthStackParamList, 'CheckEmail'>;
}

const CheckEmailScreen = ({ route }: CheckEmailScreenProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { sendMagicLink, authError, clearAuthError } = useAuth();
  const { email, mode } = route.params;
  const [isSending, setIsSending] = useState(false);

  const handleResend = async () => {
    clearAuthError();
    setIsSending(true);
    await sendMagicLink(email, mode);
    setIsSending(false);
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <AnimatedEntry>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>We sent a magic link to {email}.</Text>
        </AnimatedEntry>

        <AnimatedEntry delay={120}>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Didn’t see it?</Text>
            <Text style={styles.tipText}>Check spam or promotions. Links expire quickly.</Text>
          </View>
        </AnimatedEntry>

        {authError && (
          <AnimatedEntry delay={160}>
            <Text style={styles.errorText}>{authError}</Text>
          </AnimatedEntry>
        )}

        <AnimatedEntry delay={200}>
          <PrimaryButton
            label={isSending ? 'Resending…' : 'Resend link'}
            onPress={handleResend}
            disabled={isSending}
          />
        </AnimatedEntry>

        <AnimatedEntry delay={240}>
          <AnimatedPressable
            pressableStyle={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>Back</Text>
          </AnimatedPressable>
        </AnimatedEntry>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
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
  tipCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  tipTitle: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  tipText: {
    color: colors.amethystSmoke,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.grapeSoda,
  },
  backText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '600',
  },
});

export default CheckEmailScreen;
