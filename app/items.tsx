import React from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../src/components/ui/SearchBar';
import { CategoryFilter } from '../src/components/items/CategoryFilter';
import { AnimatedItemCard } from '../src/components/items/AnimatedItemCard';
import { useData } from '../src/data/loaders/DataContext';
import { useSearchStore } from '../src/store';
import { useItemSearch } from '../src/hooks/useItemSearch';
import { colors } from '../src/theme/colors';
import { fonts } from '../src/theme/fonts';
import { ItemIndex } from '../src/types/item';

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
    <View style={styles.container}>
      {/* Controls at top */}
      <View style={styles.controls}>
        <View style={{ flexDirection: 'row' }}>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
        <CategoryFilter selected={category} onSelect={setCategory} />
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={results}
        renderItem={({ item, index }: { item: ItemIndex; index: number }) => <AnimatedItemCard item={item} index={index} />}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  controls: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.muted,
    fontSize: 16,
    fontFamily: fonts.regular,
  },
});
