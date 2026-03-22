import { View, StyleSheet } from 'react-native';
import { colors } from '@/shared/theme';
import type { IconCircleProps } from '@/shared/types';

export function IconCircle({
  size = 40,
  backgroundColor = colors.inputBackground,
  children,
  style,
}: IconCircleProps) {
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
