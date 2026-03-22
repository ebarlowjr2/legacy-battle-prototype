import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/shared/theme';
import { AppText } from '../atoms/AppText';
import { Avatar } from '../atoms/Avatar';
import type { UserRowProps } from '@/shared/types';

export function UserRow({
  initials,
  name,
  subtitle,
  avatarSize = 'md',
  rightSlot,
  style,
}: UserRowProps) {
  return (
    <View style={[styles.container, style]}>
      <Avatar initials={initials} size={avatarSize} />
      <View style={styles.info}>
        <AppText variant="h6">{name}</AppText>
        {subtitle ? (
          <AppText variant="body2" color={colors.textSecondary}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {rightSlot}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  info: {
    flex: 1,
  },
});
