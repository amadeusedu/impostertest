import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, typography } from '../theme/tokens';
import AnimatedPressable from './AnimatedPressable';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  textStyle?: TextStyle;
}

const PrimaryButton = ({ label, onPress, style, disabled, textStyle }: PrimaryButtonProps) => {
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      pressableStyle={[styles.wrapper, style]}
    >
      <LinearGradient
        colors={disabled ? ['#4B3A59', '#3B2B46'] : [colors.accent, colors.accentSoft]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, disabled && styles.disabled]}
      >
        <Text
          style={[styles.label, textStyle]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {label}
        </Text>
      </LinearGradient>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.pill,
  },
  button: {
    borderRadius: radii.pill,
    paddingVertical: 16,
    paddingHorizontal: 18,
    minHeight: 54,
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
