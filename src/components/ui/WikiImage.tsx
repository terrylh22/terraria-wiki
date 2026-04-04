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
    <View style={[{ width: size, height: size }, style]}>
      <Image
        source={{ uri }}
        style={{ width: size, height: size }}
        resizeMode="contain"
        onError={(e) => console.log('[WikiImage] error', wikiSlug, e.nativeEvent.error)}
        onLoad={() => console.log('[WikiImage] loaded', wikiSlug)}
      />
    </View>
  );
}
