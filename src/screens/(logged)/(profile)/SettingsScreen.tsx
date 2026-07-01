import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Link2,
  MapPin,
  Repeat,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react-native';

import { RootStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../stores/auth.store';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
  primarySoft: 'rgba(15, 122, 79, 0.10)',
};

type SettingsItem = {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ color: string; size: number }>;
  onPress: () => void;
};

export function SettingsScreen({ navigation }: Props) {
  const user = useAuthStore(state => state.user);
  const isStoreUser = user?.type === 'STORE';

  const items = useMemo<SettingsItem[]>(() => {
    const base: SettingsItem[] = [
      {
        key: 'profile',
        label: 'Perfil',
        description: 'Dados pessoais, avatar e Pix.',
        icon: UserRound,
        onPress: () => navigation.navigate('ProfileSettings'),
      },
      {
        key: 'addresses',
        label: 'Endereços',
        description: 'Gerencie seus endereços cadastrados.',
        icon: MapPin,
        onPress: () => navigation.navigate('Addresses'),
      },
      {
        key: 'language',
        label: 'Idioma',
        description: 'Escolha o idioma do aplicativo.',
        icon: Globe,
        onPress: () => navigation.navigate('Language'),
      },
      {
        key: 'terms',
        label: 'Termos e políticas',
        description: 'Documentos legais e política de trocas.',
        icon: ShieldCheck,
        onPress: () => navigation.navigate('Terms'),
      },
    ];

    if (isStoreUser) {
      base.push(
        {
          key: 'connect',
          label: 'Conectar Instagram',
          description: 'Vincule sua conta comercial do Instagram.',
          icon: Link2,
          onPress: () => navigation.navigate('Connect'),
        },
        {
          key: 'globalVariables',
          label: 'Variáveis globais',
          description: 'Parâmetros gerais da sua loja.',
          icon: SlidersHorizontal,
          onPress: () => navigation.navigate('GlobalVariables'),
        },
      );
    } else {
      base.push({
        key: 'migrateToStore',
        label: 'Migrar para loja',
        description: 'Transforme sua conta em uma loja.',
        icon: Repeat,
        onPress: () => navigation.navigate('MigrateToStore'),
      });
    }

    return base;
  }, [navigation, isStoreUser]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>

        <View>
          <Text style={styles.heroEyebrow}>Configurações</Text>
          <Text style={styles.title}>Gerencie sua conta</Text>
        </View>
      </View>

      <View style={styles.card}>
        {items.map(item => (
          <Pressable
            key={item.key}
            style={styles.itemRow}
            onPress={item.onPress}
          >
            <View style={styles.iconWrap}>
              <item.icon color={colors.primary} size={18} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
            <ChevronRight color={colors.muted} size={18} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 48, gap: 16 },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
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
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: { fontSize: 18, lineHeight: 24, fontWeight: '800', color: colors.text },
  card: {
    padding: 10,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 18,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  itemInfo: { flex: 1 },
  itemLabel: { fontSize: 15, fontWeight: '700', color: colors.text },
  itemDescription: { fontSize: 12, color: colors.muted },
});
