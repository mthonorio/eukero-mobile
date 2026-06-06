import { ChevronDown } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  placeholder: string;
  value?: string;
  onPress: () => void;
  helperText?: string;
};

export function toSelectOptions<
  T extends { id: string | number; name: string },
>(items?: T[]): SelectOption[] {
  return (
    items?.map(item => ({ label: item.name, value: String(item.id) })) ?? []
  );
}

export function getSelectedLabel(options: SelectOption[], value?: string) {
  return options.find(option => option.value === value)?.label ?? '';
}

export function SelectField({
  label,
  placeholder,
  value,
  onPress,
  helperText,
}: SelectFieldProps) {
  return (
    <Pressable style={styles.selectField} onPress={onPress}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.selectInner}>
        <Text style={[styles.selectValue, !value && styles.selectPlaceholder]}>
          {value || placeholder}
        </Text>
        <ChevronDown color={colors.zen.muted} size={18} />
      </View>
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  selectGrid: {
    gap: 12,
  },
  selectField: {
    gap: 6,
  },
  selectInner: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.zen.border,
    backgroundColor: colors.zen.surfaceSoft,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectValue: {
    flex: 1,
    color: colors.zen.text,
    fontSize: 15,
    fontWeight: '600',
  },
  selectPlaceholder: {
    color: colors.zen.muted,
    fontWeight: '500',
  },
  fieldLabel: {
    color: colors.zen.text,
    fontSize: 13,
    fontWeight: '700',
  },
  helper: {
    color: colors.zen.muted,
    fontSize: 12,
    lineHeight: 16,
  },
});
