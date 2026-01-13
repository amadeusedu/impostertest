import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import AnimatedPressable from '../components/AnimatedPressable';
import AnimatedEntry from '../components/AnimatedEntry';
import { colors, spacing, typography, radii } from '../theme/tokens';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useGame } from '../utils/GameContext';

const PlayersGridScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { players, round } = useGame();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!round) {
      navigation.replace('Settings');
    }
  }, [round, navigation]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  if (!round) {
    return null;
  }

  const allAnswered = round.completedPlayerIds.length === players.length;
  const glowScale = useMemo(
    () =>
      pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.04],
      }),
    [pulse]
  );
  const glowOpacity = useMemo(
    () =>
      pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.35, 0.75],
      }),
    [pulse]
  );

  return (
    <GradientBackground>
      <View style={styles.container}>
        <AnimatedEntry>
          <Text style={styles.title}>Players</Text>
          <Text style={styles.subtitle}>
            Each player will see their question and submit an answer privately.
          </Text>
        </AnimatedEntry>

        <FlatList
          data={players}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.grid}
          renderItem={({ item, index }) => {
            const completed = round.completedPlayerIds.includes(item.id);
            const displayName = item.name?.trim() || `Player ${index + 1}`;
            return (
              <AnimatedPressable
                style={styles.tile}
                pressableStyle={styles.tilePressable}
                onPress={() =>
                  navigation.navigate('PassPhone', {
                    title: `Pass the phone`,
                    subtitle: `to ${displayName}`,
                    buttonLabel: `I'm ${displayName}`,
                    nextScreen: 'PlayerTurn',
                    nextParams: { playerId: item.id },
                  })
                }
              >
                <View style={styles.tileInner}>
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.pulseBorder,
                      completed && styles.pulseBorderCompleted,
                      { opacity: glowOpacity, transform: [{ scale: glowScale }] },
                    ]}
                  />
                  <Card style={[styles.card, completed && styles.cardCompleted]}>
                    <View style={styles.cardContent}>
                      <Text
                        style={styles.playerName}
                        numberOfLines={2}
                        adjustsFontSizeToFit
                        minimumFontScale={0.8}
                      >
                        {displayName}
                      </Text>
                      <Text style={styles.playerHint}>
                        {completed ? 'Answer submitted' : 'Tap to answer'}
                      </Text>
                      {completed && <Text style={styles.check}>✓</Text>}
                    </View>
                  </Card>
                </View>
              </AnimatedPressable>
            );
          }}
        />

        {allAnswered && (
          <AnimatedEntry delay={160}>
            <PrimaryButton
              label="View All Answers"
              onPress={() => navigation.navigate('AllAnswers')}
              style={styles.primaryButton}
            />
          </AnimatedEntry>
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
  tilePressable: {
    borderRadius: radii.lg,
  },
  tileInner: {
    position: 'relative',
  },
  card: {
    height: 140,
  },
  pulseBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.accentSoft,
  },
  pulseBorderCompleted: {
    borderColor: colors.success,
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
    gap: spacing.xs,
  },
  playerName: {
    color: colors.white,
    fontSize: typography.heading,
    fontWeight: '600',
    textAlign: 'center',
  },
  playerHint: {
    color: colors.icyBlue,
    fontSize: typography.caption,
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
