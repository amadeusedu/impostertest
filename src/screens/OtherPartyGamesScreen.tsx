import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors, spacing, typography, radii } from '../theme/tokens';

const games = [
  {
    title: 'Word Imposter',
    description: 'The current word-guessing party game you are playing.',
  },
  {
    title: 'Guess the Celeb',
    description: 'Act out or describe celebrities for your team to guess.',
  },
  {
    title: 'Most Likely To',
    description: 'Vote on who fits the prompt and defend your pick.',
  },
  {
    title: 'Would You Rather',
    description: 'Debate two options and see where the room lands.',
  },
  {
    title: 'Never Have I Ever',
    description: 'Reveal secrets with classic party confessions.',
  },
  {
    title: 'Truth or Dare',
    description: 'Choose honesty or a daring challenge.',
  },
];

const OtherPartyGamesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Other Party Games</Text>
        <Text style={styles.subtitle}>
          We are cooking up more game modes. Here is what is next.
        </Text>

        <View style={styles.list}>
          {games.map((game) => (
            <Card key={game.title}>
              <View style={styles.row}>
                <View style={styles.textColumn}>
                  <Text style={styles.cardTitle}>{game.title}</Text>
                  <Text style={styles.cardSubtitle}>{game.description}</Text>
                </View>
                <Text style={styles.badge}>Coming soon</Text>
              </View>
            </Card>
          ))}
        </View>

        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back to Settings</Text>
        </Pressable>
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
    fontSize: typography.body,
  },
  list: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  textColumn: {
    flex: 1,
  },
  cardTitle: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: colors.amethystSmoke,
    fontSize: typography.caption,
    marginTop: spacing.xs,
  },
  badge: {
    backgroundColor: colors.grapeSoda,
    color: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    fontSize: typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  backButton: {
    alignItems: 'center',
  },
  backText: {
    color: colors.amethystSmoke,
    fontSize: typography.body,
    textDecorationLine: 'underline',
  },
});

export default OtherPartyGamesScreen;
