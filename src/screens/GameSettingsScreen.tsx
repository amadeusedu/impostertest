import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import Stepper from '../components/Stepper';
import Toggle from '../components/Toggle';
import { colors, spacing, typography, radii, shadows } from '../theme/tokens';
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
    selectedCategories,
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

  const categorySummary = useMemo(() => {
    if (selectedCategories.length === 0) {
      return 'All Categories';
    }
    if (selectedCategories.length <= 2) {
      return selectedCategories.join(', ');
    }
    return `${selectedCategories.slice(0, 2).join(', ')} +${selectedCategories.length - 2}`;
  }, [selectedCategories]);

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Game Settings</Text>

        <View style={styles.row}>
          <Pressable
            onPress={() => navigation.navigate('PlayerNames')}
            style={({ pressed }) => [
              styles.halfPressable,
              pressed && styles.pressedCard,
            ]}
          >
            <Card style={styles.halfCard}>
              <Text style={styles.cardLabel}>How many players?</Text>
              <Text style={styles.cardValue}>{players.length}</Text>
              <Text style={styles.cardHint}>Tap to edit names</Text>
            </Card>
          </Pressable>
          <View style={styles.halfPressable}>
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
        </View>

        <Text style={styles.sectionLabel}>Game Mode</Text>
        <Card style={styles.cardShadow}>
          <Pressable style={styles.tileSelected}>
            <Text style={styles.tileTitle}>Question Game</Text>
            <Text style={styles.tileSubtitle}>Find who got a different question</Text>
          </Pressable>
        </Card>

        <Text style={styles.sectionLabel}>Categories</Text>
        <Pressable
          onPress={() => navigation.navigate('Categories')}
          style={({ pressed }) => [pressed && styles.pressedCard]}
        >
          <Card style={[styles.cardShadow, styles.cardTouchable]}>
            <View style={styles.tileSelected}>
              <Text style={styles.tileTitle}>{categorySummary}</Text>
              <Text style={styles.tileSubtitle}>Tap to choose categories</Text>
            </View>
          </Card>
        </Pressable>

        <Card style={styles.toggleCard}>
          <Toggle
            label="Show Category to Imposter"
            value={showCategory}
            onChange={setShowCategory}
          />
        </Card>

        <PrimaryButton label="Start Game" onPress={handleStart} style={styles.primaryButton} />

        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressedSecondary]}
          onPress={() => navigation.navigate('OtherPartyGames')}
        >
          <Text style={styles.secondaryText}>OTHER PARTY GAMES</Text>
        </Pressable>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
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
  halfPressable: {
    flex: 1,
  },
  halfCard: {
    flex: 1,
    ...shadows.glow,
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
  cardHint: {
    color: colors.amethystSmoke,
    fontSize: typography.caption,
    marginTop: spacing.xs,
  },
  sectionLabel: {
    color: colors.amethystSmoke,
    fontSize: typography.subheading,
    fontWeight: '600',
    letterSpacing: 0.4,
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
  cardShadow: {
    ...shadows.glow,
  },
  cardTouchable: {
    borderRadius: radii.lg,
  },
  toggleCard: {
    paddingVertical: spacing.md,
  },
  primaryButton: {
    marginTop: spacing.sm,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.grapeSoda,
  },
  secondaryText: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  pressedCard: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  pressedSecondary: {
    backgroundColor: colors.surfaceAlt,
  },
});

export default GameSettingsScreen;
