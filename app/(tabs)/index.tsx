import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useData } from '../../src/data/loaders/DataContext';
import { useSearchStore } from '../../src/store';
import { ItemCard } from '../../src/components/items/ItemCard';
import { SearchBar } from '../../src/components/ui/SearchBar';
import { colors } from '../../src/theme/colors';
import { fonts } from '../../src/theme/fonts';
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

const TAB_BAR_HEIGHT = 64;

export default function HomeScreen() {
  const { index, fuse } = useData();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tileWidth = (width - 16 * 2 - 10) / 2;
  const tileHeight = Math.round(tileWidth * 0.8);

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [focused, setFocused] = useState(false);

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
  }

  function exitSearch() {
    Keyboard.dismiss();
    setQuery('');
    setSearching(false);
    setFocused(false);
  }

  return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>terra<Text style={styles.appTitleAccent}>Guide</Text></Text>
          <View style={styles.headerIcon}>
            <Image
              source={{ uri: 'https://terraria.wiki.gg/images/Guide.png' }}
              style={styles.headerCharacter}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Search bar at top */}
        <View style={styles.searchRow}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onFocus={enterSearch}
            onBlur={() => {}}
            focused={focused}
            placeholder="Search items, weapons, armor..."
          />
          {searching && (
            <Pressable onPress={exitSearch} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          )}
        </View>

        {/* Search results (shown when searching) */}
        {searching ? (
          <View style={{ flex: 1, backgroundColor: colors.bg.primary }}>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <ItemCard item={item} />}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 20 }}
              getItemLayout={(_, i) => ({ length: 65, offset: 65 * i, index: i })}
            />
          </View>
        ) : (
        /* Home grid */
        <View style={{ flex: 1 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Browse</Text>
            <Pressable onPress={() => navigateToCategory('all')}>
              <Text style={styles.sectionLink}>See all</Text>
            </Pressable>
          </View>

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
        </View>
        )}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
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
    fontFamily: fonts.extraBold,
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  appTitleAccent: {
    color: colors.brand.accent,
  },
  headerIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerCharacter: {
    width: 36,
    height: 36,
  },

  // Search bar row
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingLeft: 12,
  },
  cancelText: {
    color: colors.brand.accent,
    fontSize: 15,
    fontFamily: fonts.medium,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.text.muted,
  },
  sectionLink: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.brand.accent,
  },

  // Category grid
  categoryGrid: {
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    fontFamily: fonts.semiBold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.text.muted,
    textAlign: 'center',
  },
});
