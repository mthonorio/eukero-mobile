import { useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { RegisterPersonFormValues } from '../../../types/auth/register';
import { RegisterField } from './RegisterField';
import {
  maskCpf,
  maskPhone,
} from '../../../validators/register/register.helpers';
import { createRegisterPersonSchema } from '../../../validators/register/register.schemas';

type RegisterPersonFormProps = {
  loading?: boolean;
  error?: string | null;
  onSubmit: (values: RegisterPersonFormValues) => Promise<void> | void;
  onBack: () => void;
};

export function RegisterPersonForm({
  loading,
  error,
  onSubmit,
  onBack,
}: RegisterPersonFormProps) {
  const nameRef = useRef<TextInput>(null);
  const documentRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const pixKeyRef = useRef<TextInput>(null);
  const { t } = useTranslation();
  const registerPersonSchema = useMemo(() => createRegisterPersonSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPersonFormValues>({
    resolver: zodResolver(
      registerPersonSchema,
    ) as unknown as Resolver<RegisterPersonFormValues>,
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      userType: 'USER',
      document: '',
      pixKey: '',
    },
    mode: 'onBlur',
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('RegisterPersonForm.title')}</Text>
        <Text style={styles.description}>
          {t('RegisterPersonForm.description')}
        </Text>
      </View>

      {error ? <Text style={styles.bannerError}>{error}</Text> : null}

      <View style={styles.form}>
        <RegisterField
          control={control}
          name='name'
          label={t('RegisterPersonForm.fullNameLabel')}
          autoCapitalize='words'
          textContentType='name'
          returnKeyType='next'
          inputRef={nameRef}
          error={errors.name?.message}
        />

        <RegisterField
          control={control}
          name='document'
          label={t('RegisterPersonForm.documentLabel')}
          keyboardType='number-pad'
          inputMode='numeric'
          maxLength={14}
          returnKeyType='next'
          transform={maskCpf}
          inputRef={documentRef}
          error={errors.document?.message}
        />

        <RegisterField
          control={control}
          name='phone'
          label={t('RegisterPersonForm.phoneLabel')}
          keyboardType='phone-pad'
          inputMode='tel'
          maxLength={15}
          returnKeyType='next'
          transform={maskPhone}
          inputRef={phoneRef}
          error={errors.phone?.message}
        />

        <RegisterField
          control={control}
          name='email'
          label={t('RegisterPersonForm.emailLabel')}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          autoComplete='email'
          textContentType='emailAddress'
          returnKeyType='next'
          inputRef={emailRef}
          error={errors.email?.message}
        />

        <RegisterField
          control={control}
          name='password'
          label={t('RegisterPersonForm.passwordLabel')}
          secureTextEntry
          autoComplete='password-new'
          textContentType='newPassword'
          returnKeyType='next'
          inputRef={passwordRef}
          helperText={t('RegisterPersonForm.passwordHelperText')}
          error={errors.password?.message}
        />

        <RegisterField
          control={control}
          name='confirmPassword'
          label={t('RegisterPersonForm.confirmPasswordLabel')}
          secureTextEntry
          autoComplete='password-new'
          textContentType='newPassword'
          returnKeyType='next'
          inputRef={confirmPasswordRef}
          error={errors.confirmPassword?.message}
        />

        <RegisterField
          control={control}
          name='pixKey'
          label={t('RegisterPersonForm.pixKeyLabel')}
          autoCapitalize='none'
          autoCorrect={false}
          returnKeyType='done'
          inputRef={pixKeyRef}
          error={errors.pixKey?.message}
        />

        <View style={styles.actions}>
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            style={({ pressed }) => [
              styles.primaryButton,
              loading ? styles.primaryButtonDisabled : null,
              pressed ? styles.pressed : null,
            ]}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color='#fff' />
                <Text style={styles.primaryButtonText}>{t('RegisterPersonForm.creatingAccount')}</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>{t('RegisterPersonForm.createAccount')}</Text>
            )}
          </Pressable>
          <Pressable onPress={onBack} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>{t('RegisterPersonForm.back')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  header: {
    gap: 6,
  },
  title: {
    color: '#111111',
    fontSize: 26,
    fontWeight: '800',
  },
  description: {
    color: '#5c5c5c',
    fontSize: 14,
    lineHeight: 20,
  },
  bannerError: {
    backgroundColor: '#fef3f2',
    borderColor: '#fecdca',
    borderRadius: 14,
    borderWidth: 1,
    color: '#b42318',
    fontSize: 13,
    lineHeight: 18,
    padding: 12,
  },
  form: {
    gap: 14,
  },
  actions: {
    gap: 12,
    marginTop: 4,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#640000ff',
    borderRadius: 16,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButtonDisabled: {
    opacity: 0.75,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#640000ff',
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#640000ff',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
});
