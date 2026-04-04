import { create } from 'zustand';
import { ItemCategory } from '../types/common';

interface SearchState {
  query: string;
  category: ItemCategory | 'all';
  sortBy: 'name' | 'rarity' | 'id';
  setQuery: (q: string) => void;
  setCategory: (c: ItemCategory | 'all') => void;
  setSortBy: (s: 'name' | 'rarity' | 'id') => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  category: 'all',
  sortBy: 'name',
  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
  setSortBy: (sortBy) => set({ sortBy }),
}));
