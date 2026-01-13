import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors, radii, typography } from '../theme/tokens';
import AnimatedPressable from './AnimatedPressable';

interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

const Stepper = ({ value, min, max, onChange }: StepperProps) => {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <View style={styles.container}>
      <AnimatedPressable
        style={[styles.button, value === min && styles.disabled]}
        onPress={decrement}
        disabled={value === min}
      >
        <Text style={styles.buttonLabel}>-</Text>
      </AnimatedPressable>
      <Text style={styles.value}>{value}</Text>
      <AnimatedPressable
        style={[styles.button, value === max && styles.disabled]}
        onPress={increment}
        disabled={value === max}
      >
        <Text style={styles.buttonLabel}>+</Text>
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    gap: 12,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grapeSoda,
  },
  buttonLabel: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '700',
  },
  value: {
    color: colors.icyBlue,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
});

export default Stepper;
