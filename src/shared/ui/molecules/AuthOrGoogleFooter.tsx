import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AppText } from '../atoms/AppText';
import { Button } from './Button';
import {
  borderWidths,
  colors,
  fontSizes,
  fontWeights,
  sizes,
  spacing,
} from '@/shared/constants/theme';
import type { AuthOrGoogleFooterProps } from '@/shared/types';

export function AuthOrGoogleFooter({
  orLabel,
  googleButtonLabel,
  footerLeadText,
  footerLinkLabel,
  onGooglePress,
  onFooterLinkPress,
  googleLoading = false,
  googleDisabled = false,
  style,
}: AuthOrGoogleFooterProps) {
  return (
    <View style={[styles.root, style]}>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <AppText variant="captionSm" color={colors.textSecondary} style={styles.dividerText}>
          {orLabel}
        </AppText>
        <View style={styles.dividerLine} />
      </View>

      <Button
        variant="outline"
        loading={googleLoading}
        disabled={googleDisabled}
        onPress={onGooglePress}
        leftIcon={
          <Image
            source={{ uri: 'https://www.google.com/favicon.ico' }}
            style={styles.googleIcon}
          />
        }
      >
        {googleButtonLabel}
      </Button>

      <View style={styles.footerRow}>
        <AppText variant="body1" color={colors.textSecondary} style={styles.footerLead}>
          {footerLeadText}
        </AppText>
        <TouchableOpacity onPress={onFooterLinkPress} hitSlop={8}>
          <AppText variant="body1" color={colors.text} style={styles.footerLink}>
            {footerLinkLabel}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing[4],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  dividerLine: {
    flex: 1,
    height: borderWidths.hairline,
    backgroundColor: colors.inputBorder,
  },
  dividerText: {
    fontSize: fontSizes.xs,
  },
  googleIcon: {
    width: sizes.googleIcon,
    height: sizes.googleIcon,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  footerLead: {
    fontSize: fontSizes.sm,
  },
  footerLink: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
});
