import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

import {
  HomeIcon,
  TruckIcon,
  BellIcon,
  ShirtIcon,
  PlusIcon,
  ShoppingBagIcon,
  MenuIcon,
} from 'lucide-react-native';
import { useAuthStore } from '../../stores/auth.store';
import { FeaturePlaceholderScreen } from '../../screens/FeaturePlaceholderScreen';
import { HomeScreen } from '../../screens/(logged)/HomeScreen';
import { MenuScreen } from '../../screens/(logged)/MenuScreen';
import { ProfileScreen } from '../../screens/(logged)/(profile)/ProfileScreen';
import { RootTabParamList } from '../../navigation/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const colors = {
  active: '#0F7A4F',
  inactive: '#8B8F97',
  border: '#E5E7EB',
  background: '#FFFFFF',
  accent: '#F97316',
  activeSurface: 'rgba(15, 122, 79, 0.08)',
};

function UserAvatar({
  focused,
  user,
}: {
  focused: boolean;
  user: ReturnType<typeof useAuthStore.getState>['user'];
}) {
  const initials = user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <View
      style={[
        styles.avatarShell,
        focused ? styles.avatarShellActive : styles.avatarShellInactive,
      ]}
    >
      {user?.avatar ? (
        <Image
          source={{ uri: user.avatar }}
          style={styles.avatarImage}
          resizeMode='cover'
        />
      ) : (
        <Text style={styles.avatarInitials}>{initials}</Text>
      )}
    </View>
  );
}

function CenterTabButton({
  children,
  onPress,
  accessibilityState,
}: BottomTabBarButtonProps) {
  const isFocused = Boolean(accessibilityState?.selected);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.centerButton,
        isFocused ? styles.centerButtonActive : styles.centerButtonInactive,
      ]}
    >
      <View
        style={[
          styles.centerButtonInner,
          isFocused
            ? styles.centerButtonInnerActive
            : styles.centerButtonInnerInactive,
        ]}
      >
        {children}
      </View>
    </Pressable>
  );
}

function HomeTabIcon({ color, focused }: { color: string; focused: boolean }) {
  return <HomeIcon color={color} size={focused ? 25 : 24} />;
}

// function TruckTabIcon({ color }: { color: string }) {
//   return <TruckIcon color={color} />;
// }

// function ShirtTabIcon({ color }: { color: string }) {
//   return <ShirtIcon color={color} />;
// }

function ProductFormTabIcon() {
  return <PlusIcon color='#FFFFFF' size={28} />;
}

function BagTabIcon() {
  return <ShoppingBagIcon color='#FFFFFF' />;
}

function NotificationsTabIcon({ color }: { color: string }) {
  return <BellIcon color={color} />;
}

function MenuTabIcon({ color }: { color: string }) {
  return <MenuIcon color={color} />;
}

function ProfileTabIcon({ focused }: { focused: boolean }) {
  const user = useAuthStore(state => state.user);

  return <UserAvatar focused={focused} user={user} />;
}

export function TabRoutes() {
  const user = useAuthStore(state => state.user);
  const isStoreUser = user?.type === 'STORE';

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{ tabBarIcon: HomeTabIcon }}
      />

      {/* {isStoreUser ? (
        <Tab.Screen
          name='Suppliers'
          component={FeaturePlaceholderScreen}
          options={{ tabBarIcon: TruckTabIcon }}
        />
      ) : (
        <Tab.Screen
          name='Orders'
          component={FeaturePlaceholderScreen}
          options={{ tabBarIcon: ShirtTabIcon }}
        />
      )} */}

      <Tab.Screen
        name='Notifications'
        component={FeaturePlaceholderScreen}
        options={{ tabBarIcon: NotificationsTabIcon }}
      />

      {isStoreUser ? (
        <Tab.Screen
          name='ProductForm'
          component={FeaturePlaceholderScreen}
          options={{
            tabBarButton: CenterTabButton,
            tabBarIcon: ProductFormTabIcon,
          }}
        />
      ) : (
        <Tab.Screen
          name='Bag'
          component={FeaturePlaceholderScreen}
          options={{
            tabBarButton: CenterTabButton,
            tabBarIcon: BagTabIcon,
          }}
        />
      )}

      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{ tabBarIcon: ProfileTabIcon }}
      />

      <Tab.Screen
        name='Menu'
        component={MenuScreen}
        options={{ tabBarIcon: MenuTabIcon }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
    height: 72,
    borderTopWidth: 0,
    // borderRadius: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 10,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 10,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
  },
  tabBarIcon: {
    flex: 1,
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  centerButtonInactive: {
    opacity: 1,
  },
  centerButtonActive: {
    opacity: 1,
  },
  centerButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  centerButtonInnerInactive: {
    backgroundColor: colors.accent,
  },
  centerButtonInnerActive: {
    backgroundColor: '#EA580C',
  },
  avatarShell: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarShellInactive: {
    backgroundColor: 'rgba(15, 122, 79, 0.06)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  avatarShellActive: {
    backgroundColor: colors.activeSurface,
    borderWidth: 1,
    borderColor: colors.active,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    color: colors.active,
    fontSize: 12,
    fontWeight: '700',
  },
});

const tabScreenOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarActiveTintColor: colors.active,
  tabBarInactiveTintColor: colors.inactive,
  tabBarHideOnKeyboard: true,
  tabBarStyle: styles.tabBar,
  tabBarItemStyle: styles.tabBarItem,
  tabBarIconStyle: styles.tabBarIcon,
};
