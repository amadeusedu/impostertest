import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import AnimatedEntry from '../components/AnimatedEntry';
import { colors, spacing, typography } from '../theme/tokens';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useGame } from '../utils/GameContext';

const PlayerTurnScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { playerId } = route.params as RootStackParamList['PlayerTurn'];
  const { players, round, showCategory, submitAnswer, getQuestionForPlayer } = useGame();
  const [answer, setAnswer] = useState('');

  if (!round) {
    return null;
  }

  const player = players.find((item) => item.id === playerId);
  const playerName = player?.name?.trim() || 'Player';
  const question = getQuestionForPlayer(playerId);

  const handleSubmit = () => {
    submitAnswer(playerId, answer.trim());
    navigation.replace('PassPhone', {
      title: 'Pass the phone',
      subtitle: 'Back to the group',
      buttonLabel: 'All set',
      nextScreen: 'PlayersGrid',
    });
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <AnimatedEntry>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
            {playerName}
          </Text>
          {showCategory && <Text style={styles.category}>{round.questionPair.category}</Text>}
        </AnimatedEntry>
        <AnimatedEntry delay={120}>
          <Card>
            <Text style={styles.question}>{question}</Text>
          </Card>
        </AnimatedEntry>
        <AnimatedEntry delay={180}>
          <Text style={styles.label}>Your Answer</Text>
          <TextInput
            value={answer}
            onChangeText={setAnswer}
            placeholder="Type your answer..."
            placeholderTextColor={colors.amethystSmoke}
            style={styles.input}
            multiline
          />
        </AnimatedEntry>
        <AnimatedEntry delay={240}>
          <PrimaryButton label="Submit Answer" onPress={handleSubmit} />
        </AnimatedEntry>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: colors.white,
    fontSize: typography.heading,
    fontWeight: '700',
  },
  category: {
    color: colors.icyBlue,
    fontSize: typography.caption,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  question: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  label: {
    color: colors.icyBlue,
    fontSize: typography.body,
  },
  input: {
    minHeight: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.grapeSoda,
    padding: 12,
    color: colors.white,
    backgroundColor: colors.surfaceAlt,
    textAlignVertical: 'top',
  },
});

export default PlayerTurnScreen;
