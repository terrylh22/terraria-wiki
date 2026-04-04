import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="item/[id]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#16213e' },
            headerTintColor: '#e8b84b',
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="boss/[id]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#16213e' },
            headerTintColor: '#e8b84b',
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="crafting/[id]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#16213e' },
            headerTintColor: '#e8b84b',
            headerTitle: 'Craft Tree',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
