import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { EXPLORE_CATEGORIES } from '@/shared/constants';

export function CategoriesSection() {
  return (
    <View style={styles.section}>
      <AppText variant="h4" style={{ marginBottom: spacing[2] }}>Categories</AppText>
      <View style={styles.categoriesGrid}>
        {EXPLORE_CATEGORIES.map(({ label, emoji }) => (
          <TouchableOpacity key={label} style={styles.categoryCard}>
            <View style={styles.categoryIcon}>
              <AppText variant="captionSm" style={{ fontSize: 24 }}>{emoji}</AppText>
            </View>
            <AppText variant="label">{label}</AppText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing[4] * 1.5,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    alignItems: 'center',
    gap: spacing[2],
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
