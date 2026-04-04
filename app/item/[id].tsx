import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#e8b84b', fontSize: 20 }}>Item #{id}</Text>
        <Text style={{ color: '#a0a0b0', marginTop: 8 }}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
