import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PlayerAvatar from '../components/PlayerAvatar';
import AnimatedPressable from '../components/AnimatedPressable';
import AnimatedEntry from '../components/AnimatedEntry';
import { colors, spacing, typography, radii } from '../theme/tokens';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useGame } from '../utils/GameContext';

const PlayerNamesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { players, updatePlayerName, addPlayer, removePlayer } = useGame();

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <AnimatedEntry>
          <Text style={styles.title}>Player Names</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>{players.length} Players</Text>
            <Text style={styles.summaryRange}>3–100</Text>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={120} style={styles.list}>
          {players.map((player, index) => (
            <Card key={player.id}>
              <View style={styles.playerRow}>
                <PlayerAvatar name={player.name} />
                <View style={styles.inputColumn}>
                  <Text style={styles.badge}>#{index + 1}</Text>
                  <TextInput
                    value={player.name}
                    onChangeText={(text) => updatePlayerName(player.id, text)}
                    placeholder="Player name"
                    placeholderTextColor={colors.amethystSmoke}
                    style={styles.input}
                  />
                </View>
              </View>
            </Card>
          ))}
        </AnimatedEntry>

        <AnimatedEntry delay={200}>
          <View style={styles.actions}>
            <AnimatedPressable
              style={[styles.actionButton, players.length <= 3 && styles.disabled]}
              pressableStyle={styles.actionButton}
              onPress={removePlayer}
              disabled={players.length <= 3}
            >
              <Text style={styles.actionText}>Remove</Text>
            </AnimatedPressable>
            <AnimatedPressable
              style={styles.actionButton}
              pressableStyle={styles.actionButton}
              onPress={addPlayer}
            >
              <Text style={styles.actionText}>Add</Text>
            </AnimatedPressable>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={260}>
          <AnimatedPressable
            pressableStyle={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>Back to Settings</Text>
          </AnimatedPressable>
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryText: {
    color: colors.icyBlue,
    fontSize: typography.subheading,
  },
  summaryRange: {
    color: colors.amethystSmoke,
    fontSize: typography.body,
  },
  list: {
    gap: spacing.md,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  inputColumn: {
    flex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.grapeSoda,
    color: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },
  input: {
    color: colors.white,
    fontSize: typography.body,
    borderBottomWidth: 1,
    borderBottomColor: colors.amethystSmoke,
    paddingVertical: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.grapeSoda,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
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

export default PlayerNamesScreen;
