import { View, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import {
  colors,
  fontSizes,
  fontWeights,
  opacity,
  sizes,
} from '@/shared/constants/theme';
import type { PatternBackgroundProps } from '@/shared/types';

const DEFAULT_REPEAT = 20;

export function PatternBackground({
  text,
  repeatCount = DEFAULT_REPEAT,
  style,
}: PatternBackgroundProps) {
  return (
    <View style={[styles.root, style]} pointerEvents="none">
      {[...Array(repeatCount)].map((_, i) => (
        <View key={i} style={styles.cell}>
          <AppText variant="body1" style={styles.cellText}>
            {text}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    opacity: opacity.patternWash,
  },
  cell: {
    width: sizes.patternCell,
    height: sizes.patternCell,
    justifyContent: 'center',
    alignItems: 'center',
    margin: sizes.patternGridGap,
  },
  cellText: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
});
