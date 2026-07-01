import { useMemo } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronRight, Star } from 'lucide-react-native';

import {
  RootStackParamList,
  RootTabParamList,
} from '../../../navigation/types';
import { useAuthStore } from '../../../stores/auth.store';

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

type MenuItem = {
  key: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
};

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
  primarySoft: 'rgba(15, 122, 79, 0.10)',
  accent: '#F97316',
};

export function ProfileScreen({ navigation }: Props) {
  const user = useAuthStore(state => state.user);
  const signOut = useAuthStore(state => state.signOut);

  console.log('User data in ProfileScreen:', user);

  const displayName =
    user?.type === 'STORE'
      ? user.storeName || user.name
      : user?.name || 'Meu Perfil';
  const username = user?.username ? `@${user.username}` : '@usuario';
  const avatarUrl = user?.avatar;

  const menuItems: MenuItem[] = useMemo(() => {
    if (user?.type === 'STORE') {
      return [
        {
          key: 'liked',
          label: 'Curtidos',
          onPress: () =>
            navigation.navigate('ProfileCollection', {
              title: 'Curtidos',
              source: 'liked',
            }),
        },
        {
          key: 'sales',
          label: 'Minhas vendas',
          onPress: () =>
            navigation.navigate('ProfileFeature', {
              title: 'Minhas vendas',
              description: 'Lista de vendas em desenvolvimento.',
            }),
        },
        {
          key: 'products',
          label: 'Meus produtos',
          onPress: () => navigation.navigate('MyProducts'),
        },
        {
          key: 'finance',
          label: 'Gestão Financeira',
          onPress: () =>
            navigation.navigate('ProfileFeature', {
              title: 'Gestão Financeira',
              description: 'Área financeira em desenvolvimento.',
            }),
        },
        {
          key: 'orders',
          label: 'Minhas compras',
          onPress: () =>
            navigation.navigate('ProfileFeature', {
              title: 'Minhas compras',
              description: 'Histórico de compras em desenvolvimento.',
            }),
        },
        {
          key: 'plans',
          label: 'Planos',
          onPress: () =>
            navigation.navigate('ProfileFeature', {
              title: 'Planos',
              description: 'Gerenciamento de planos em desenvolvimento.',
            }),
        },
        {
          key: 'superFilters',
          label: 'Super Filtros',
          onPress: () =>
            navigation.navigate('ProfileFeature', {
              title: 'Super Filtros',
              description: 'Super filtros em desenvolvimento.',
            }),
        },
        {
          key: 'support',
          label: 'Suporte',
          onPress: () =>
            navigation.navigate('ProfileFeature', {
              title: 'Suporte',
              description: 'Atendimento ao usuário em desenvolvimento.',
            }),
        },
      ];
    }

    return [
      {
        key: 'liked',
        label: 'Curtidos',
        onPress: () =>
          navigation.navigate('ProfileCollection', {
            title: 'Curtidos',
            source: 'liked',
          }),
      },
      {
        key: 'orders',
        label: 'Minhas Compras',
        onPress: () =>
          navigation.navigate('ProfileFeature', {
            title: 'Minhas Compras',
            description: 'Histórico de compras em desenvolvimento.',
          }),
      },
      {
        key: 'products',
        label: 'Meus Produtos',
        onPress: () =>
          navigation.navigate('ProfileCollection', {
            title: 'Meus Produtos',
            source: 'mine',
          }),
      },
      {
        key: 'superFilters',
        label: 'Super Filtros',
        onPress: () =>
          navigation.navigate('ProfileFeature', {
            title: 'Super Filtros',
            description: 'Super filtros em desenvolvimento.',
          }),
      },
      {
        key: 'support',
        label: 'Suporte',
        onPress: () =>
          navigation.navigate('ProfileFeature', {
            title: 'Suporte',
            description: 'Atendimento ao usuário em desenvolvimento.',
          }),
      },
    ];
  }, [navigation, user?.type]);

  const finalItems: MenuItem[] = [
    ...menuItems,
    {
      key: 'settings',
      label: 'Configurações',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      key: 'logout',
      label: 'Sair',
      onPress: () => signOut(),
      danger: true,
    },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.sectionLabel}>Meu Perfil</Text>

        <View style={styles.identityBlock}>
          <View style={styles.avatarWrap}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Star color={colors.primary} size={30} fill={colors.primary} />
              </View>
            )}
          </View>

          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.username}>{username}</Text>
        </View>
      </View>

      <View style={styles.menuCard}>
        {finalItems.map(item => (
          <Pressable
            key={item.key}
            onPress={item.onPress}
            style={styles.menuItem}
          >
            <Text
              style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}
            >
              {item.label}
            </Text>
            <ChevronRight
              color={item.danger ? colors.accent : colors.muted}
              size={18}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  headerCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 14,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    alignSelf: 'flex-start',
  },
  identityBlock: {
    alignItems: 'center',
    gap: 8,
  },
  avatarWrap: {
    width: 112,
    height: 112,
    borderRadius: 56,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  username: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '600',
    textAlign: 'center',
  },
  menuCard: {
    padding: 10,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 48,
  },
  menuItem: {
    minHeight: 56,
    paddingHorizontal: 10,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  menuLabelDanger: {
    color: colors.accent,
  },
  helperCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  helperTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
});
