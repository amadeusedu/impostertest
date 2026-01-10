import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radii, typography } from '../theme/tokens';

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const Toggle = ({ label, value, onChange }: ToggleProps) => {
  return (
    <Pressable style={styles.container} onPress={() => onChange(!value)}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.track, value && styles.trackOn]}>
        <View style={[styles.thumb, value && styles.thumbOn]} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.icyBlue,
    fontSize: typography.body,
    flex: 1,
    marginRight: 12,
  },
  track: {
    width: 54,
    height: 30,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    padding: 4,
  },
  trackOn: {
    backgroundColor: colors.grapeSoda,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    backgroundColor: colors.chocolatePlum,
  },
  thumbOn: {
    marginLeft: 22,
    backgroundColor: colors.icyBlue,
  },
});

export default Toggle;
