import { useRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { Control, FieldErrors } from 'react-hook-form';

import { RegisterField } from './RegisterField';
import type { RegisterStoreFormValues } from '../../../types/auth/register';
import {
  maskCep,
  normalizeState,
} from '../../../validators/register/register.helpers';

type RegisterAddressFieldsProps = {
  control: Control<RegisterStoreFormValues>;
  errors: FieldErrors<RegisterStoreFormValues>;
  loadingCep?: boolean;
  cepLookupError?: string | null;
  onCepBlur: (value: string) => void | Promise<void>;
};

export function RegisterAddressFields({
  control,
  errors,
  loadingCep,
  cepLookupError,
  onCepBlur,
}: RegisterAddressFieldsProps) {
  const addressRef = useRef<TextInput>(null);
  const numberRef = useRef<TextInput>(null);
  const complementRef = useRef<TextInput>(null);
  const neighborhoodRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Endereço</Text>
        <Text style={styles.sectionDescription}>
          Buscamos os dados automaticamente pelo CEP quando possível.
        </Text>
      </View>

      <RegisterField
        control={control}
        name='address.cep'
        label='CEP'
        keyboardType='number-pad'
        inputMode='numeric'
        returnKeyType='next'
        autoComplete='postal-code'
        maxLength={9}
        transform={maskCep}
        onFieldBlur={onCepBlur}
        inputRef={addressRef}
        error={errors.address?.cep?.message}
      />

      <RegisterField
        control={control}
        name='address.address'
        label='Endereço'
        autoComplete='street-address'
        returnKeyType='next'
        inputRef={numberRef}
        error={errors.address?.address?.message}
      />

      <View style={styles.twoColumns}>
        <RegisterField
          control={control}
          name='address.number'
          label='Número'
          keyboardType='number-pad'
          inputMode='numeric'
          returnKeyType='next'
          inputRef={complementRef}
          containerStyle={styles.column}
          error={errors.address?.number?.message}
        />

        <RegisterField
          control={control}
          name='address.complement'
          label='Complemento'
          returnKeyType='next'
          inputRef={neighborhoodRef}
          containerStyle={styles.column}
          error={errors.address?.complement?.message}
        />
      </View>

      <RegisterField
        control={control}
        name='address.neighborhood'
        label='Bairro'
        returnKeyType='next'
        inputRef={cityRef}
        error={errors.address?.neighborhood?.message}
      />

      <View style={styles.twoColumns}>
        <RegisterField
          control={control}
          name='address.city'
          label='Cidade'
          returnKeyType='next'
          inputRef={stateRef}
          containerStyle={styles.column}
          error={errors.address?.city?.message}
        />

        <RegisterField
          control={control}
          name='address.state'
          label='UF'
          autoCapitalize='characters'
          maxLength={2}
          returnKeyType='done'
          transform={normalizeState}
          containerStyle={styles.column}
          error={errors.address?.state?.message}
        />
      </View>

      {loadingCep ? (
        <Text style={styles.feedback}>Buscando endereço pelo CEP...</Text>
      ) : null}

      {cepLookupError ? (
        <Text style={styles.error}>{cepLookupError}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionDescription: {
    color: '#666666',
    fontSize: 13,
    lineHeight: 18,
  },
  twoColumns: {
    gap: 12,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  feedback: {
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
