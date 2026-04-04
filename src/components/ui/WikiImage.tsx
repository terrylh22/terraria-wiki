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
    <View style={[{
      width: size,
      height: size,
      padding: 4,
      backgroundColor: colors.bg.surface,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    }, style]}>
      <Image
        source={{ uri }}
        style={{ width: inner, height: inner }}
        resizeMode="contain"
      />
    </View>
  );
}
