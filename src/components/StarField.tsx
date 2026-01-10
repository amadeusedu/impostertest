import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

const DOT_COUNT = 40;

const StarField = () => {
  const dots = useMemo(
    () =>
      Array.from({ length: DOT_COUNT }, (_, index) => ({
        key: `dot-${index}`,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.2,
      })),
    []
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {dots.map((dot) => (
        <View
          key={dot.key}
          style={[
            styles.dot,
            {
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
});

export default StarField;
