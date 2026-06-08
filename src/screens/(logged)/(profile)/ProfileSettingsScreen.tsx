import { useMemo, useState } from 'react';
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
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { launchImageLibrary, type Asset } from 'react-native-image-picker';

import { RootStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../stores/auth.store';
import { UserService } from '../../../services/user.service';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSettings'>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
  primarySoft: 'rgba(15, 122, 79, 0.10)',
  orange: '#ef7000ff',
};

export function ProfileSettingsScreen({ navigation }: Props) {
  const user = useAuthStore(state => state.user);
  const updateProfile = useAuthStore(state => state.updateProfile);

  const [name, setName] = useState(user?.name ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [storeName, setStoreName] = useState(user?.storeName ?? '');
  const [pendingImage, setPendingImage] = useState<Asset | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isStoreUser = user?.type === 'STORE';

  const title = useMemo(
    () => (isStoreUser ? 'Editar perfil da loja' : 'Editar perfil'),
    [isStoreUser],
  );

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

  const handleSave = async () => {
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
        name,
        username,
        storeName: isStoreUser ? storeName : undefined,
        avatar: updatedAvatar,
      });

      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
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
              <Text style={styles.subtitle}>Configurações &gt; Perfil</Text>
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
            <Text style={styles.avatarHint}>Toque para alterar a foto</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize='none'
            />
          </View>

          {isStoreUser ? (
            <View style={styles.field}>
              <Text style={styles.label}>Nome da loja</Text>
              <TextInput
                value={storeName}
                onChangeText={setStoreName}
                style={styles.input}
              />
            </View>
          ) : null}

          <Pressable
            style={[styles.primaryButton, isSaving && styles.disabledButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color='#FFFFFF' />
            ) : (
              <Text style={styles.primaryButtonText}>Salvar alterações</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  card: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
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
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
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
