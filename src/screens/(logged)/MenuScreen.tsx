import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
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

function buildSections(
  navigation: Props['navigation'],
  t: (key: string) => string,
): MenuSection[] {
  const userItems: MenuItem[] = [
    {
      key: 'home',
      label: t('Menu.home'),
      onPress: () => navigation.navigate('Home'),
    },
    {
      key: 'notifications',
      label: t('Menu.notifications'),
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      key: 'bag',
      label: t('Menu.bag'),
      onPress: () => navigation.navigate('Bag'),
    },
    {
      key: 'profile',
      label: t('Menu.profile'),
      onPress: () => navigation.navigate('Profile'),
    },
    {
      key: 'liked',
      label: t('Menu.liked'),
      onPress: () =>
        navigation.navigate('ProfileCollection', {
          title: t('Menu.liked'),
          source: 'liked',
        }),
    },
    {
      key: 'orders',
      label: t('Menu.orders'),
      onPress: () => navigation.navigate('MainTabs', { screen: 'Orders' }),
    },
    {
      key: 'products',
      label: t('Menu.products'),
      onPress: () => navigation.navigate('MyProducts'),
    },
    {
      key: 'superFilters',
      label: t('Menu.superFilters'),
      onPress: () =>
        navigation.navigate('ProfileFeature', {
          title: t('Menu.superFilters'),
          description: t('Menu.superFiltersDescription'),
        }),
    },
    {
      key: 'support',
      label: t('Menu.support'),
      onPress: () => navigation.navigate('Support'),
    },
  ];

  const storeItems: MenuItem[] = [
    {
      key: 'home',
      label: t('Menu.home'),
      onPress: () => navigation.navigate('Home'),
    },
    {
      key: 'notifications',
      label: t('Menu.notifications'),
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      key: 'dashboard',
      label: t('Menu.dashboard'),
      onPress: () => navigation.navigate('Dashboard'),
    },
    {
      key: 'productForm',
      label: t('Menu.newProduct'),
      onPress: () => navigation.navigate('ProductForm'),
    },
    {
      key: 'profile',
      label: t('Menu.profile'),
      onPress: () => navigation.navigate('Profile'),
    },
    {
      key: 'liked',
      label: t('Menu.liked'),
      onPress: () =>
        navigation.navigate('ProfileCollection', {
          title: t('Menu.liked'),
          source: 'liked',
        }),
    },
    {
      key: 'sales',
      label: t('Menu.sales'),
      onPress: () => navigation.navigate('Sales'),
    },
    {
      key: 'products',
      label: t('Menu.products'),
      onPress: () => navigation.navigate('MyProducts'),
    },
    {
      key: 'finance',
      label: t('Menu.finance'),
      onPress: () => navigation.navigate('Financial'),
    },
    {
      key: 'pieces',
      label: t('Menu.pieces'),
      onPress: () => navigation.navigate('Pieces'),
    },
    {
      key: 'stock',
      label: t('Menu.stock'),
      onPress: () => navigation.navigate('Stock'),
    },
    {
      key: 'orders',
      label: t('Menu.orders'),
      onPress: () =>
        navigation.navigate('ProfileFeature', {
          title: t('Menu.orders'),
          description: t('Menu.ordersDescription'),
        }),
    },
    {
      key: 'plans',
      label: t('Menu.plans'),
      onPress: () => navigation.navigate('Plans'),
    },
    {
      key: 'support',
      label: t('Menu.support'),
      onPress: () => navigation.navigate('Support'),
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
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);
  const signOut = useAuthStore(state => state.signOut);

  const sections = useMemo(() => {
    const all = buildSections(navigation, t);
    const userType = user?.type ?? 'USER';
    return all.filter(s => s.key === userType);
  }, [navigation, user?.type, t]);

  const finalItems: MenuItem[] = [
    {
      key: 'settings',
      label: t('Menu.settings'),
      onPress: () => navigation.navigate('Settings'),
    },
    {
      key: 'logout',
      label: t('Menu.logout'),
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
        <Text style={styles.groupLabel}>{t('Menu.actionsSection')}</Text>

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
