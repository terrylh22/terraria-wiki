import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider } from '../src/data/loaders/DataContext';
import { colors } from '../src/theme/colors';
import { fonts } from '../src/theme/fonts';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import '../global.css';

function CustomHeader({ title, backLabel, rightLabel }: { title?: string; backLabel?: string; rightLabel?: string }) {
  const insets = useSafeAreaInsets();
  const [pressed, setPressed] = useState(false);
  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <Pressable
        style={[styles.backBtn, pressed && styles.backBtnPressed]}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={26} color={colors.text.secondary} />
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingLeft: 6,
    paddingRight: 14,
    backgroundColor: colors.bg.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backBtnPressed: {
    backgroundColor: '#2e2e3e',
  },
  backLabel: {
    color: colors.text.secondary,
    fontSize: 20,
    fontFamily: fonts.extraBold,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: colors.text.primary,
    fontSize: 20,
    fontFamily: fonts.semiBold,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rightLabel: {
    color: colors.brand.accent,
    fontSize: 34,
    fontFamily: fonts.extraBold,
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg.primary, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.brand.accent} />
      </View>
    );
  }

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
