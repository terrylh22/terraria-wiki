import React, { useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { ItemCategory } from '../../types/common';

type Category = ItemCategory | 'all';

const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: 'all',       label: 'All Items',   icon: 'apps-outline' },
  { key: 'Weapon',    label: 'Weapons',     icon: 'flash-outline' },
  { key: 'Armor',     label: 'Armor',       icon: 'shield-outline' },
  { key: 'Accessory', label: 'Accessories', icon: 'diamond-outline' },
  { key: 'Tool',      label: 'Tools',       icon: 'construct-outline' },
  { key: 'Potion',    label: 'Potions',     icon: 'flask-outline' },
  { key: 'Material',  label: 'Materials',   icon: 'cube-outline' },
  { key: 'Ammo',      label: 'Ammo',        icon: 'send-outline' },
  { key: 'Block',     label: 'Blocks',      icon: 'square-outline' },
  { key: 'Furniture', label: 'Furniture',   icon: 'home-outline' },
  { key: 'Other',     label: 'Other',       icon: 'help-circle-outline' },
];

interface CategoryFilterProps {
  selected: Category;
  onSelect: (cat: Category) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const [visible, setVisible] = useState(false);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(500)).current;

  const selectedLabel = CATEGORIES.find((c) => c.key === selected)?.label ?? 'All Items';

  function openSheet() {
    setVisible(true);
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(sheetY, { toValue: 0, damping: 26, stiffness: 280, mass: 0.7, useNativeDriver: true }),
    ]).start();
  }

  function closeSheet(cat?: Category) {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: 500, duration: 220, useNativeDriver: true }),
    ]).start(() => {
      setVisible(false);
      if (cat !== undefined) onSelect(cat);
    });
  }

  return (
    <>
      <Pressable onPress={openSheet} style={styles.trigger}>
        <Ionicons name="options-outline" size={16} color={colors.brand.accent} />
        <Text style={styles.triggerText}>{selectedLabel}</Text>
        <Ionicons name="chevron-down" size={14} color={colors.text.muted} />
      </Pressable>

      <Modal visible={visible} transparent animationType="none" onRequestClose={() => closeSheet()}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => closeSheet()} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Filter by Category</Text>
          <View style={styles.grid}>
            {CATEGORIES.map((cat) => {
              const active = cat.key === selected;
              return (
                <Pressable
                  key={cat.key}
                  onPress={() => closeSheet(cat.key)}
                  style={[styles.gridItem, active && styles.gridItemActive]}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={24}
                    color={active ? colors.brand.accent : colors.text.secondary}
                  />
                  <Text style={[styles.gridLabel, active && styles.gridLabelActive]}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  triggerText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bg.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    color: colors.text.muted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.bg.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  gridItemActive: {
    borderColor: colors.brand.accent,
    backgroundColor: colors.brand.accent + '18',
  },
  gridLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  gridLabelActive: {
    color: colors.brand.accent,
    fontWeight: '600',
  },
});
