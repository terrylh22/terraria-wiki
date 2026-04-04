import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface StatRowProps {
  label: string;
  value: string | number;
}

export function StatRow({ label, value }: StatRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  value: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
