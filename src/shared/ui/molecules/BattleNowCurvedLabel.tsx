import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, Sizes, horizontalScale, verticalScale } from '@/shared/theme';
import { AppText } from '@/shared/ui/atoms/AppText';
import type { BattleNowCurvedLabelProps } from '@/shared/types';

const radius = Sizes.xxxl;
const yOffset = verticalScale(8);

export function BattleNowCurvedLabel({ focused }: BattleNowCurvedLabelProps) {
  const text = 'BATTLE NOW';
  const startAngle = -50;
  const endAngle = 50;
  const angleStep = (endAngle - startAngle) / (text.length - 1);

  return (
    <View style={styles.container}>
      {text.split('').map((char, index) => {
        const angle = startAngle + index * angleStep;
        const radians = (angle * Math.PI) / 180;

        const x = radius * Math.sin(radians);
        const y = radius * (1 - Math.cos(radians)) - yOffset;

        return (
          <AppText
            key={index}
            variant="label"
            color={colors.white}
            style={[
              styles.character,
              {
                transform: [{ translateX: x }, { translateY: y }, { rotate: `${angle}deg` }],
              },
            ]}
          >
            {char}
          </AppText>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: horizontalScale(80),
    height: verticalScale(24),
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: verticalScale(2),
  },
  character: {
    position: 'absolute',
    fontSize: Sizes.font8,
    letterSpacing: 0.5,
  },
});
