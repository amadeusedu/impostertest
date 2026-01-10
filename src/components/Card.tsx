import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii } from '../theme/tokens';

interface CardProps {
  children: ReactNode;
  style?: object;
}

const Card = ({ children, style }: CardProps) => {
  return (
    <LinearGradient
      colors={[colors.grapeSoda, colors.surfaceAlt]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.border, style]}
    >
      <View style={styles.inner}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  border: {
    borderRadius: radii.lg,
    padding: 1,
  },
  inner: {
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: 16,
  },
});

export default Card;
