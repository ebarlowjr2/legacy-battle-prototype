import { Dimensions, Appearance } from 'react-native';
import {
  scale as horizontalScaleLib,
  verticalScale as verticalScaleLib,
  moderateScale as moderateScaleLib,
} from 'react-native-size-matters';
import { getThemeColors } from './colors';
import {
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
} from './tokens';

/** Default (dark) palette. For theme-aware colors (auto dark/light), use useTheme() from @/app/providers. */
export const colors = getThemeColors('dark');

/** Alias for consumers. Same as colors. */
export const Colors = colors;

/**
 * Static theme bundle (layout, typography, shadows, etc.).
 * Prefer typography for text styling (e.g. AppText variant); fontSizes/lineHeights are for legacy or non-text use (e.g. TextInput).
 * For mode-aware colors in components, use useTheme() from @/app/providers.
 */
export const theme = {
  colors,
  spacing,
  radii,
  fontSizes,
  lineHeights,
  typography,
  shadows,
  zIndex,
  fontWeights,
  opacity,
  borderWidths,
  sizes,
} as const;

export type Theme = typeof theme;

export const colorScheme = Appearance.getColorScheme();
export const screenHeight = Dimensions.get('window').height;
export const screenWidth = Dimensions.get('window').width;

/**
 * Use for horizontal layout: marginLeft, marginRight, marginHorizontal,
 * paddingHorizontal, width. Pass the design-size number (e.g. 16).
 */
export const horizontalScale = (size: number) => horizontalScaleLib(size);

/**
 * Use for vertical layout: marginTop, marginBottom, marginVertical,
 * paddingVertical, height. Pass the design-size number (e.g. 16).
 */
export const verticalScale = (size: number) => verticalScaleLib(size);

export const moderateScale = (size: number, factor = 0.5) => moderateScaleLib(size, factor);
/** Alias for `moderateScale` (legacy / shorter name). */
export const moderate = moderateScale;
export const scaleText = (size: number) => moderateScaleLib(size, 0.3);
export const scaleLayout = (size: number) => moderateScaleLib(size, 0.3);

export const RPH = (percentage: number) => (percentage / 100) * screenHeight;
export const RPW = (percentage: number) => (percentage / 100) * screenWidth;

/** Font family aliases (name reflects font). Use in styles: fontFamily: FontFamily.montserratRegular */
export const FontFamily = {
  montserratThin: 'Montserrat_100Thin',
  montserratLight: 'Montserrat_300Light',
  montserratRegular: 'Montserrat_400Regular',
  montserratMedium: 'Montserrat_500Medium',
  montserratSemiBold: 'Montserrat_600SemiBold',
  montserratBold: 'Montserrat_700Bold',
  robotoThin: 'Roboto_100Thin',
  robotoLight: 'Roboto_300Light',
  robotoRegular: 'Roboto_400Regular',
  robotoMedium: 'Roboto_500Medium',
  robotoSemiBold: 'Roboto_500Medium',
  robotoBold: 'Roboto_700Bold',
} as const;

export const Sizes = {
  font2: moderateScaleLib(2),
  font4: moderateScaleLib(4),
  font6: moderateScaleLib(6),
  font8: moderateScaleLib(8),
  font10: moderateScaleLib(10),
  font11: moderateScaleLib(11, 0.5),
  font12: moderateScaleLib(12, 0.5),
  font14: moderateScaleLib(14, 0.5),
  font16: moderateScaleLib(16, 0.7),
  font18: moderateScaleLib(18),
  font20: moderateScaleLib(20, 0.4),
  font22: moderateScaleLib(24, 0.4),
  font26: moderateScaleLib(26, 0.5),
  font30: moderateScaleLib(30, 0.4),
  font34: moderateScaleLib(34, 0.4),
  font45: moderateScaleLib(45, 0.5),
  font50: moderateScaleLib(50, 0.5),
  font57: moderateScaleLib(57, 0.5),
  borderRadius: moderateScaleLib(12),
  base: moderateScaleLib(8),
  small: moderateScaleLib(12),
  font: moderateScaleLib(14),
  medium: moderateScaleLib(16),
  large: moderateScaleLib(18),
  extraLarge: moderateScaleLib(24),
  xxl: moderateScaleLib(32),
  xxxl: moderateScaleLib(40),
  padding: moderateScaleLib(16),
  radius: moderateScaleLib(12),
  radiusLarge: moderateScaleLib(24),
} as const;
