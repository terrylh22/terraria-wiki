import { useMemo } from 'react';
import { useData } from '../data/loaders/DataContext';
import { useSearchStore } from '../store';
import { useDebounce } from './useDebounce';
import { ItemIndex } from '../types/item';

export function useItemSearch(): ItemIndex[] {
  const { index, fuse } = useData();
  const { query, category, sortBy } = useSearchStore();
  const debouncedQuery = useDebounce(query, 200);

  return useMemo(() => {
    // Start with search results or full index
    let results: ItemIndex[];

    if (debouncedQuery.trim() && fuse) {
      results = fuse.search(debouncedQuery).map((r) => r.item);
    } else {
      results = [...index];
    }

    // Filter by category
    if (category !== 'all') {
      results = results.filter((item) => item.category === category);
    }

    // Sort (only when not using fuse relevance ranking)
    if (!debouncedQuery.trim() || category !== 'all') {
      results.sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'rarity') return b.rarity - a.rarity;
        return a.id - b.id;
      });
    }

    return results;
  }, [index, fuse, debouncedQuery, category, sortBy]);
}
