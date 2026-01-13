import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import AnimatedPressable from '../components/AnimatedPressable';
import AnimatedEntry from '../components/AnimatedEntry';
import { colors, spacing, typography, radii } from '../theme/tokens';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useGame } from '../utils/GameContext';

const VotingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { players, round, submitVote, setCurrentVoter } = useGame();

  if (!round || !round.currentVoterId) {
    return null;
  }

  const currentVoterIndex = players.findIndex((player) => player.id === round.currentVoterId);
  const currentVoter = players[currentVoterIndex];
  const currentVoterName =
    currentVoter?.name?.trim() || (currentVoterIndex >= 0 ? `Player ${currentVoterIndex + 1}` : '');
  const hasVoted = !!round.votes[round.currentVoterId];

  const handleVote = (votedId: string) => {
    if (!round.currentVoterId || hasVoted) return;
    const updatedVotes = { ...round.votes, [round.currentVoterId]: votedId };
    submitVote(round.currentVoterId, votedId);
    const next = players.find((player) => !updatedVotes[player.id]);
    if (next) {
      const nextIndex = players.findIndex((player) => player.id === next.id);
      const nextName = next.name?.trim() || `Player ${nextIndex + 1}`;
      setCurrentVoter(next.id);
      navigation.replace('PassPhone', {
        title: 'Pass the phone',
        subtitle: `to ${nextName} to vote`,
        buttonLabel: `I'm ${nextName}`,
        nextScreen: 'Voting',
      });
      return;
    }
    setCurrentVoter(undefined);
    navigation.replace('VotingResults');
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <AnimatedEntry>
          <Text style={styles.title}>Voting</Text>
          <Text style={styles.subtitle}>Voting as {currentVoterName}</Text>
        </AnimatedEntry>
        <AnimatedEntry delay={120} style={styles.list}>
          {players.map((player, index) => {
            const displayName = player.name?.trim() || `Player ${index + 1}`;
            return (
            <Card key={player.id}>
              <View style={styles.voteRow}>
                <View style={styles.voteInfo}>
                  <Text style={styles.playerName}>{displayName}</Text>
                  <Text style={styles.answerText}>
                    {round.answers[player.id] || 'No answer submitted.'}
                  </Text>
                </View>
                <AnimatedPressable
                  style={[styles.voteButton, hasVoted && styles.voteDisabled]}
                  onPress={() => handleVote(player.id)}
                  disabled={hasVoted}
                  pressableStyle={styles.votePressable}
                >
                  <Text style={styles.voteText}>Vote</Text>
                </AnimatedPressable>
              </View>
            </Card>
          );
          })}
        </AnimatedEntry>
        {!players.find((player) => !round.votes[player.id]) && hasVoted && (
          <AnimatedEntry delay={200}>
            <Text style={styles.hint}>Waiting for results...</Text>
          </AnimatedEntry>
        )}
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
  subtitle: {
    color: colors.icyBlue,
    fontSize: typography.subheading,
  },
  list: {
    gap: spacing.md,
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  voteInfo: {
    flex: 1,
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
  voteButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.grapeSoda,
  },
  votePressable: {
    borderRadius: radii.pill,
  },
  voteText: {
    color: colors.white,
    fontWeight: '600',
  },
  voteDisabled: {
    opacity: 0.4,
  },
  hint: {
    color: colors.amethystSmoke,
    textAlign: 'center',
  },
});

export default VotingScreen;
