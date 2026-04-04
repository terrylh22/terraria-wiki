import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { ItemCategory } from '../../types/common';

const CATEGORIES: Array<ItemCategory | 'all'> = [
  'all', 'Weapon', 'Armor', 'Accessory', 'Tool',
  'Potion', 'Material', 'Ammo', 'Block', 'Furniture', 'Other',
];

interface CategoryFilterProps {
  selected: ItemCategory | 'all';
  onSelect: (cat: ItemCategory | 'all') => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const active = cat === selected;
        return (
          <Pressable
            key={cat}
            onPress={() => onSelect(cat)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.pillText, active && styles.pillTextActive]}>
              {cat === 'all' ? 'All' : cat}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    flexDirection: 'row',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.bg.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.brand.accent,
    borderColor: colors.brand.accent,
  },
  pillText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  pillTextActive: {
    color: colors.bg.primary,
    fontWeight: '700',
  },
});
