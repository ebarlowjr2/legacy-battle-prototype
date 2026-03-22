import { View, StyleSheet } from 'react-native';
import { colors } from '@/shared/theme';
import { AppText } from './AppText';
import type { TypographyVariant } from '@/shared/theme';
import type { AvatarSize, AvatarProps } from '@/shared/types';

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 36,
  md: 44,
  lg: 60,
  xl: 90,
};

const VARIANT_MAP: Record<AvatarSize, TypographyVariant> = {
  sm: 'captionSm',
  md: 'body2',
  lg: 'h4',
  xl: 'h1',
};

export function Avatar({
  initials,
  size = 'md',
  backgroundColor = colors.card,
  borderColor = colors.inputBorder,
  textColor = colors.text,
  style,
}: AvatarProps) {
  const dimension = SIZE_MAP[size];

  return (
    <View
      style={[
        styles.base,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor,
          borderColor,
        },
        style,
      ]}
    >
      <AppText variant={VARIANT_MAP[size]} color={textColor}>
        {initials}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
});
