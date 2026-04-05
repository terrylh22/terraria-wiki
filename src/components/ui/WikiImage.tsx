import React from 'react';
import { Image, View } from 'react-native';
import { wikiImageUrl } from '../../lib/wikiUrl';

interface WikiImageProps {
  wikiSlug: string;
  size?: number;
  style?: object;
}

export function WikiImage({ wikiSlug, size = 32, style }: WikiImageProps) {
  const uri = wikiImageUrl(wikiSlug);

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
