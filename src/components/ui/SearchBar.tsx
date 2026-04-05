import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search items...',
  onFocus,
  onBlur,
  focused = false,
}: SearchBarProps) {
  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <Ionicons
        name="search-outline"
        size={16}
        color={focused ? colors.brand.accent : colors.text.muted}
      />
      <TextInput
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    marginVertical: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  containerFocused: {
    borderColor: colors.brand.accent,
    backgroundColor: colors.brand.accent + '0e',
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 15,
    padding: 0,
  },
});
