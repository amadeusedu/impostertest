import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PlayerAvatar from '../components/PlayerAvatar';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, typography, radii } from '../theme/tokens';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useGame } from '../utils/GameContext';

const PlayersGridScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { players, round } = useGame();

  useEffect(() => {
    if (!round) {
      navigation.replace('Settings');
    }
  }, [round, navigation]);

  if (!round) {
    return null;
  }

  const allAnswered = round.completedPlayerIds.length === players.length;

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Players</Text>
        <Text style={styles.subtitle}>
          Each player will see their question and submit an answer privately.
        </Text>

        <FlatList
          data={players}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => {
            const completed = round.completedPlayerIds.includes(item.id);
            return (
              <Pressable
                style={styles.tile}
                onPress={() =>
                  navigation.navigate('PassPhone', {
                    title: `Pass the phone`,
                    subtitle: `to ${item.name}`,
                    buttonLabel: `I'm ${item.name}`,
                    nextScreen: 'PlayerTurn',
                    nextParams: { playerId: item.id },
                  })
                }
              >
                <Card style={[styles.card, completed && styles.cardCompleted]}>
                  <View style={styles.cardContent}>
                    <PlayerAvatar name={item.name} size={48} />
                    <Text style={styles.playerName}>{item.name}</Text>
                    {completed && <Text style={styles.check}>✓</Text>}
                  </View>
                </Card>
              </Pressable>
            );
          }}
        />

        {allAnswered && (
          <PrimaryButton
            label="View All Answers"
            onPress={() => navigation.navigate('AllAnswers')}
            style={styles.primaryButton}
          />
        )}
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.title,
    color: colors.white,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.icyBlue,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    fontSize: typography.body,
  },
  grid: {
    gap: spacing.md,
  },
  column: {
    gap: spacing.md,
  },
  tile: {
    flex: 1,
  },
  card: {
    height: 140,
  },
  cardCompleted: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.success,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  playerName: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  check: {
    color: colors.success,
    fontSize: typography.subheading,
    fontWeight: '700',
  },
  primaryButton: {
    marginTop: spacing.lg,
  },
});

export default PlayersGridScreen;
