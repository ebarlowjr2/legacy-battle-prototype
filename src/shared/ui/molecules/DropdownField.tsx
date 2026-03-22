import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText } from '../atoms/AppText';
import type { DropdownFieldProps } from '@/shared/types';

export function DropdownField({
  label,
  value,
  placeholder = 'Select...',
  onPress,
  required = false,
  style,
}: DropdownFieldProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelRow}>
        <AppText variant="label" color={colors.textSecondary}>
          {label}
          {required ? ' *' : ''}
        </AppText>
      </View>
      <TouchableOpacity style={styles.field} onPress={onPress}>
        <AppText
          variant="body2"
          color={value ? colors.text : colors.muted}
          style={styles.value}
        >
          {value || placeholder}
        </AppText>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  value: {
    flex: 1,
  },
});
