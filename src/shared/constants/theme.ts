/**
 * Single barrel for design tokens and theme helpers.
 * Implementation lives in `src/shared/theme/`; import from here or `@/shared/theme` (re-export).
 */

export {
  spacing,
  radii,
  fontSizes,
  lineHeights,
  shadows,
  zIndex,
  typography,
  fontWeights,
  opacity,
  borderWidths,
  sizes,
  type TypographyVariant,
  type TypographyStyle,
} from '../theme/tokens';

export {
  theme,
  colors,
  Colors,
  colorScheme,
  screenHeight,
  screenWidth,
  horizontalScale,
  verticalScale,
  moderate,
  scaleText,
  scaleLayout,
  RPH,
  RPW,
  FontFamily,
  Sizes,
} from '../theme/theme';

export type { Theme } from '../theme/theme';

export {
  DARK_COLORS,
  LIGHT_COLORS,
  getThemeColors,
  type ThemeColors,
  type ThemeMode,
} from '../theme/colors';
