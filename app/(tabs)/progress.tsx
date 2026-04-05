import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';

export default function ProgressTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Text style={{ color: colors.text.primary, fontSize: 24, fontWeight: '700' }}>Progress</Text>
        <Text style={{ color: colors.text.muted, fontSize: 14 }}>Boss checklist & events — coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
