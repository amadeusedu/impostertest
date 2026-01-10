import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, typography } from '../theme/tokens';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

const PrimaryButton = ({ label, onPress, style, disabled }: PrimaryButtonProps) => {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.wrapper, style]}>
      <LinearGradient
        colors={disabled ? ['#4B3A59', '#3B2B46'] : [colors.accent, colors.accentSoft]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, disabled && styles.disabled]}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.pill,
  },
  button: {
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  label: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default PrimaryButton;
