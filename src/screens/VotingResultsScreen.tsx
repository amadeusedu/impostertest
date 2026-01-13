import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Animated, FlatList } from 'react-native';
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

const VotingResultsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { players, round } = useGame();

  if (!round) {
    return null;
  }

  const { counts, maxVotes } = tallyVotes(players, round.votes);
  const sortedPlayers = useMemo(
    () =>
      [...players].sort((a, b) => {
        const diff = (counts[a.id] ?? 0) - (counts[b.id] ?? 0);
        if (diff !== 0) return diff;
        return a.name.localeCompare(b.name);
      }),
    [counts, players]
  );
  const highlightIds = useMemo(() => {
    const topCount = Math.max(...sortedPlayers.map((player) => counts[player.id] ?? 0));
    return sortedPlayers.filter((player) => counts[player.id] === topCount).map((player) => player.id);
  }, [counts, sortedPlayers]);

  const animationsRef = useRef<Animated.Value[]>([]);
  if (animationsRef.current.length !== sortedPlayers.length) {
    animationsRef.current = sortedPlayers.map(() => new Animated.Value(0));
  }

  useEffect(() => {
    const animations = animationsRef.current.map((value) =>
      Animated.timing(value, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      })
    );
    Animated.stagger(120, animations).start();
  }, [sortedPlayers.length]);

  return (
    <GradientBackground>
      <View style={styles.container}>
        <AnimatedEntry>
          <Text style={styles.title}>Vote Results</Text>
          <Text style={styles.subtitle}>From least to most votes</Text>
        </AnimatedEntry>

        <FlatList
          data={sortedPlayers}
          keyExtractor={(item) => item.id}
          style={styles.listContainer}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const count = counts[item.id] ?? 0;
            const width = maxVotes > 0 ? `${(count / maxVotes) * 100}%` : '0%';
            const isTop = highlightIds.includes(item.id);
            const animation = animationsRef.current[index];
            return (
              <Animated.View
                style={[
                  styles.animatedRow,
                  {
                    opacity: animation,
                    transform: [
                      {
                        translateY: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [12, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Card style={[styles.voteCard, isTop && styles.topCard]}>
                  <View style={styles.voteRow}>
                    <View style={styles.voteInfo}>
                      <Text style={styles.playerName} numberOfLines={1} adjustsFontSizeToFit>
                        {item.name}
                      </Text>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width }]} />
                      </View>
                    </View>
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>{count}</Text>
                    </View>
                  </View>
                </Card>
              </Animated.View>
            );
          }}
        />

        <AnimatedEntry delay={220}>
          <PrimaryButton label="Reveal the Imposter" onPress={() => navigation.navigate('Reveal')} />
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
  subtitle: {
    color: colors.icyBlue,
    fontSize: typography.body,
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  listContainer: {
    flex: 1,
  },
  animatedRow: {
    transform: [{ translateY: 0 }],
  },
  voteCard: {
    borderRadius: radii.lg,
  },
  topCard: {
    ...shadows.glow,
    borderWidth: 1,
    borderColor: colors.accentSoft,
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  voteInfo: {
    flex: 1,
    gap: spacing.sm,
  },
  playerName: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  barTrack: {
    height: 10,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.pill,
  },
  barFill: {
    height: 10,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
  },
  countBadge: {
    minWidth: 44,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.grapeSoda,
    alignItems: 'center',
  },
  countText: {
    color: colors.white,
    fontWeight: '700',
  },
});

export default VotingResultsScreen;
