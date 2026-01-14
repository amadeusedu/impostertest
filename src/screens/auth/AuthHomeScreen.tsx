import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../../components/GradientBackground';
import AnimatedEntry from '../../components/AnimatedEntry';
import PrimaryButton from '../../components/PrimaryButton';
import AnimatedPressable from '../../components/AnimatedPressable';
import { colors, spacing, typography, radii } from '../../theme/tokens';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

const AuthHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <GradientBackground>
      <View style={styles.container}>
        <AnimatedEntry>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Use email magic links to continue your game on any device.</Text>
        </AnimatedEntry>

        <AnimatedEntry delay={120}>
          <PrimaryButton label="Log in" onPress={() => navigation.navigate('Login')} />
        </AnimatedEntry>

        <AnimatedEntry delay={200}>
          <AnimatedPressable
            pressableStyle={styles.secondaryButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.secondaryButtonText}>Sign up</Text>
          </AnimatedPressable>
        </AnimatedEntry>

        <AnimatedEntry delay={260}>
          <AnimatedPressable onPress={() => navigation.goBack()} pressableStyle={styles.guestButton}>
            <Text style={styles.guestText}>Continue as Guest</Text>
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
    justifyContent: 'center',
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.title,
    color: colors.white,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.icyBlue,
    fontSize: typography.body,
    marginTop: spacing.sm,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.grapeSoda,
    backgroundColor: 'transparent',
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  guestText: {
    color: colors.amethystSmoke,
    fontSize: typography.body,
  },
});

export default AuthHomeScreen;
