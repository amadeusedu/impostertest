import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import PrimaryButton from '../components/PrimaryButton';
import AnimatedEntry from '../components/AnimatedEntry';
import { colors, spacing, typography } from '../theme/tokens';
import { RootStackParamList } from '../navigation/RootNavigator';

const PassPhoneScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { title, subtitle, buttonLabel, nextScreen, nextParams } =
    route.params as RootStackParamList['PassPhone'];

  return (
    <GradientBackground>
      <View style={styles.container}>
        <AnimatedEntry>
          <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2} adjustsFontSizeToFit>
            {subtitle}
          </Text>
        </AnimatedEntry>
        <AnimatedEntry delay={120}>
          <PrimaryButton
            label={buttonLabel}
            onPress={() => navigation.replace(nextScreen, nextParams)}
            textStyle={styles.buttonText}
          />
        </AnimatedEntry>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.title,
    color: colors.white,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: typography.subheading,
    color: colors.icyBlue,
    textAlign: 'center',
  },
  buttonText: {
    paddingHorizontal: spacing.sm,
  },
});

export default PassPhoneScreen;
