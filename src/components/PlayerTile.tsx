import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import PlayerAvatar from './PlayerAvatar';
import { colors, spacing, typography, radii } from '../theme/tokens';

interface PlayerTileProps {
  name: string;
  completed?: boolean;
  statusText?: string;
}

const PlayerTile = ({ name, completed = false, statusText }: PlayerTileProps) => {
  return (
    <Card style={[styles.card, completed && styles.cardCompleted]}>
      <View style={styles.content}>
        <PlayerAvatar name={name} size={52} />
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        {statusText ? <Text style={styles.status}>{statusText}</Text> : null}
        {completed && <Text style={styles.check}>✓</Text>}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 150,
    borderRadius: radii.lg,
  },
  cardCompleted: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.success,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  name: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
    textAlign: 'center',
  },
  status: {
    color: colors.icyBlue,
    fontSize: typography.caption,
  },
  check: {
    color: colors.success,
    fontSize: typography.subheading,
    fontWeight: '700',
  },
});

export default PlayerTile;
