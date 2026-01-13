import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import AnimatedEntry from '../components/AnimatedEntry';
import { colors, spacing, typography } from '../theme/tokens';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useGame } from '../utils/GameContext';

const AllAnswersScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { players, round, startVoting } = useGame();

  if (!round) {
    return null;
  }

  const handleStartVoting = () => {
    startVoting();
    const firstPlayer = players[0];
    if (!firstPlayer) return;
    const displayName = firstPlayer.name?.trim() || 'Player 1';
    navigation.replace('PassPhone', {
      title: 'Pass the phone',
      subtitle: `to ${displayName} to vote`,
      buttonLabel: `I'm ${displayName}`,
      nextScreen: 'Voting',
    });
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <AnimatedEntry>
          <Text style={styles.title}>All Answers</Text>
        </AnimatedEntry>
        <AnimatedEntry delay={120} style={styles.list}>
          {players.map((player, index) => {
            const displayName = player.name?.trim() || `Player ${index + 1}`;
            return (
            <Card key={player.id}>
              <Text style={styles.playerName}>{displayName}</Text>
              <Text style={styles.answerText}>
                {round.answers[player.id] || 'No answer submitted.'}
              </Text>
            </Card>
          );
          })}
        </AnimatedEntry>
        <AnimatedEntry delay={200}>
          <PrimaryButton label="Start Voting" onPress={handleStartVoting} />
        </AnimatedEntry>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.title,
    color: colors.white,
    fontWeight: '700',
  },
  list: {
    gap: spacing.md,
  },
  playerName: {
    color: colors.icyBlue,
    fontSize: typography.subheading,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  answerText: {
    color: colors.white,
    fontSize: typography.body,
  },
});

export default AllAnswersScreen;
