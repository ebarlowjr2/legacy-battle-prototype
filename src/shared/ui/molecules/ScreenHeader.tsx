import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, verticalScale } from '@/shared/theme';
import { AppText } from '../atoms/AppText';
import type { ScreenHeaderProps } from '@/shared/types';

export function ScreenHeader({ title, onBack, rightSlot, centerIcon, style }: ScreenHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      {onBack ? (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={20} color={colors.white} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <View style={styles.center}>
        {title ? (
          <AppText variant="h5" color={colors.text}>
            {title}
          </AppText>
        ) : null}
        {centerIcon}
      </View>

      {rightSlot ?? <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  placeholder: {
    width: 36,
  },
});
