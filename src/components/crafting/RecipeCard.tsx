import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { WikiImage } from '../ui/WikiImage';
import { colors } from '../../theme/colors';
import { Recipe } from '../../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  /** If true, show the result item header (used on ingredient detail screens) */
  showResult?: boolean;
}

export function RecipeCard({ recipe, showResult = true }: RecipeCardProps) {
  return (
    <View style={styles.card}>
      {showResult && (
        <Pressable
          style={styles.result}
          onPress={() => router.push(`/item/${recipe.resultId}`)}
        >
          <WikiImage wikiSlug={recipe.resultWikiSlug} size={28} />
          <Text style={styles.resultName}>{recipe.resultName}</Text>
          {recipe.resultQuantity > 1 && (
            <Text style={styles.qty}>×{recipe.resultQuantity}</Text>
          )}
        </Pressable>
      )}

      <View style={styles.stationRow}>
        <Text style={styles.stationLabel}>at </Text>
        <Text style={styles.station}>{recipe.craftingStation}</Text>
      </View>

      <View style={styles.ingredients}>
        {recipe.ingredients.map((ing) => (
          <Pressable
            key={ing.id}
            style={styles.ingredient}
            onPress={() => router.push(`/item/${ing.id}`)}
          >
            <WikiImage wikiSlug={ing.wikiSlug} size={24} />
            <Text style={styles.ingName} numberOfLines={1}>
              {ing.name}
            </Text>
            <Text style={styles.ingQty}>×{ing.quantity}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  resultName: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  qty: {
    color: colors.brand.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  stationRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 2,
  },
  stationLabel: {
    color: colors.text.muted,
    fontSize: 12,
  },
  station: {
    color: colors.brand.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  ingredients: {
    padding: 8,
    gap: 4,
  },
  ingredient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    gap: 8,
    borderRadius: 4,
  },
  ingName: {
    color: colors.text.secondary,
    fontSize: 13,
    flex: 1,
  },
  ingQty: {
    color: colors.text.muted,
    fontSize: 12,
  },
});
