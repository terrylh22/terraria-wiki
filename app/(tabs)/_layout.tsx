import { Tabs } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View, Text, Pressable, useWindowDimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { fonts } from '../../src/theme/fonts';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TABS = [
  { name: 'progress', label: 'Progress', icon: 'trophy',   iconOutline: 'trophy-outline' },
  { name: 'index',    label: 'Browse',   icon: 'compass',  iconOutline: 'compass-outline' },
  { name: 'crafting', label: 'Craft',    icon: 'hammer',   iconOutline: 'hammer-outline' },
] as const;

const BAR_HEIGHT = 64;
const PILL_WIDTH = 112;
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
      damping: 28,
      stiffness: 340,
      mass: 0.6,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth]);

  const barHeight = BAR_HEIGHT + insets.bottom;
  const pillTop = (BAR_HEIGHT - PILL_HEIGHT) / 2;

  return (
    <View style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: barHeight,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    }}>
      {/* Solid dark background */}
      <View
        style={{ flex: 1, backgroundColor: colors.bg.secondary }}
      />

      {/* Sliding pill */}
      <Animated.View
        style={{
          position: 'absolute',
          top: pillTop,
          width: PILL_WIDTH,
          height: PILL_HEIGHT,
          borderRadius: 26,
          backgroundColor: colors.brand.accent + '22',
          borderWidth: 0,
          transform: [{ translateX: pillX }],
        }}
      />

      {/* Tab items */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: BAR_HEIGHT,
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
                gap: 4,
              }}
            >
              <Ionicons
                name={(focused ? tab.icon : tab.iconOutline) as IoniconsName}
                size={22}
                color={focused ? colors.brand.accent : colors.text.muted}
              />
              <Text style={{
                fontSize: 13,
                fontFamily: focused ? fonts.bold : fonts.medium,
                color: focused ? colors.brand.accent : colors.text.secondary,
                letterSpacing: 0.3,
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
      <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
      <Tabs.Screen name="index"    options={{ title: 'Browse' }} />
      <Tabs.Screen name="crafting" options={{ title: 'Craft' }} />
    </Tabs>
  );
}
