import React from 'react';
import { Image, View } from 'react-native';
import { wikiImageUrl } from '../../lib/wikiUrl';
import { colors } from '../../theme/colors';

interface WikiImageProps {
  wikiSlug: string;
  size?: number;
  style?: object;
}

export function WikiImage({ wikiSlug, size = 32, style }: WikiImageProps) {
  const uri = wikiImageUrl(wikiSlug);
  const inner = size - 8;

  return (
    <View style={[{ width: size, height: size, padding: 4, backgroundColor: '#1e1e2a', borderRadius: 6 }, style]}>
      <Image
        source={{ uri }}
        style={{ width: size - 8, height: size - 8 }}
        resizeMode="contain"
      />
    </View>
  );
}
