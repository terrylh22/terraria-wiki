import React, { createContext, useContext, useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import { TerrariaItem, ItemIndex } from '../../types/item';
import { Recipe } from '../../types/recipe';

interface DataState {
  index: ItemIndex[];
  items: Map<number, TerrariaItem>;
  recipes: Recipe[];
  // recipes indexed by resultId for quick "what makes this?" lookups
  recipesByResult: Map<number, Recipe[]>;
  // recipes indexed by ingredientId for "what uses this?" lookups
  recipesByIngredient: Map<number, Recipe[]>;
  fuse: Fuse<ItemIndex> | null;
  loading: boolean;
}

const DataContext = createContext<DataState>({
  index: [],
  items: new Map(),
  recipes: [],
  recipesByResult: new Map(),
  recipesByIngredient: new Map(),
  fuse: null,
  loading: true,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DataState>({
    index: [],
    items: new Map(),
    recipes: [],
    recipesByResult: new Map(),
    recipesByIngredient: new Map(),
    fuse: null,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      // Load all three files. require() is synchronous for bundled assets
      // but we defer to avoid blocking the JS thread on startup.
      const [indexData, itemsData, recipesData] = await Promise.all([
        Promise.resolve(require('../processed/index.json') as ItemIndex[]),
        Promise.resolve(require('../processed/items.json') as TerrariaItem[]),
        Promise.resolve(require('../processed/recipes.json') as Recipe[]),
      ]);

      // Build item lookup map
      const items = new Map<number, TerrariaItem>();
      for (const item of itemsData) {
        items.set(item.id, item);
      }

      // Build recipe lookup maps
      const recipesByResult = new Map<number, Recipe[]>();
      const recipesByIngredient = new Map<number, Recipe[]>();

      for (const recipe of recipesData) {
        const byResult = recipesByResult.get(recipe.resultId) ?? [];
        byResult.push(recipe);
        recipesByResult.set(recipe.resultId, byResult);

        for (const ing of recipe.ingredients) {
          const byIng = recipesByIngredient.get(ing.id) ?? [];
          byIng.push(recipe);
          recipesByIngredient.set(ing.id, byIng);
        }
      }

      // Build Fuse.js index asynchronously after state is set
      const fuse = new Fuse(indexData, {
        keys: ['name'],
        threshold: 0.3,
        includeScore: true,
      });

      setState({
        index: indexData,
        items,
        recipes: recipesData,
        recipesByResult,
        recipesByIngredient,
        fuse,
        loading: false,
      });
    }

    load();
  }, []);

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
