import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider } from '../src/data/loaders/DataContext';
import { colors } from '../src/theme/colors';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import '../global.css';

function CustomHeader({ title, backLabel, rightLabel }: { title?: string; backLabel?: string; rightLabel?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={26} color={colors.brand.accent} />
        {backLabel && <Text style={styles.backLabel}>{backLabel}</Text>}
      </Pressable>
      {title ? <Text style={styles.title}>{title}</Text> : <View style={{ flex: 1 }} />}
      <View style={styles.headerRight}>
        {rightLabel && <Text style={styles.rightLabel}>{rightLabel}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.primary,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    paddingRight: 12,
    minWidth: 80,
  },
  backLabel: {
    color: colors.brand.accent,
    fontSize: 22,
    fontWeight: '700',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: '600',
  },
  headerRight: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  rightLabel: {
    color: colors.brand.accent,
    fontSize: 22,
    fontWeight: '700',
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <DataProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg.primary } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="items"         options={{ headerShown: true, header: () => <CustomHeader backLabel="Home" rightLabel="Items" />, animation: 'default' }} />
          <Stack.Screen name="item/[id]"     options={{ headerShown: true, header: () => <CustomHeader backLabel="Items" />, animation: 'default' }} />
          <Stack.Screen name="boss/[id]"     options={{ headerShown: true, header: () => <CustomHeader backLabel="Items" />, animation: 'default' }} />
          <Stack.Screen name="crafting/[id]" options={{ headerShown: true, header: () => <CustomHeader title="Craft Tree" backLabel="Items" />, animation: 'default' }} />
        </Stack>
      </DataProvider>
    </GestureHandlerRootView>
  );
}
