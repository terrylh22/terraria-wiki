import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CraftingTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#e8b84b', fontSize: 24 }}>Crafting</Text>
        <Text style={{ color: '#a0a0b0', marginTop: 8 }}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
