import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { WikiImage } from '../ui/WikiImage';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { ItemIndex } from '../../types/item';

interface ItemCardProps {
  item: ItemIndex;
}

export const ItemCard = memo(function ItemCard({ item }: ItemCardProps) {
  const rarityColor = colors.rarity[item.rarity] ?? colors.rarity[0];

  return (
    <Pressable
      onPress={() => router.push(`/item/${item.id}`)}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.container}>
        <WikiImage wikiSlug={item.wikiSlug} size={44} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
        <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 14,
  },
  pressed: {
    backgroundColor: colors.bg.surface,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.text.primary,
    fontSize: 17,
    fontFamily: fonts.semiBold,
  },
  category: {
    color: colors.text.muted,
    fontSize: 13,
    fontFamily: fonts.regular,
    marginTop: 3,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
