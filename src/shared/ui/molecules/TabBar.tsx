import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText } from '../atoms/AppText';
import type { TabBarProps } from '@/shared/types';

export function TabBar({
  tabs,
  activeTab,
  onTabChange,
  scrollable = false,
  style,
}: TabBarProps) {
  const content = tabs.map((tab) => {
    const isActive = tab.key === activeTab;
    return (
      <TouchableOpacity
        key={tab.key}
        style={[styles.tab, isActive && styles.activeTab]}
        onPress={() => onTabChange(tab.key)}
      >
        <AppText
          variant="label"
          color={isActive ? colors.white : colors.textSecondary}
        >
          {tab.label}
        </AppText>
      </TouchableOpacity>
    );
  });

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.container, style]}
      >
        {content}
      </ScrollView>
    );
  }

  return <View style={[styles.container, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  tab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
    backgroundColor: colors.card,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
});
