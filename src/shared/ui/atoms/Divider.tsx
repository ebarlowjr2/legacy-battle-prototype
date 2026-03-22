import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/shared/theme';
import { AppText } from './AppText';
import type { DividerProps } from '@/shared/types';

export function Divider({ label, style }: DividerProps) {
  if (!label) {
    return <View style={[styles.line, style]} />;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.line} />
      <AppText variant="captionSm" color={colors.textSecondary} style={styles.label}>
        {label}
      </AppText>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inputBorder,
  },
  label: {},
});
