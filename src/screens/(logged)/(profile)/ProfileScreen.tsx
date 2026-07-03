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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  console.log('User data in ProfileScreen:', user);

  const displayName =
    user?.type === 'STORE'
      ? user.storeName || user.name
      : user?.name || t('Profile.defaultName');
  const username = user?.username
    ? `@${user.username}`
    : t('Profile.defaultUsername');
  const avatarUrl = user?.avatar;

  const menuItems: MenuItem[] = useMemo(() => {
    if (user?.type === 'STORE') {
      return [
        {
          key: 'liked',
          label: t('Profile.menu.liked'),
          onPress: () =>
            navigation.navigate('ProfileCollection', {
              title: t('Profile.menu.liked'),
              source: 'liked',
            }),
        },
        {
          key: 'sales',
          label: t('Profile.menu.sales'),
          onPress: () =>
            navigation.navigate('ProfileFeature', {
              title: t('Profile.menu.sales'),
              description: t('Profile.featureDescriptions.sales'),
            }),
        },
        {
          key: 'products',
          label: t('Profile.menu.products'),
          onPress: () => navigation.navigate('MyProducts'),
        },
        {
          key: 'finance',
          label: t('Profile.menu.finance'),
          onPress: () =>
            navigation.navigate('ProfileFeature', {
              title: t('Profile.menu.finance'),
              description: t('Profile.featureDescriptions.finance'),
            }),
        },
        {
          key: 'orders',
          label: t('Profile.menu.orders'),
          onPress: () =>
            navigation.navigate('ProfileFeature', {
              title: t('Profile.menu.orders'),
              description: t('Profile.featureDescriptions.orders'),
            }),
        },
        {
          key: 'plans',
          label: t('Profile.menu.plans'),
          onPress: () =>
            navigation.navigate('ProfileFeature', {
              title: t('Profile.menu.plans'),
              description: t('Profile.featureDescriptions.plans'),
            }),
        },
        {
          key: 'superFilters',
          label: t('Profile.menu.superFilters'),
          onPress: () =>
            navigation.navigate('ProfileFeature', {
              title: t('Profile.menu.superFilters'),
              description: t('Profile.featureDescriptions.superFilters'),
            }),
        },
        {
          key: 'support',
          label: t('Profile.menu.support'),
          onPress: () =>
            navigation.navigate('ProfileFeature', {
              title: t('Profile.menu.support'),
              description: t('Profile.featureDescriptions.support'),
            }),
        },
      ];
    }

    return [
      {
        key: 'liked',
        label: t('Profile.menu.liked'),
        onPress: () =>
          navigation.navigate('ProfileCollection', {
            title: t('Profile.menu.liked'),
            source: 'liked',
          }),
      },
      {
        key: 'orders',
        label: t('Profile.menu.ordersCustomer'),
        onPress: () =>
          navigation.navigate('ProfileFeature', {
            title: t('Profile.menu.ordersCustomer'),
            description: t('Profile.featureDescriptions.orders'),
          }),
      },
      {
        key: 'products',
        label: t('Profile.menu.productsCustomer'),
        onPress: () =>
          navigation.navigate('ProfileCollection', {
            title: t('Profile.menu.productsCustomer'),
            source: 'mine',
          }),
      },
      {
        key: 'superFilters',
        label: t('Profile.menu.superFilters'),
        onPress: () =>
          navigation.navigate('ProfileFeature', {
            title: t('Profile.menu.superFilters'),
            description: t('Profile.featureDescriptions.superFilters'),
          }),
      },
      {
        key: 'support',
        label: t('Profile.menu.support'),
        onPress: () =>
          navigation.navigate('ProfileFeature', {
            title: t('Profile.menu.support'),
            description: t('Profile.featureDescriptions.support'),
          }),
      },
    ];
  }, [navigation, user?.type, t]);

  const finalItems: MenuItem[] = [
    ...menuItems,
    {
      key: 'settings',
      label: t('Profile.menu.settings'),
      onPress: () => navigation.navigate('Settings'),
    },
    {
      key: 'logout',
      label: t('Profile.menu.logout'),
      onPress: () => signOut(),
      danger: true,
    },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.sectionLabel}>{t('Profile.sectionLabel')}</Text>

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
