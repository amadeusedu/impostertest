import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import PrimaryButton from '../components/PrimaryButton';
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
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <PrimaryButton
          label={buttonLabel}
          onPress={() => navigation.replace(nextScreen, nextParams)}
        />
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
});

export default PassPhoneScreen;
