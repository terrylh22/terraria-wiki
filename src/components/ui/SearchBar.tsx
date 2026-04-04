import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { colors } from '../../theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search items...' }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} style={styles.clear}>
          <Text style={styles.clearText}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.surface,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    height: 40,
    color: colors.text.primary,
    fontSize: 16,
  },
  clear: {
    padding: 4,
  },
  clearText: {
    color: colors.text.muted,
    fontSize: 14,
  },
});
