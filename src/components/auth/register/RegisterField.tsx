import { forwardRef, type ForwardedRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { Controller } from 'react-hook-form';

type RegisterFieldProps = {
  control: any;
  name: string;
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  transform?: (value: string) => string;
  onFieldBlur?: (value: string) => void;
  inputRef?: React.Ref<TextInput>;
  containerStyle?: object;
} & Omit<
  TextInputProps,
  'value' | 'onBlur' | 'onChangeText' | 'ref' | 'placeholder'
>;

function RegisterFieldBase(
  {
    control,
    name,
    label,
    error,
    helperText,
    required,
    transform,
    onFieldBlur,
    inputRef,
    containerStyle,
    style,
    ...inputProps
  }: RegisterFieldProps,
  ref: ForwardedRef<TextInput>,
) {
  const resolvedRef = ref ?? inputRef;

  return (
    <Controller
      control={control}
      name={name as any}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={[styles.fieldWrap, containerStyle]}>
          <Text style={styles.label}>
            {label}
            {required ? ' *' : ''}
          </Text>

          <TextInput
            ref={resolvedRef}
            value={value ?? ''}
            placeholder={label}
            placeholderTextColor='#8f8f8f'
            onBlur={() => {
              onBlur();
              onFieldBlur?.(String(value ?? ''));
            }}
            onChangeText={text => onChange(transform ? transform(text) : text)}
            style={[styles.input, error ? styles.inputError : null, style]}
            {...inputProps}
          />

          {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      )}
    />
  );
}

const ForwardedRegisterField = forwardRef(RegisterFieldBase) as (
  props: RegisterFieldProps & { ref?: React.Ref<TextInput> },
) => React.ReactElement;

export { ForwardedRegisterField as RegisterField };

const styles = StyleSheet.create({
  fieldWrap: {
    gap: 6,
  },
  label: {
    color: '#202020',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#d3d3d3',
    borderRadius: 14,
    borderWidth: 1,
    color: '#111111',
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  inputError: {
    borderColor: '#b42318',
  },
  helper: {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 16,
  },
  error: {
    color: '#b42318',
    fontSize: 12,
    lineHeight: 16,
  },
});
