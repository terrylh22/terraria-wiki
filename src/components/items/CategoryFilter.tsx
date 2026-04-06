import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { ItemCategory } from '../../types/common';

type Category = ItemCategory | 'all';

const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: 'all',       label: 'All Items',  icon: 'apps-outline' },
  { key: 'Weapon',    label: 'Weapons',    icon: 'flash-outline' },
  { key: 'Armor',     label: 'Armor',      icon: 'shield-outline' },
  { key: 'Accessory', label: 'Accessories',icon: 'diamond-outline' },
  { key: 'Tool',      label: 'Tools',      icon: 'construct-outline' },
  { key: 'Potion',    label: 'Potions',    icon: 'flask-outline' },
  { key: 'Material',  label: 'Materials',  icon: 'cube-outline' },
  { key: 'Ammo',      label: 'Ammo',       icon: 'send-outline' },
  { key: 'Block',     label: 'Blocks',     icon: 'square-outline' },
  { key: 'Furniture', label: 'Furniture',  icon: 'home-outline' },
  { key: 'Other',     label: 'Other',      icon: 'help-circle-outline' },
];

interface CategoryFilterProps {
  selected: Category;
  onSelect: (cat: Category) => void;
  onFilterStart?: () => void;
}

export function CategoryFilter({ selected, onSelect, onFilterStart }: CategoryFilterProps) {
  const [expanded, setExpanded] = useState(false);
  const [pressed, setPressed] = useState(false);
  const gridOpacity = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(1)).current;

  const selectedLabel = CATEGORIES.find((c) => c.key === selected)?.label ?? 'All Items';

  useEffect(() => {
    Animated.timing(labelOpacity, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [selected]);

  const toggle = useCallback(() => {
    if (expanded) {
      Animated.timing(gridOpacity, {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => setExpanded(false));
    } else {
      gridOpacity.setValue(0);
      setExpanded(true);
      Animated.timing(gridOpacity, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    }
  }, [expanded]);

  function selectCategory(cat: Category) {
    onSelect(cat);
    Animated.parallel([
      Animated.timing(gridOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(labelOpacity, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      setExpanded(false);
    });
  }

  return (
    <View style={styles.wrapper}>
      {/* Trigger button */}
      <Pressable
        onPress={toggle}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={[styles.trigger, pressed && !expanded && styles.triggerPressed]}
      >
        <Ionicons name="options-outline" size={16} color={colors.brand.accent} />
        <Animated.Text style={[styles.triggerText, { opacity: labelOpacity }]}>{selectedLabel}</Animated.Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={colors.text.muted}
        />
      </Pressable>

      {/* Expandable grid — overlays the list below */}
      {expanded && (
        <Animated.View style={[styles.dropdown, { opacity: gridOpacity }]}>
          <View style={styles.grid}>
            {CATEGORIES.map((cat) => {
              const active = cat.key === selected;
              return (
                <Pressable
                  key={cat.key}
                  onPress={() => selectCategory(cat.key)}
                  style={[styles.gridItem, active && styles.gridItemActive]}
                >
                  {({ pressed: p }) => (
                    <View style={[styles.gridItemInner, p && !active && styles.gridItemPressed]}>
                      <Ionicons
                        name={cat.icon as any}
                        size={24}
                        color={active ? colors.brand.accent : colors.text.secondary}
                      />
                      <Text style={[styles.gridLabel, active && styles.gridLabelActive]}>
                        {cat.label}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
    marginTop: 4,
    zIndex: 10,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  triggerPressed: {
    backgroundColor: colors.bg.surface,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: colors.bg.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  triggerText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 15,
    fontFamily: fonts.medium,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    flex: 1,
    minWidth: '28%',
    maxWidth: '32%',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.bg.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  gridItemInner: {
    alignItems: 'center',
    gap: 6,
  },
  gridItemPressed: {
    opacity: 0.6,
  },
  gridItemActive: {
    borderColor: colors.brand.accent,
    backgroundColor: colors.brand.accent + '18',
  },
  gridLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  gridLabelActive: {
    color: colors.brand.accent,
    fontFamily: fonts.semiBold,
  },
});
