import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, typography, radii } from '../theme/tokens';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useGame } from '../utils/GameContext';
import { tallyVotes } from '../utils/game';

const ResultsRevealScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { players, round, playAgain, resetToSettings } = useGame();

  if (!round) {
    return null;
  }

  const { counts, maxVotes, topIds } = tallyVotes(players, round.votes);
  const imposterNames = players
    .filter((player) => round.imposterIds.includes(player.id))
    .map((player) => player.name)
    .join(', ');
  const groupWins = topIds.some((id) => round.imposterIds.includes(id));

  const handlePlayAgain = () => {
    playAgain();
    navigation.replace('PlayersGrid');
  };

  const handleBackToSettings = () => {
    resetToSettings();
    navigation.replace('Settings');
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Results</Text>
        <Text style={styles.outcome}>{groupWins ? 'Group wins!' : 'Imposter wins!'}</Text>

        <Card>
          <Text style={styles.sectionTitle}>Vote Count</Text>
          <View style={styles.voteList}>
            {players.map((player) => {
              const count = counts[player.id] ?? 0;
              const width = maxVotes > 0 ? `${(count / maxVotes) * 100}%` : '0%';
              return (
                <View key={player.id} style={styles.voteRow}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width }]} />
                  </View>
                  <Text style={styles.voteNumber}>{count}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Imposter Reveal</Text>
          <Text style={styles.revealText}>{imposterNames}</Text>
        </Card>

        <PrimaryButton label="Play Again" onPress={handlePlayAgain} />
        <Text style={styles.secondaryLink} onPress={handleBackToSettings}>
          Back to Settings
        </Text>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.title,
    color: colors.white,
    fontWeight: '700',
  },
  outcome: {
    color: colors.icyBlue,
    fontSize: typography.heading,
    fontWeight: '600',
  },
  sectionTitle: {
    color: colors.amethystSmoke,
    textTransform: 'uppercase',
    fontSize: typography.caption,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  voteList: {
    gap: spacing.sm,
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  playerName: {
    flex: 0.3,
    color: colors.white,
    fontSize: typography.body,
  },
  barTrack: {
    flex: 0.5,
    height: 10,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.pill,
  },
  barFill: {
    height: 10,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
  },
  voteNumber: {
    flex: 0.2,
    color: colors.icyBlue,
    textAlign: 'right',
  },
  revealText: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  secondaryLink: {
    color: colors.amethystSmoke,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default ResultsRevealScreen;
