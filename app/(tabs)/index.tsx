import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../../src/data/loaders/DataContext';
import { useSearchStore } from '../../src/store';
import { ItemCard } from '../../src/components/items/ItemCard';
import { colors } from '../../src/theme/colors';
import { ItemCategory } from '../../src/types/common';
import { ItemIndex } from '../../src/types/item';

type Category = ItemCategory | 'all';

const MAIN_CATEGORIES: { key: ItemCategory; label: string; wikiSlug: string }[] = [
  { key: 'Weapon',    label: 'Weapons',   wikiSlug: 'Meowmere' },
  { key: 'Armor',     label: 'Armor',     wikiSlug: 'Solar_Flare_Helmet' },
  { key: 'Accessory', label: 'Accessory', wikiSlug: 'Celestial_Shell' },
  { key: 'Tool',      label: 'Tools',     wikiSlug: 'Vortex_Pickaxe' },
  { key: 'Potion',    label: 'Potions',   wikiSlug: 'Super_Healing_Potion' },
  { key: 'Material',  label: 'Materials', wikiSlug: 'Luminite_Bar' },
];

function navigateToCategory(category: Category) {
  useSearchStore.getState().setCategory(category);
  useSearchStore.getState().setQuery('');
  router.push('/items');
}

export default function HomeScreen() {
  const { index, fuse } = useData();
  const { width } = useWindowDimensions();
  // Two columns with 16px padding on each side and a 10px gap between
  const tileWidth = (width - 16 * 2 - 10) / 2;
  const tileHeight = Math.round(tileWidth * 0.8);

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

      {/* Shared content area */}
      <View style={styles.contentArea}>
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
        <Animated.View
          style={[styles.homeView, { opacity: homeOpacity }]}
          pointerEvents={searching ? 'none' : 'auto'}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.appTitle}>Terraria Wiki</Text>
            </View>
            <View style={styles.headerIcon}>
              <Image
                  source={{ uri: 'https://terraria.wiki.gg/images/Guide.png' }}
                style={styles.headerCharacter}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Browse section label */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Browse</Text>
            <Pressable onPress={() => navigateToCategory('all')}>
              <Text style={styles.sectionLink}>See all</Text>
            </Pressable>
          </View>

          {/* 2×3 category grid — fills all remaining space */}
          <View style={styles.categoryGrid}>
            {[MAIN_CATEGORIES.slice(0, 2), MAIN_CATEGORIES.slice(2, 4), MAIN_CATEGORIES.slice(4, 6)].map((row, rowIdx) => (
              <View key={rowIdx} style={styles.categoryRow}>
                {row.map((cat) => (
                  <Pressable
                    key={cat.key}
                    style={styles.categoryTileOuter}
                    onPress={() => navigateToCategory(cat.key)}
                  >
                    {({ pressed }) => (
                      <View style={[styles.categoryTile, { height: tileHeight }, pressed && styles.categoryTilePressed]}>
                        <Image
                          source={{ uri: `https://terraria.wiki.gg/images/${cat.wikiSlug}.png` }}
                          style={styles.categoryImage}
                          resizeMode="contain"
                        />
                        <Text style={styles.categoryName}>{cat.label}</Text>
                        <Text style={styles.categoryCount}>{counts[cat.key] ?? 0} items</Text>
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
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

  // Content area
  contentArea: {
    flex: 1,
  },
  homeView: {
    flex: 1,
    flexDirection: 'column',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  appTitle: {
    fontSize: 34,
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
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.bg.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerCharacter: {
    width: 36,
    height: 36,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.text.muted,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.brand.accent,
  },

  // Category grid — 3 rows × 2 cols, tiles sized by screen width
  categoryGrid: {
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryTileOuter: {
    flex: 1,
  },
  categoryTile: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    gap: 10,
  },
  categoryTilePressed: {
    backgroundColor: colors.bg.surface,
    borderColor: colors.brand.accent + '55',
  },
  categoryImage: {
    width: 64,
    height: 64,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 11,
    color: colors.text.muted,
    textAlign: 'center',
  },
});
