import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import AnimatedPressable from '../components/AnimatedPressable';
import AnimatedEntry from '../components/AnimatedEntry';
import { questionPairs } from '../data/questions';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors, spacing, typography, radii, shadows } from '../theme/tokens';
import { useGame } from '../utils/GameContext';

const CategoryDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { category } = route.params as RootStackParamList['CategoryDetail'];
  const { selectedCategories, setSelectedCategories } = useGame();

  const questions = useMemo(
    () => questionPairs.filter((pair) => pair.category === category),
    [category]
  );

  const isSelected = selectedCategories.includes(category);

  const handleSelect = () => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <AnimatedEntry>
          <Text style={styles.title}>{category}</Text>
          <Text style={styles.subtitle}>{questions.length} questions available</Text>
        </AnimatedEntry>

        <AnimatedEntry delay={120} style={styles.listWrapper}>
          <FlatList
            data={questions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Card>
                <View style={styles.questionRow}>
                  <Text style={styles.questionIndex}>{index + 1}</Text>
                  <View style={styles.questionText}>
                    <Text style={styles.questionMain}>{item.main}</Text>
                    <Text style={styles.questionAlt}>Imposter prompt: {item.alt}</Text>
                  </View>
                </View>
              </Card>
            )}
          />
        </AnimatedEntry>

        <AnimatedEntry delay={220}>
          <PrimaryButton
            label={isSelected ? 'Selected' : 'Select'}
            onPress={handleSelect}
            style={[styles.selectButton, isSelected && styles.selectedButton]}
          />
          <AnimatedPressable
            pressableStyle={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>Back to Categories</Text>
          </AnimatedPressable>
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
  listWrapper: {
    flex: 1,
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  questionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  questionIndex: {
    color: colors.icyBlue,
    fontSize: typography.subheading,
    fontWeight: '700',
  },
  questionText: {
    flex: 1,
    gap: spacing.xs,
  },
  questionMain: {
    color: colors.white,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  questionAlt: {
    color: colors.amethystSmoke,
    fontSize: typography.caption,
  },
  selectButton: {
    ...shadows.glow,
  },
  selectedButton: {
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radii.pill,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  backText: {
    color: colors.amethystSmoke,
    fontSize: typography.body,
    textDecorationLine: 'underline',
  },
});

export default CategoryDetailScreen;
