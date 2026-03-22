import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/shared/theme';
import { AppText } from '../atoms/AppText';
import { IconCircle } from '../atoms/IconCircle';
import type { MenuRowProps } from '@/shared/types';

export function MenuRow({
  icon,
  label,
  onPress,
  rightSlot,
  showChevron = true,
  style,
}: MenuRowProps) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[styles.container, style]}
      {...(onPress ? { onPress } : {})}
    >
      <IconCircle size={40} backgroundColor={colors.background}>
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={22} color={colors.text} />
      </IconCircle>
      <AppText variant="body1" style={styles.label}>
        {label}
      </AppText>
      <View style={styles.right}>
        {rightSlot}
        {showChevron ? (
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        ) : null}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  label: {
    flex: 1,
    marginLeft: spacing[4],
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
});
