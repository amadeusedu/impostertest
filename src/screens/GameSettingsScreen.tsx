import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import Stepper from '../components/Stepper';
import Toggle from '../components/Toggle';
import { colors, spacing, typography } from '../theme/tokens';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useGame } from '../utils/GameContext';

const GameSettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    players,
    imposterCount,
    setImposterCount,
    showCategory,
    setShowCategory,
    startGame,
  } = useGame();

  const maxImposters = useMemo(() => {
    const cap = Math.max(1, Math.min(Math.floor(players.length / 3), players.length - 2));
    return cap;
  }, [players.length]);

  useEffect(() => {
    if (imposterCount > maxImposters) {
      setImposterCount(maxImposters);
    }
  }, [imposterCount, maxImposters, setImposterCount]);

  const handleStart = () => {
    startGame();
    navigation.navigate('PlayersGrid');
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Game Settings</Text>

        <View style={styles.row}>
          <Card style={styles.halfCard}>
            <Text style={styles.cardLabel}>How many players?</Text>
            <Text style={styles.cardValue}>{players.length}</Text>
          </Card>
          <Card style={styles.halfCard}>
            <Text style={styles.cardLabel}>How many imposters?</Text>
            <Stepper
              value={Math.min(imposterCount, maxImposters)}
              min={1}
              max={maxImposters}
              onChange={setImposterCount}
            />
          </Card>
        </View>

        <Text style={styles.sectionLabel}>Game Mode</Text>
        <Card>
          <Pressable style={styles.tileSelected}>
            <Text style={styles.tileTitle}>Question Game</Text>
            <Text style={styles.tileSubtitle}>Find who got a different question</Text>
          </Pressable>
        </Card>

        <Text style={styles.sectionLabel}>Categories</Text>
        <Card>
          <Pressable style={styles.tileSelected}>
            <Text style={styles.tileTitle}>All Categories</Text>
            <Text style={styles.tileSubtitle}>Mix of every category</Text>
          </Pressable>
        </Card>

        <Card style={styles.toggleCard}>
          <Toggle
            label="Show Category to Imposter"
            value={showCategory}
            onChange={setShowCategory}
          />
        </Card>

        <PrimaryButton label="Start Game" onPress={handleStart} style={styles.primaryButton} />

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('PlayerNames')}
        >
          <Text style={styles.secondaryText}>Edit Player Names</Text>
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
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfCard: {
    flex: 1,
  },
  cardLabel: {
    color: colors.icyBlue,
    fontSize: typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardValue: {
    color: colors.white,
    fontSize: typography.heading,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  sectionLabel: {
    color: colors.amethystSmoke,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  tileSelected: {
    gap: 6,
  },
  tileTitle: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  tileSubtitle: {
    color: colors.icyBlue,
    fontSize: typography.caption,
  },
  toggleCard: {
    paddingVertical: spacing.md,
  },
  primaryButton: {
    marginTop: spacing.sm,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  secondaryText: {
    color: colors.amethystSmoke,
    fontSize: typography.body,
    textDecorationLine: 'underline',
  },
});

export default GameSettingsScreen;
