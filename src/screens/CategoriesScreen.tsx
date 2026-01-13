import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import AnimatedPressable from '../components/AnimatedPressable';
import AnimatedEntry from '../components/AnimatedEntry';
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

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <AnimatedEntry>
          <Text style={styles.title}>Categories</Text>
          <Text style={styles.subtitle}>{summary}</Text>
        </AnimatedEntry>

        <AnimatedEntry delay={80}>
          <Card style={styles.allCategoriesCard}>
            <AnimatedPressable
              onPress={() => setSelectedCategories([])}
              style={styles.row}
              pressableStyle={styles.rowPressable}
            >
              <View>
                <Text style={styles.cardTitle}>All Categories</Text>
                <Text style={styles.cardSubtitle}>Mix every category together</Text>
              </View>
              {activeCount === 0 && <Text style={styles.selectedBadge}>Selected</Text>}
            </AnimatedPressable>
          </Card>
        </AnimatedEntry>

        <AnimatedEntry delay={140} style={styles.list}>
          {categoryList.map((category) => {
            const selected = selectedCategories.includes(category);
            return (
              <Card key={category}>
                <AnimatedPressable
                  onPress={() => navigation.navigate('CategoryDetail', { category })}
                  style={styles.row}
                  pressableStyle={styles.rowPressable}
                >
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle} numberOfLines={1} adjustsFontSizeToFit>
                      {category}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      {selected ? 'Included in the rotation' : 'Tap to view questions'}
                    </Text>
                  </View>
                  {selected && <Text style={styles.selectedBadge}>Selected</Text>}
                </AnimatedPressable>
              </Card>
            );
          })}
        </AnimatedEntry>

        <AnimatedEntry delay={220}>
          <PrimaryButton label="Done" onPress={() => navigation.goBack()} />

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
  rowPressable: {
    borderRadius: radii.lg,
  },
  cardText: {
    flex: 1,
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
