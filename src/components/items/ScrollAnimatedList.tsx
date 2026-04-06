import React, { useRef } from 'react';
import { Animated, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { ItemCard } from './ItemCard';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { ItemIndex } from '../../types/item';

const ITEM_HEIGHT = 68;
const TRANSLATE_X = 40;
const EDGE_ZONE = 120;

interface ScrollAnimatedListProps {
  data: ItemIndex[];
  contentPaddingBottom?: number;
}

export function ScrollAnimatedList({ data, contentPaddingBottom = 0 }: ScrollAnimatedListProps) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { height: screenHeight } = useWindowDimensions();

  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No items found</Text>
      </View>
    );
  }

  return (
    <Animated.ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: contentPaddingBottom }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      keyboardShouldPersistTaps="handled"
    >
      {data.map((item, index) => {
        const itemTop = ITEM_HEIGHT * index;

        // Item enters bottom of viewport when scrollY = itemTop - screenHeight
        // Item exits top of viewport when scrollY = itemTop
        // We animate in the EDGE_ZONE near each boundary

        const enterStart = itemTop - screenHeight;
        const enterEnd = enterStart + EDGE_ZONE;
        const exitStart = itemTop - EDGE_ZONE;
        const exitEnd = itemTop;

        const opacity = scrollY.interpolate({
          inputRange: [enterStart, enterEnd, exitStart, exitEnd],
          outputRange: [0, 1, 1, 0],
          extrapolate: 'clamp',
        });

        const translateX = scrollY.interpolate({
          inputRange: [enterStart, enterEnd, exitStart, exitEnd],
          outputRange: [TRANSLATE_X, 0, 0, -TRANSLATE_X],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={String(item.id)}
            style={{ opacity, transform: [{ translateX }] }}
          >
            <ItemCard item={item} />
          </Animated.View>
        );
      })}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.muted,
    fontSize: 16,
    fontFamily: fonts.regular,
  },
});
