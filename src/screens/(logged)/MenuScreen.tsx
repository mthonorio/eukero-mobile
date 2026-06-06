import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronRight } from 'lucide-react-native';

import { RootStackParamList, RootTabParamList } from '../../navigation/types';
import { useAuthStore } from '../../stores/auth.store';

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Menu'>,
  NativeStackScreenProps<RootStackParamList>
>;

type MenuItem = {
  key: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
};

type MenuSection = {
  key: 'USER' | 'STORE';
  title: 'USER' | 'STORE';
  items: MenuItem[];
};

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  accent: '#F97316',
};

function buildSections(navigation: Props['navigation']): MenuSection[] {
  const userItems: MenuItem[] = [
    {
      key: 'home',
      label: 'Início',
      onPress: () => navigation.navigate('Home'),
    },
    {
      key: 'notifications',
      label: 'Notificações',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      key: 'bag',
      label: 'Sacola',
      onPress: () => navigation.navigate('Bag'),
    },
    {
      key: 'profile',
      label: 'Perfil',
      onPress: () => navigation.navigate('Profile'),
    },
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
      label: 'Minhas compras',
      onPress: () =>
        navigation.navigate('ProfileFeature', {
          title: 'Minhas compras',
          description: 'Histórico de compras em desenvolvimento.',
        }),
    },
    {
      key: 'products',
      label: 'Meus produtos',
      onPress: () => navigation.navigate('MyProducts'),
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

  const storeItems: MenuItem[] = [
    {
      key: 'home',
      label: 'Início',
      onPress: () => navigation.navigate('Home'),
    },
    {
      key: 'notifications',
      label: 'Notificações',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      key: 'productForm',
      label: 'Novo produto',
      onPress: () => navigation.navigate('ProductForm'),
    },
    {
      key: 'profile',
      label: 'Perfil',
      onPress: () => navigation.navigate('Profile'),
    },
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

  return [
    {
      key: 'USER',
      title: 'USER',
      items: userItems,
    },
    {
      key: 'STORE',
      title: 'STORE',
      items: storeItems,
    },
  ];
}

export function MenuScreen({ navigation }: Props) {
  const user = useAuthStore(state => state.user);
  const signOut = useAuthStore(state => state.signOut);

  const sections = useMemo(() => {
    const all = buildSections(navigation);
    const userType = user?.type ?? 'USER';
    return all.filter(s => s.key === userType);
  }, [navigation, user?.type]);

  const finalItems: MenuItem[] = [
    {
      key: 'settings',
      label: 'Configurações',
      onPress: () => navigation.navigate('ProfileSettings'),
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
      {sections.map(section => (
        <View key={section.key} style={styles.menuCard}>
          <Text style={styles.groupLabel}>{section.title}</Text>

          {section.items.map(item => (
            <Pressable
              key={item.key}
              onPress={item.onPress}
              style={styles.menuItem}
            >
              <Text
                style={[
                  styles.menuLabel,
                  item.danger && styles.menuLabelDanger,
                ]}
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
      ))}

      <View style={styles.menuCard}>
        <Text style={styles.groupLabel}>AÇÕES</Text>

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
    paddingTop: 16,
    paddingBottom: 60,
    gap: 16,
  },
  headerCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
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
    fontWeight: '600',
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  menuCard: {
    padding: 10,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  groupLabel: {
    paddingHorizontal: 10,
    paddingTop: 4,
    paddingBottom: 8,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.muted,
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
});
