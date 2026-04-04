import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, rarityNames } from '../../theme/colors';
import { Rarity } from '../../types/common';

interface RarityBadgeProps {
  rarity: Rarity;
}

export function RarityBadge({ rarity }: RarityBadgeProps) {
  const color = colors.rarity[rarity] ?? colors.rarity[0];
  const name = rarityNames[rarity] ?? 'Unknown';
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
