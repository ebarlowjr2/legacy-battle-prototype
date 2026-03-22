import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import type { CategoryPillsProps } from '@/shared/types';

export function CategoryPills<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: CategoryPillsProps<T>) {
  return (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => onTabChange(tab)}
        >
          <AppText
            variant="captionSm"
            color={activeTab === tab ? colors.white : colors.textSecondary}
            style={{ fontWeight: '500' }}
          >
            {tab}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  tab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
});
