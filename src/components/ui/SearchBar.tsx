import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';


interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
  onCancel?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search items...',
  onFocus,
  onBlur,
  focused = false,
  onCancel,
}: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);
  const [pressed, setPressed] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(glowAnim, {
      toValue: focused ? 1 : 0,
      duration: focused ? 150 : 350,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const animatedBorderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.brand.accent],
  });

  const animatedBgColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.bg.secondary, colors.brand.accent + '1a'],
  });

  const animatedShadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.25],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor: animatedBorderColor,
          backgroundColor: pressed ? colors.bg.surface : colors.bg.secondary,
          shadowColor: colors.brand.accent,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: animatedShadowOpacity,
          shadowRadius: 8,
        },
      ]}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
    >
      <Pressable style={styles.inputRow} onPress={() => inputRef.current?.focus()}>
        <Ionicons
          name="search-outline"
          size={16}
          color={focused ? colors.brand.accent : colors.text.muted}
        />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChangeText('')}>
            <Ionicons name="close-circle" size={16} color={colors.text.muted} />
          </Pressable>
        )}
      </Pressable>
      {onCancel && focused && (
        <Pressable
          onPress={onCancel}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 16 }}
          style={({ pressed }) => [styles.cancelBtn, pressed && styles.cancelBtnPressed]}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    marginVertical: 6,
    paddingRight: 8,
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 15,
    fontFamily: fonts.regular,
    padding: 0,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnPressed: {
    backgroundColor: '#2e2e3e',
  },
  cancelText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
});
