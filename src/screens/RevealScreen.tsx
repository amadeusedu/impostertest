import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import AnimatedEntry from '../components/AnimatedEntry';
import { colors, spacing, typography, radii, shadows } from '../theme/tokens';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useGame } from '../utils/GameContext';
import { tallyVotes } from '../utils/game';

const RevealScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { players, round, playAgain, resetToSettings } = useGame();
  const [revealed, setRevealed] = useState(false);
  const glow = useRef(new Animated.Value(0)).current;
  const revealScale = useRef(new Animated.Value(0.6)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [glow]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRevealed(true);
      Animated.parallel([
        Animated.spring(revealScale, { toValue: 1, useNativeDriver: true, speed: 16 }),
        Animated.timing(revealOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
      ]).start();
    }, 1200);
    return () => clearTimeout(timeout);
  }, [revealOpacity, revealScale]);

  if (!round) {
    return null;
  }

  const { topIds } = tallyVotes(players, round.votes);
  const imposterNames = players
    .filter((player) => round.imposterIds.includes(player.id))
    .map((player) => player.name)
    .join(', ');
  const groupWins = topIds.some((id) => round.imposterIds.includes(id));
  const questionTitle = useMemo(() => round.questionPair.main, [round.questionPair.main]);
  const imposterQuestion = useMemo(() => {
    if (round.questionPair.alt && round.questionPair.alt !== round.questionPair.main) {
      return round.questionPair.alt;
    }
    return 'You saw a different question.';
  }, [round.questionPair.alt, round.questionPair.main]);

  const handlePlayAgain = () => {
    playAgain();
    navigation.replace('PlayersGrid');
  };

  const handleBackToSettings = () => {
    resetToSettings();
    navigation.replace('Settings');
  };

  const backdropOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.7],
  });

  return (
    <GradientBackground>
      <View style={styles.container}>
        <AnimatedEntry>
          <Text style={styles.title}>Reveal</Text>
          <Text style={styles.outcome}>{groupWins ? 'Group wins!' : 'Imposter wins!'}</Text>
        </AnimatedEntry>

        <View style={styles.revealZone}>
          {!revealed && (
            <Animated.View style={[styles.revealBackdrop, { opacity: backdropOpacity }]} />
          )}
          {!revealed && (
            <Animated.View style={[styles.revealCard, { opacity: glow }]}>
              <Text style={styles.revealingText}>Revealing...</Text>
            </Animated.View>
          )}
          <Animated.View
            style={[
              styles.revealCard,
              styles.revealHighlight,
              {
                opacity: revealOpacity,
                transform: [{ scale: revealScale }],
              },
            ]}
          >
            <Text style={styles.revealLabel}>Imposter</Text>
            <Text style={styles.revealName} numberOfLines={2} adjustsFontSizeToFit>
              {imposterNames || 'Unknown'}
            </Text>
          </Animated.View>
        </View>

        <AnimatedEntry delay={160}>
          <Card>
            <Text style={styles.sectionTitle}>Group Question</Text>
            <Text style={styles.questionText}>{questionTitle}</Text>
          </Card>
        </AnimatedEntry>

        <AnimatedEntry delay={220}>
          <Card>
            <Text style={styles.sectionTitle}>Imposter Saw</Text>
            <Text style={styles.questionText}>{imposterQuestion}</Text>
          </Card>
        </AnimatedEntry>

        <AnimatedEntry delay={260}>
          <PrimaryButton label="Play Again" onPress={handlePlayAgain} />
          <Text style={styles.secondaryLink} onPress={handleBackToSettings}>
            Back to Settings
          </Text>
        </AnimatedEntry>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.title,
    color: colors.white,
    fontWeight: '700',
  },
  outcome: {
    color: colors.icyBlue,
    fontSize: typography.heading,
    fontWeight: '600',
  },
  revealZone: {
    position: 'relative',
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealBackdrop: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.xl,
    backgroundColor: colors.black,
  },
  revealCard: {
    position: 'absolute',
    width: '100%',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    ...shadows.glow,
  },
  revealHighlight: {
    borderWidth: 1,
    borderColor: colors.accentSoft,
  },
  revealingText: {
    color: colors.icyBlue,
    fontSize: typography.subheading,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  revealLabel: {
    color: colors.amethystSmoke,
    textTransform: 'uppercase',
    fontSize: typography.caption,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  revealName: {
    color: colors.white,
    fontSize: typography.heading,
    fontWeight: '700',
  },
  sectionTitle: {
    color: colors.amethystSmoke,
    textTransform: 'uppercase',
    fontSize: typography.caption,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  questionText: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  secondaryLink: {
    color: colors.amethystSmoke,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: spacing.sm,
  },
});

export default RevealScreen;
