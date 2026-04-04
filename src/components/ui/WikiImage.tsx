import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { wikiImageUrl } from '../../lib/wikiUrl';

interface WikiImageProps {
  wikiSlug: string;
  size?: number;
  style?: object;
}

const placeholder = require('../../../assets/placeholder-item.png');

export function WikiImage({ wikiSlug, size = 32, style }: WikiImageProps) {
  const uri = wikiImageUrl(wikiSlug);

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={{ uri }}
        style={{ width: size, height: size }}
        contentFit="contain"
        placeholder={placeholder}
        transition={150}
        cachePolicy="disk"
        // pixelated rendering for sprite art
        // @ts-ignore — expo-image supports this on native
        recyclingKey={wikiSlug}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
