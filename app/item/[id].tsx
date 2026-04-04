import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLayoutEffect } from 'react';
import { WikiImage } from '../../src/components/ui/WikiImage';
import { RarityBadge } from '../../src/components/ui/RarityBadge';
import { StatRow } from '../../src/components/ui/StatRow';
import { RecipeCard } from '../../src/components/crafting/RecipeCard';
import { useData } from '../../src/data/loaders/DataContext';
import { colors } from '../../src/theme/colors';

type Tab = 'stats' | 'recipes' | 'usedIn';

function formatCoins(copper: number): string {
  if (!copper) return '0';
  const p = Math.floor(copper / 1_000_000);
  const g = Math.floor((copper % 1_000_000) / 10_000);
  const s = Math.floor((copper % 10_000) / 100);
  const c = copper % 100;
  const parts = [];
  if (p) parts.push(`${p}🪙 Platinum`);
  if (g) parts.push(`${g} Gold`);
  if (s) parts.push(`${s} Silver`);
  if (c) parts.push(`${c} Copper`);
  return parts.join(' ') || '0';
}

export default function ItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, recipesByResult, recipesByIngredient } = useData();
  const navigation = useNavigation();
  const [tab, setTab] = useState<Tab>('stats');

  const item = items.get(parseInt(id));

  useLayoutEffect(() => {
    if (item) {
      navigation.setOptions({ headerTitle: item.name });
    }
  }, [item, navigation]);

  if (!item) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.notFound}>Item not found</Text>
      </SafeAreaView>
    );
  }

  const craftedBy = recipesByResult.get(item.id) ?? [];
  const usedIn = recipesByIngredient.get(item.id) ?? [];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Hero */}
      <View style={styles.hero}>
        <WikiImage wikiSlug={item.wikiSlug} size={64} />
        <View style={styles.heroInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <RarityBadge rarity={item.rarity} />
          {item.sellValue ? (
            <Text style={styles.sellValue}>Sell: {formatCoins(item.sellValue)}</Text>
          ) : null}
        </View>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {(['stats', 'recipes', 'usedIn'] as Tab[]).map((t) => (
          <Pressable
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'stats' ? 'Stats' : t === 'recipes' ? `Recipes (${craftedBy.length})` : `Used In (${usedIn.length})`}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {tab === 'stats' && (
          <View>
            {item.damage !== undefined && <StatRow label="Damage" value={`${item.damage}${item.damageType ? ` (${item.damageType})` : ''}`} />}
            {item.defense !== undefined && <StatRow label="Defense" value={item.defense} />}
            {item.useTime !== undefined && <StatRow label="Use Time" value={item.useTime} />}
            {item.knockback !== undefined && <StatRow label="Knockback" value={item.knockback} />}
            {item.critChance !== undefined && <StatRow label="Crit Chance" value={`${item.critChance}%`} />}
            {item.maxStack !== undefined && <StatRow label="Max Stack" value={item.maxStack} />}
            <StatRow label="Rarity" value={item.rarity} />
            <StatRow label="Category" value={item.category} />
            {item.tooltip && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>{item.tooltip}</Text>
              </View>
            )}
          </View>
        )}

        {tab === 'recipes' && (
          craftedBy.length === 0
            ? <Text style={styles.empty}>Not craftable</Text>
            : craftedBy.map((r) => <RecipeCard key={r.id} recipe={r} showResult={false} />)
        )}

        {tab === 'usedIn' && (
          usedIn.length === 0
            ? <Text style={styles.empty}>Not used in any recipe</Text>
            : usedIn.map((r) => <RecipeCard key={r.id} recipe={r} showResult={true} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  centered: { flex: 1, backgroundColor: colors.bg.primary, alignItems: 'center', justifyContent: 'center' },
  notFound: { color: colors.text.muted, fontSize: 16 },
  hero: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  heroInfo: { flex: 1, gap: 6 },
  itemName: { color: colors.text.primary, fontSize: 20, fontWeight: '700' },
  sellValue: { color: colors.text.muted, fontSize: 12, marginTop: 4 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.bg.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: { borderBottomColor: colors.brand.accent },
  tabText: { color: colors.text.muted, fontSize: 13 },
  tabTextActive: { color: colors.brand.accent, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  tooltip: {
    margin: 16,
    padding: 12,
    backgroundColor: colors.bg.surface,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.brand.accent,
  },
  tooltipText: { color: colors.text.secondary, fontSize: 13, fontStyle: 'italic' },
  empty: { color: colors.text.muted, textAlign: 'center', padding: 40, fontSize: 14 },
});
