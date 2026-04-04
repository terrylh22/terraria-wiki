import { Tabs } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View, Text, Pressable, useWindowDimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TABS = [
  { name: 'index',    label: 'Home',     icon: 'home',    iconOutline: 'home-outline' },
  { name: 'crafting', label: 'Crafting', icon: 'hammer',  iconOutline: 'hammer-outline' },
  { name: 'bosses',   label: 'Bosses',   icon: 'skull',   iconOutline: 'skull-outline' },
] as const;

const PILL_WIDTH = 96;
const PILL_HEIGHT = 52;

function CustomTabBar({ state, navigation }: any) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabWidth = width / TABS.length;

  const pillX = useRef(
    new Animated.Value(state.index * tabWidth + (tabWidth - PILL_WIDTH) / 2)
  ).current;

  useEffect(() => {
    Animated.spring(pillX, {
      toValue: state.index * tabWidth + (tabWidth - PILL_WIDTH) / 2,
      damping: 26,
      stiffness: 320,
      mass: 0.6,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth]);

  const barHeight = 60 + insets.bottom;

  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: barHeight }}>
      <BlurView
        intensity={60}
        tint="dark"
        style={{ flex: 1, borderTopWidth: 0.5, borderTopColor: colors.border }}
      />

      {/* Sliding pill */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 8,
          width: PILL_WIDTH,
          height: PILL_HEIGHT,
          borderRadius: 24,
          backgroundColor: colors.brand.accent + '25',
          transform: [{ translateX: pillX }],
        }}
      />

      {/* Tab items */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 68,
        flexDirection: 'row',
      }}>
        {TABS.map((tab, index) => {
          const focused = state.index === index;
          return (
            <Pressable
              key={tab.name}
              onPress={() => navigation.navigate(tab.name)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                paddingTop: 8,
              }}
            >
              <Ionicons
                name={(focused ? tab.icon : tab.iconOutline) as IoniconsName}
                size={22}
                color={focused ? colors.brand.accent : colors.text.muted}
              />
              <Text style={{
                fontSize: 11,
                fontWeight: focused ? '600' : '500',
                color: focused ? colors.brand.accent : colors.text.muted,
              }}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"    options={{ title: 'Home' }} />
      <Tabs.Screen name="crafting" options={{ title: 'Crafting' }} />
      <Tabs.Screen name="bosses"   options={{ title: 'Bosses' }} />
    </Tabs>
  );
}
