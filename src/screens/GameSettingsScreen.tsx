import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import Stepper from '../components/Stepper';
import Toggle from '../components/Toggle';
import AnimatedPressable from '../components/AnimatedPressable';
import AnimatedEntry from '../components/AnimatedEntry';
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
        <AnimatedEntry>
          <Text style={styles.title}>Game Settings</Text>
        </AnimatedEntry>

        <AnimatedEntry delay={80}>
          <View style={styles.row}>
            <AnimatedPressable
              onPress={() => navigation.navigate('PlayerNames')}
              style={styles.halfPressable}
              pressableStyle={styles.halfPressable}
            >
              <Card style={styles.halfCard}>
                <Text style={styles.cardLabel}>How many players?</Text>
                <Text style={styles.cardValue}>{players.length}</Text>
                <Text style={styles.cardHint}>Tap to edit names</Text>
              </Card>
            </AnimatedPressable>
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
        </AnimatedEntry>

        <AnimatedEntry delay={140}>
          <Text style={styles.sectionLabel}>Game Mode</Text>
          <Card style={styles.cardShadow}>
            <View style={styles.tileSelected}>
              <Text style={styles.tileTitle}>Question Game</Text>
              <Text style={styles.tileSubtitle}>Find who got a different question</Text>
            </View>
          </Card>
        </AnimatedEntry>

        <AnimatedEntry delay={200}>
          <Text style={styles.sectionLabel}>Categories</Text>
          <AnimatedPressable onPress={() => navigation.navigate('Categories')}>
            <Card style={[styles.cardShadow, styles.cardTouchable]}>
              <View style={styles.tileSelected}>
                <Text style={styles.tileTitle} numberOfLines={1} adjustsFontSizeToFit>
                  {categorySummary}
                </Text>
                <Text style={styles.tileSubtitle}>Tap to choose categories</Text>
              </View>
            </Card>
          </AnimatedPressable>
        </AnimatedEntry>

        <AnimatedEntry delay={260}>
          <Card style={styles.toggleCard}>
            <Toggle
              label="Show Category to Imposter"
              value={showCategory}
              onChange={setShowCategory}
            />
          </Card>
        </AnimatedEntry>

        <AnimatedEntry delay={320}>
          <PrimaryButton label="Start Game" onPress={handleStart} style={styles.primaryButton} />

          <AnimatedPressable
            pressableStyle={styles.secondaryButton}
            onPress={() => navigation.navigate('OtherPartyGames')}
          >
            <Text style={styles.secondaryText}>OTHER PARTY GAMES</Text>
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
});

export default GameSettingsScreen;
