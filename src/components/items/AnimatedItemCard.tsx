import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { ItemCard } from './ItemCard';
import { ItemIndex } from '../../types/item';

const MAX_STAGGER_INDEX = 15;
const STAGGER_DELAY = 35;
const DURATION = 350;
const TRANSLATE_X = 60;

interface AnimatedItemCardProps {
  item: ItemIndex;
  index: number;
}

export function AnimatedItemCard({ item, index }: AnimatedItemCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(TRANSLATE_X)).current;

  useEffect(() => {
    const delay = Math.min(index, MAX_STAGGER_INDEX) * STAGGER_DELAY;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: DURATION,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: DURATION,
        delay,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateX }] }}>
      <ItemCard item={item} />
    </Animated.View>
  );
}
