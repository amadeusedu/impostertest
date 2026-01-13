import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { categoryList } from '../data/questions';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors, spacing, typography, radii } from '../theme/tokens';
import { useGame } from '../utils/GameContext';

const CategoriesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { selectedCategories, setSelectedCategories } = useGame();

  const activeCount = selectedCategories.length;
  const summary = useMemo(() => {
    if (activeCount === 0) {
      return 'All categories selected';
    }
    if (activeCount === 1) {
      return `${selectedCategories[0]} selected`;
    }
    return `${activeCount} categories selected`;
  }, [activeCount, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>{summary}</Text>

        <Card style={styles.allCategoriesCard}>
          <Pressable
            onPress={() => setSelectedCategories([])}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <View>
              <Text style={styles.cardTitle}>All Categories</Text>
              <Text style={styles.cardSubtitle}>Mix every category together</Text>
            </View>
            {activeCount === 0 && <Text style={styles.selectedBadge}>Selected</Text>}
          </Pressable>
        </Card>

        <View style={styles.list}>
          {categoryList.map((category) => {
            const selected = selectedCategories.includes(category);
            return (
              <Card key={category}>
                <Pressable
                  onPress={() => toggleCategory(category)}
                  style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                >
                  <View>
                    <Text style={styles.cardTitle}>{category}</Text>
                    <Text style={styles.cardSubtitle}>
                      {selected ? 'Included in the rotation' : 'Tap to include this category'}
                    </Text>
                  </View>
                  {selected && <Text style={styles.selectedBadge}>Selected</Text>}
                </Pressable>
              </Card>
            );
          })}
        </View>

        <PrimaryButton label="Done" onPress={() => navigation.goBack()} />

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
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
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
  selectedBadge: {
    color: colors.deepMocha,
    backgroundColor: colors.icyBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  allCategoriesCard: {
    borderRadius: radii.lg,
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

export default CategoriesScreen;
