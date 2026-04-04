import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../../src/data/loaders/DataContext';
import { useSearchStore } from '../../src/store';
import { WikiImage } from '../../src/components/ui/WikiImage';
import { ItemCard } from '../../src/components/items/ItemCard';
import { colors } from '../../src/theme/colors';
import { ItemCategory } from '../../src/types/common';
import { ItemIndex } from '../../src/types/item';

type Category = ItemCategory | 'all';

const CATEGORIES: { key: ItemCategory; label: string; icon: string }[] = [
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

function navigateToCategory(category: Category) {
  useSearchStore.getState().setCategory(category);
  useSearchStore.getState().setQuery('');
  router.push('/items');
}

export default function HomeScreen() {
  const { index, items, fuse } = useData();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const homeOpacity = useRef(new Animated.Value(1)).current;
  const resultsOpacity = useRef(new Animated.Value(0)).current;

  const counts = useMemo(() => {
    const map: Partial<Record<ItemCategory, number>> = {};
    index.filter((i) => !!i.name).forEach((i) => {
      map[i.category] = (map[i.category] ?? 0) + 1;
    });
    return map;
  }, [index]);

  const spotlight = useMemo(() => {
    const pool = Array.from(items.values()).filter(
      (i) => !!i.name && !!i.wikiSlug && i.rarity >= 4
    );
    return pool[Math.floor(Math.random() * pool.length)] ?? null;
  }, [items]);

  const searchResults = useMemo((): ItemIndex[] => {
    if (!query.trim() || !fuse) return index.filter((i) => !!i.name);
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse, index]);

  function enterSearch() {
    setSearching(true);
    setFocused(true);
    inputRef.current?.focus();
    Animated.parallel([
      Animated.timing(homeOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(resultsOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }

  function exitSearch() {
    Keyboard.dismiss();
    setQuery('');
    setSearching(false);
    setFocused(false);
    Animated.parallel([
      Animated.timing(homeOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(resultsOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search bar — always visible */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBar, focused && styles.searchBarFocused]}>
          <Ionicons
            name="search-outline"
            size={16}
            color={focused ? colors.brand.accent : colors.text.muted}
          />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search items, weapons, armor..."
            placeholderTextColor={colors.text.muted}
            value={query}
            onChangeText={setQuery}
            onFocus={enterSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={16} color={colors.text.muted} />
            </Pressable>
          )}
        </View>
        {searching && (
          <Pressable onPress={exitSearch} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        )}
      </View>

      {/* Shared content area — results and home sit in the same space */}
      <View style={{ flex: 1 }}>
        {/* Search results */}
        <Animated.View
          pointerEvents={searching ? 'auto' : 'none'}
          style={[StyleSheet.absoluteFill, { opacity: resultsOpacity }]}
        >
          <FlatList
            data={searchResults}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <ItemCard item={item} />}
            keyboardShouldPersistTaps="handled"
            contentInset={{ bottom: 90 }}
            getItemLayout={(_, i) => ({ length: 65, offset: 65 * i, index: i })}
          />
        </Animated.View>

        {/* Home content */}
        <Animated.View style={{ flex: 1, opacity: homeOpacity }} pointerEvents={searching ? 'none' : 'auto'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInset={{ bottom: 90 }}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.appTitle}>Terraria Wiki</Text>
              <Text style={styles.appSubtitle}>Your complete companion</Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="planet-outline" size={28} color={colors.brand.accent} />
            </View>
          </View>

          {/* Browse */}
          <Text style={styles.sectionLabel}>Browse</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.key}
                style={({ pressed }) => [styles.categoryTile, pressed && styles.categoryTilePressed]}
                onPress={() => navigateToCategory(cat.key)}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={cat.icon as any} size={26} color={colors.brand.accent} />
                </View>
                <Text style={styles.categoryName}>{cat.label}</Text>
                <Text style={styles.categoryCount}>{counts[cat.key] ?? 0} items</Text>
              </Pressable>
            ))}
          </View>

          {/* Item Spotlight */}
          {spotlight && (
            <>
              <Text style={styles.sectionLabel}>Item Spotlight</Text>
              <Pressable
                style={({ pressed }) => [styles.spotlightCard, pressed && styles.spotlightPressed]}
                onPress={() => router.push(`/item/${spotlight.id}`)}
              >
                <WikiImage wikiSlug={spotlight.wikiSlug} size={64} />
                <View style={styles.spotlightInfo}>
                  <Text style={styles.spotlightName} numberOfLines={1}>{spotlight.name}</Text>
                  <Text style={styles.spotlightCategory}>{spotlight.category}</Text>
                  {spotlight.damage !== undefined && (
                    <Text style={styles.spotlightStat}>
                      {spotlight.damage} {spotlight.damageType ?? ''} dmg
                    </Text>
                  )}
                  {spotlight.defense !== undefined && (
                    <Text style={styles.spotlightStat}>{spotlight.defense} defense</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
              </Pressable>
            </>
          )}

          {/* Coming Soon */}
          <Text style={styles.sectionLabel}>Coming Soon</Text>
          <View style={styles.comingSoonRow}>
            {[
              { icon: 'skull-outline', label: 'Boss\nChecklist' },
              { icon: 'time-outline',  label: 'Recently\nViewed' },
              { icon: 'bookmark-outline', label: 'Craft\nPlanner' },
            ].map((item) => (
              <View key={item.label} style={styles.comingSoonTile}>
                <Ionicons name={item.icon as any} size={28} color={colors.text.muted} />
                <Text style={styles.comingSoonName}>{item.label}</Text>
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={10} color={colors.text.muted} />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchBarFocused: {
    borderColor: colors.brand.accent,
    backgroundColor: colors.brand.accent + '0e',
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 15,
    padding: 0,
  },
  cancelBtn: {
    paddingVertical: 8,
  },
  cancelText: {
    color: colors.brand.accent,
    fontSize: 15,
    fontWeight: '500',
  },

  // Scroll content
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: colors.text.muted,
    marginTop: 2,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.bg.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.text.muted,
    marginBottom: 12,
  },

  // Category grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 32,
  },
  categoryTile: {
    width: '47%',
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  categoryTilePressed: {
    backgroundColor: colors.bg.surface,
    borderColor: colors.brand.accent + '55',
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.brand.accent + '18',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  categoryCount: {
    fontSize: 12,
    color: colors.text.muted,
  },

  // Spotlight
  spotlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  spotlightPressed: {
    backgroundColor: colors.bg.surface,
  },
  spotlightInfo: {
    flex: 1,
    gap: 3,
  },
  spotlightName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  spotlightCategory: {
    fontSize: 12,
    color: colors.text.muted,
  },
  spotlightStat: {
    fontSize: 13,
    color: colors.brand.accent,
    fontWeight: '500',
    marginTop: 2,
  },

  // Coming soon
  comingSoonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  comingSoonTile: {
    flex: 1,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    opacity: 0.6,
  },
  comingSoonName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
    lineHeight: 18,
  },
  lockBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.bg.surface,
    borderRadius: 6,
    padding: 4,
  },
});
