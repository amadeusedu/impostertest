import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import { colors, spacing, typography, radii } from '../theme/tokens';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useGame } from '../utils/GameContext';

const VotingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { players, round, submitVote, setCurrentVoter } = useGame();

  if (!round || !round.currentVoterId) {
    return null;
  }

  const currentVoter = players.find((player) => player.id === round.currentVoterId);
  const hasVoted = !!round.votes[round.currentVoterId];

  const handleVote = (votedId: string) => {
    if (!round.currentVoterId || hasVoted) return;
    const updatedVotes = { ...round.votes, [round.currentVoterId]: votedId };
    submitVote(round.currentVoterId, votedId);
    const next = players.find((player) => !updatedVotes[player.id]);
    if (next) {
      setCurrentVoter(next.id);
      navigation.replace('PassPhone', {
        title: 'Pass the phone',
        subtitle: `to ${next.name} to vote`,
        buttonLabel: `I'm ${next.name}`,
        nextScreen: 'Voting',
      });
      return;
    }
    setCurrentVoter(undefined);
    navigation.replace('ResultsReveal');
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Voting</Text>
        <Text style={styles.subtitle}>Voting as {currentVoter?.name}</Text>
        <View style={styles.list}>
          {players.map((player) => (
            <Card key={player.id}>
              <View style={styles.voteRow}>
                <View style={styles.voteInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.answerText}>
                    {round.answers[player.id] || 'No answer submitted.'}
                  </Text>
                </View>
                <Pressable
                  style={[styles.voteButton, hasVoted && styles.voteDisabled]}
                  onPress={() => handleVote(player.id)}
                  disabled={hasVoted}
                >
                  <Text style={styles.voteText}>Vote</Text>
                </Pressable>
              </View>
            </Card>
          ))}
        </View>
        {!players.find((player) => !round.votes[player.id]) && hasVoted && (
          <Text style={styles.hint}>Waiting for results...</Text>
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
