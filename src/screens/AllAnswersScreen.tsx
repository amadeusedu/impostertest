import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
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
    navigation.replace('PassPhone', {
      title: 'Pass the phone',
      subtitle: `to ${firstPlayer.name} to vote`,
      buttonLabel: `I'm ${firstPlayer.name}`,
      nextScreen: 'Voting',
    });
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>All Answers</Text>
        <View style={styles.list}>
          {players.map((player) => (
            <Card key={player.id}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.answerText}>
                {round.answers[player.id] || 'No answer submitted.'}
              </Text>
            </Card>
          ))}
        </View>
        <PrimaryButton label="Start Voting" onPress={handleStartVoting} />
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
