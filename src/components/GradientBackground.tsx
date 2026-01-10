import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StarField from './StarField';
import { colors } from '../theme/tokens';

interface GradientBackgroundProps {
  children: ReactNode;
}

const GradientBackground = ({ children }: GradientBackgroundProps) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.black, '#1A1221', colors.deepMocha]}
        style={StyleSheet.absoluteFill}
      />
      <StarField />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default GradientBackground;
