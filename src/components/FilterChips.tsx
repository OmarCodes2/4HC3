import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';

interface FilterChip {
  label: string;
  value: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  chips,
  selectedValue,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {chips.map((chip) => {
        const isSelected = selectedValue === chip.value;
        return (
          <TouchableOpacity
            key={chip.value}
            style={[
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipUnselected,
            ]}
            onPress={() => onSelect(isSelected ? null : chip.value)}
          >
            <Text
              style={[
                styles.chipText,
                isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
              ]}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: colors.primaryMaroon,
  },
  chipUnselected: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipTextUnselected: {
    color: colors.textGrey,
  },
});

