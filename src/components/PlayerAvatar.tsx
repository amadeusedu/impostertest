import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, typography } from '../theme/tokens';

interface PlayerAvatarProps {
  name: string;
  size?: number;
}

const getInitials = (name: string) => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) {
    return '';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  const first = parts[0][0] ?? '';
  const last = parts[parts.length - 1][0] ?? '';
  return `${first}${last}`.toUpperCase();
};

const PlayerAvatar = ({ name, size = 52 }: PlayerAvatarProps) => {
  return (
    <LinearGradient
      colors={[colors.grapeSoda, colors.amethystSmoke]}
      style={[styles.avatar, { width: size, height: size }]}
    >
      <View style={styles.inner}>
        <Text style={styles.text}>{getInitials(name)}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: radii.pill,
    padding: 2,
  },
  inner: {
    flex: 1,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '700',
  },
});

export default PlayerAvatar;
