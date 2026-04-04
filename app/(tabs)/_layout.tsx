import { Tabs } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg.secondary,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.brand.gold,
        tabBarInactiveTintColor: colors.text.muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Items',
          tabBarIcon: () => null, // TODO: pixel art icons
        }}
      />
      <Tabs.Screen
        name="crafting"
        options={{
          title: 'Crafting',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="bosses"
        options={{
          title: 'Bosses',
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}
