import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider } from '../src/data/loaders/DataContext';
import { colors } from '../src/theme/colors';
import '../global.css';

const headerOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: colors.bg.primary },
  headerTintColor: colors.text.primary,
  headerTitleStyle: { color: colors.text.primary },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DataProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="items"         options={{ ...headerOptions, headerTitle: 'Items' }} />
          <Stack.Screen name="item/[id]"     options={{ ...headerOptions, headerTitle: '' }} />
          <Stack.Screen name="boss/[id]"     options={{ ...headerOptions, headerTitle: '' }} />
          <Stack.Screen name="crafting/[id]" options={{ ...headerOptions, headerTitle: 'Craft Tree' }} />
        </Stack>
      </DataProvider>
    </GestureHandlerRootView>
  );
}
