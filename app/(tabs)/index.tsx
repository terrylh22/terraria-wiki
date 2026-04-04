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

export default function ItemsTab() {
  const { loading } = useData();
  const { query, category, setQuery, setCategory } = useSearchStore();
  const results = useItemSearch();

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.brand.accent} />
        <Text style={styles.loadingText}>Loading items...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>Items</Text>
      <SearchBar value={query} onChangeText={setQuery} />
      <CategoryFilter selected={category} onSelect={setCategory} />
      <FlatList
        data={results}
        renderItem={({ item }: { item: ItemIndex }) => <ItemCard item={item} />}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentInset={{ bottom: 84 }}
        getItemLayout={(_, index) => ({ length: 72, offset: 72 * index, index })}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No items found</Text>
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
    color: colors.brand.accent,
    fontSize: 28,
    fontWeight: '700',
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
