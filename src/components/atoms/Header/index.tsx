import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import {
  ChevronDown,
  ChevronLeft,
  SearchIcon,
  ShoppingBagIcon,
} from 'lucide-react-native';

import Logo from '../../../assets/svg/logo-eukero.svg';
import { useAuthStore } from '../../../stores/auth.store';

const colors = {
  background: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  muted: '#6B7280',
  surface: '#F3F4F6',
};

export default function Header({ navigation, back }: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const user = useAuthStore(state => state.user);
  const isStoreUser = user?.type === 'STORE';

  const handleHomePress = () => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  const handleSearchPress = () => {
    Alert.alert('Busca', 'A busca ainda não foi implementada.');
  };

  const handleBagPress = () => {
    navigation.navigate('MainTabs', {
      screen: isStoreUser ? 'ProductForm' : 'Bag',
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 10,
        },
      ]}
    >
      <View style={styles.leftGroup}>
        {back ? (
          <Pressable
            accessibilityLabel='Voltar'
            onPress={navigation.goBack}
            style={styles.backButton}
          >
            <ChevronLeft color={colors.text} size={22} strokeWidth={2.2} />
          </Pressable>
        ) : null}

        <Pressable
          accessibilityLabel='Ir para início'
          onPress={handleHomePress}
          style={styles.logoButton}
        >
          <Logo width={112} height={52} />
        </Pressable>

        {/* <View style={styles.languageSelector}>
          <Text style={styles.languageText}>PT</Text>
          <ChevronDown color={colors.muted} size={14} strokeWidth={2.5} />
        </View> */}
      </View>

      <View style={styles.rightGroup}>
        <Pressable
          accessibilityLabel='Para busca'
          onPress={handleSearchPress}
          style={styles.iconButton}
        >
          <SearchIcon color={colors.text} size={22} strokeWidth={2.1} />
        </Pressable>

        <Pressable
          accessibilityLabel='Para sacola'
          onPress={handleBagPress}
          style={styles.iconButton}
        >
          <ShoppingBagIcon color={colors.text} size={22} strokeWidth={2.1} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  logoButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  languageText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.2,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
});
