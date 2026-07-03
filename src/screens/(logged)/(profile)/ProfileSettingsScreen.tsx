import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, Camera, Edit2 } from 'lucide-react-native';
import { launchImageLibrary, type Asset } from 'react-native-image-picker';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../stores/auth.store';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { RegisterField } from '../../../components/auth/register/RegisterField';
import {
  maskCpfCnpj,
  maskPhone,
} from '../../../validators/register/register.helpers';
import {
  createProfileSettingsSchema,
  type ProfileSettingsFormValues,
} from '../../../validators/profile/profile.schemas';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSettings'>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
  orange: '#ef7000ff',
};

function maskEmail(email: string): string {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const maskedLocal =
    local.slice(0, 3) + '•'.repeat(Math.max(0, local.length - 3));
  const [provider = '', ...tldParts] = domain.split('.');
  const maskedProvider =
    provider.slice(0, 2) + '•'.repeat(Math.max(0, provider.length - 2));
  const tld = tldParts.join('.');
  return tld
    ? `${maskedLocal}@${maskedProvider}.${tld}`
    : `${maskedLocal}@${maskedProvider}`;
}

export function ProfileSettingsScreen({ navigation }: Props) {
  const user = useAuthStore(state => state.user);
  const updateProfile = useAuthStore(state => state.updateProfile);

  const [pendingImage, setPendingImage] = useState<Asset | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const isStoreUser = user?.type === 'STORE';
  const { t } = useTranslation();
  const title = isStoreUser
    ? t('ProfileSettings.titleStore')
    : t('ProfileSettings.title');
  const profileSettingsSchema = useMemo(() => createProfileSettingsSchema(t), [t]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(
      profileSettingsSchema,
    ) as unknown as Resolver<ProfileSettingsFormValues>,
    defaultValues: {
      name: user?.name ?? '',
      username: user?.username ?? '',
      storeName: user?.storeName ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
      newPassword: '',
      confirmNewPassword: '',
      pixOwnerName: '',
      pixKey: '',
      pixDocument: '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    AuthService.getPixData()
      .then(pixData => {
        setValue('pixOwnerName', pixData.ownerName ?? '');
        setValue('pixKey', pixData.pixKey ?? '');
        setValue('pixDocument', pixData.document ?? '');
      })
      .catch(() => {});
  }, [setValue]);

  const avatarUri = pendingImage?.uri ?? user?.avatar ?? undefined;

  async function handlePickAvatar() {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (result.didCancel || !result.assets?.length) return;

    const asset = result.assets[0];
    if (asset) setPendingImage(asset);
  }

  const handleSave = async (values: ProfileSettingsFormValues) => {
    try {
      setIsSaving(true);

      let updatedAvatar = user?.avatar;

      if (pendingImage?.uri) {
        const uploaded = await UserService.changeUserAvatar({
          uri: pendingImage.uri,
          name: pendingImage.fileName ?? 'avatar.jpg',
          type: pendingImage.type ?? 'image/jpeg',
        });
        updatedAvatar = uploaded.photo;
      }

      await updateProfile({
        name: values.name,
        username: values.username,
        storeName: isStoreUser ? values.storeName : undefined,
        avatar: updatedAvatar,
        phone: values.phone,
        email: values.email,
      });

      const pixOwnerName = values.pixOwnerName?.trim() ?? '';
      const pixKey = values.pixKey?.trim() ?? '';
      const pixDocument = values.pixDocument?.trim() ?? '';

      if (pixOwnerName && pixKey && pixDocument) {
        await AuthService.postPixData({
          ownerName: pixOwnerName,
          pixKey,
          document: pixDocument,
        });
      }

      navigation.goBack();
    } catch {
      Alert.alert(
        t('ProfileSettings.errors.saveTitle'),
        t('ProfileSettings.errors.saveMessage'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ChevronLeft color={colors.text} size={22} />
            </Pressable>

            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{t('ProfileSettings.breadcrumb')}</Text>
            </View>
          </View>

          <View style={styles.avatarSection}>
            <Pressable style={styles.avatarWrap} onPress={handlePickAvatar}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Camera color={colors.muted} size={28} />
                </View>
              )}
              <View style={styles.avatarBadge}>
                <Camera color='#FFFFFF' size={14} />
              </View>
            </Pressable>
            <Text style={styles.avatarHint}>{t('ProfileSettings.avatarHint')}</Text>
          </View>

          <RegisterField
            control={control}
            name='name'
            label={t('ProfileSettings.fields.name')}
            autoCapitalize='words'
            returnKeyType='next'
            error={errors.name?.message}
          />

          <RegisterField
            control={control}
            name='username'
            label={t('ProfileSettings.fields.username')}
            autoCapitalize='none'
            returnKeyType='next'
            error={errors.username?.message}
          />

          {isStoreUser ? (
            <RegisterField
              control={control}
              name='storeName'
              label={t('ProfileSettings.fields.storeName')}
              autoCapitalize='words'
              returnKeyType='next'
              error={errors.storeName?.message}
            />
          ) : null}

          <RegisterField
            control={control}
            name='phone'
            label={t('ProfileSettings.fields.phone')}
            keyboardType='phone-pad'
            inputMode='tel'
            maxLength={15}
            returnKeyType='next'
            transform={maskPhone}
            error={errors.phone?.message}
          />

          <View style={styles.field}>
            <Text style={styles.label}>{t('ProfileSettings.fields.email')}</Text>
            {isChangingEmail ? (
              <RegisterField
                control={control}
                name='email'
                label=''
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                autoComplete='email'
                returnKeyType='next'
                error={errors.email?.message}
                containerStyle={styles.noGap}
              />
            ) : (
              <View style={styles.maskedRow}>
                <View style={styles.maskedValue}>
                  <Text style={styles.maskedText}>
                    {maskEmail(user?.email ?? '')}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setIsChangingEmail(true)}
                  style={styles.editButton}
                >
                  <Edit2 color={colors.primary} size={15} />
                  <Text style={styles.editButtonText}>{t('ProfileSettings.changeButton')}</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('ProfileSettings.fields.password')}</Text>
            {isChangingPassword ? (
              <View style={styles.passwordSection}>
                <RegisterField
                  control={control}
                  name='newPassword'
                  label={t('ProfileSettings.fields.newPassword')}
                  secureTextEntry
                  autoComplete='password-new'
                  textContentType='newPassword'
                  returnKeyType='next'
                  helperText={t('ProfileSettings.hints.newPassword')}
                  error={errors.newPassword?.message}
                />
                <RegisterField
                  control={control}
                  name='confirmNewPassword'
                  label={t('ProfileSettings.fields.confirmNewPassword')}
                  secureTextEntry
                  autoComplete='password-new'
                  textContentType='newPassword'
                  returnKeyType='done'
                  error={errors.confirmNewPassword?.message}
                />
              </View>
            ) : (
              <View style={styles.maskedRow}>
                <View style={styles.maskedValue}>
                  <Text style={styles.maskedText}>{'•'.repeat(8)}</Text>
                </View>
                <Pressable
                  onPress={() => setIsChangingPassword(true)}
                  style={styles.editButton}
                >
                  <Edit2 color={colors.primary} size={15} />
                  <Text style={styles.editButtonText}>{t('ProfileSettings.changeButton')}</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.pixSection}>
            <Text style={styles.pixTitle}>{t('ProfileSettings.pixSectionTitle')}</Text>

            <RegisterField
              control={control}
              name='pixOwnerName'
              label={t('ProfileSettings.fields.pixOwnerName')}
              autoCapitalize='words'
              returnKeyType='next'
              helperText={t('ProfileSettings.hints.pixOwnerName')}
              error={errors.pixOwnerName?.message}
            />

            <RegisterField
              control={control}
              name='pixKey'
              label={t('ProfileSettings.fields.pixKey')}
              autoCapitalize='none'
              returnKeyType='next'
              helperText={t('ProfileSettings.hints.pixKey')}
              error={errors.pixKey?.message}
            />

            <RegisterField
              control={control}
              name='pixDocument'
              label={t('ProfileSettings.fields.pixDocument')}
              keyboardType='number-pad'
              inputMode='numeric'
              returnKeyType='done'
              transform={maskCpfCnpj}
              helperText={t('ProfileSettings.hints.pixDocument')}
              error={errors.pixDocument?.message}
            />
          </View>

          <Pressable
            style={[styles.primaryButton, isSaving && styles.disabledButton]}
            onPress={handleSubmit(handleSave)}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color='#FFFFFF' />
            ) : (
              <Text style={styles.primaryButtonText}>{t('ProfileSettings.saveButton')}</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  card: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  avatarWrap: {
    position: 'relative',
    width: 90,
    height: 90,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surfaceSoft,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  avatarHint: {
    fontSize: 12,
    color: colors.muted,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202020',
  },
  noGap: {
    gap: 0,
  },
  maskedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  maskedValue: {
    flex: 1,
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  maskedText: {
    fontSize: 15,
    color: colors.muted,
    letterSpacing: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  passwordSection: {
    gap: 10,
  },
  pixSection: {
    gap: 14,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pixTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  primaryButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
