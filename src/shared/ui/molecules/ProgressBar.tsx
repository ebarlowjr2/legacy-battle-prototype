import { View, StyleSheet } from 'react-native';
import { colors, spacing, radii, verticalScale } from '@/shared/theme';
import { AppText } from '../atoms/AppText';
import type { ProgressBarProps } from '@/shared/types';

export function ProgressBar({ progress, label, style }: ProgressBarProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const widthPercent = `${Math.round(clampedProgress * 100)}%` as const;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: widthPercent }]} />
      </View>
      {label ? (
        <AppText variant="captionSm" color={colors.textSecondary}>
          {label}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  track: {
    flex: 1,
    height: verticalScale(8),
    backgroundColor: colors.inputBackground,
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
  },
});
