import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';
import svgAssets from '@/assets/svg';
import { IconNameEnum } from '@/shared/utils/enum';

/**
 * Single registry: {@link IconNameEnum} → SVG component from `src/assets/svg`.
 * When you add an icon: extend the enum, add the file + export in `assets/svg/index.ts`, then add a row here.
 */
export const svgIconComponents: Record<IconNameEnum, ComponentType<SvgProps>> = {
  [IconNameEnum.BattleHand]: svgAssets.BattleHand,
  [IconNameEnum.CheckValid]: svgAssets.CheckValid as ComponentType<SvgProps>,
  [IconNameEnum.ChatBubble]: svgAssets.ChatBubble as ComponentType<SvgProps>,
  [IconNameEnum.LegacyBattleLogo]: svgAssets.LegacyBattleLogo,
};
