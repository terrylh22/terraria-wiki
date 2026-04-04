import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../../src/components/ui/SearchBar';
import { CategoryFilter } from '../../src/components/items/CategoryFilter';
import { ItemCard } from '../../src/components/items/ItemCard';
import { useData } from '../../src/data/loaders/DataContext';
import { useSearchStore } from '../../src/store';
import { useItemSearch } from '../../src/hooks/useItemSearch';
import { colors } from '../../src/theme/colors';
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
        getItemLayout={(_, index) => ({ length: 57, offset: 57 * index, index })}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        }
      />
    </SafeAreaView>
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
  header: {
    color: colors.brand.accent,
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.muted,
    fontSize: 16,
  },
});
