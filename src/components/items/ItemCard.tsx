import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { WikiImage } from '../ui/WikiImage';
import { colors } from '../../theme/colors';
import { ItemIndex } from '../../types/item';

interface ItemCardProps {
  item: ItemIndex;
}

export const ItemCard = memo(function ItemCard({ item }: ItemCardProps) {
  const rarityColor = colors.rarity[item.rarity] ?? colors.rarity[0];

  return (
    <Pressable
      onPress={() => router.push(`/item/${item.id}`)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <WikiImage wikiSlug={item.wikiSlug} size={36} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
      <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 12,
  },
  pressed: {
    backgroundColor: colors.bg.surface,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  category: {
    color: colors.text.muted,
    fontSize: 12,
    marginTop: 2,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
