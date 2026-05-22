import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Svg, Path, Line, Circle } from 'react-native-svg';

import { useAuthStore } from '../../stores/auth.store';
import { FeaturePlaceholderScreen } from '../../screens/FeaturePlaceholderScreen';
import { HomeScreen } from '../../screens/HomeScreen';
import { ProfileScreen } from '../../screens/ProfileScreen';
import { RootTabParamList } from '../../navigation/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

type IconProps = {
  color: string;
  size?: number;
};

const colors = {
  active: '#0F7A4F',
  inactive: '#8B8F97',
  border: '#E5E7EB',
  background: '#FFFFFF',
  accent: '#F97316',
  activeSurface: 'rgba(15, 122, 79, 0.08)',
};

function HomeIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4H10v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9.5Z'
        stroke={color}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  );
}

function TruckIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M3 7h11v10H3z'
        stroke={color}
        strokeWidth={2}
        strokeLinejoin='round'
      />
      <Path
        d='M14 10h4l3 3v4h-7z'
        stroke={color}
        strokeWidth={2}
        strokeLinejoin='round'
      />
      <Circle cx='8' cy='18' r='1.5' stroke={color} strokeWidth={2} />
      <Circle cx='18' cy='18' r='1.5' stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function PlusIcon({ color, size = 28 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Line
        x1='12'
        y1='5'
        x2='12'
        y2='19'
        stroke={color}
        strokeWidth={3}
        strokeLinecap='round'
      />
      <Line
        x1='5'
        y1='12'
        x2='19'
        y2='12'
        stroke={color}
        strokeWidth={3}
        strokeLinecap='round'
      />
    </Svg>
  );
}

function BagIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M6 8h12l-1 12H7L6 8Z'
        stroke={color}
        strokeWidth={2}
        strokeLinejoin='round'
      />
      <Path
        d='M9 8a3 3 0 0 1 6 0'
        stroke={color}
        strokeWidth={2}
        strokeLinecap='round'
      />
    </Svg>
  );
}

function BellIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M12 4a5 5 0 0 0-5 5v3.3c0 .8-.3 1.6-.8 2.2L5 16h14l-1.2-1.5c-.5-.6-.8-1.4-.8-2.2V9a5 5 0 0 0-5-5Z'
        stroke={color}
        strokeWidth={2}
        strokeLinejoin='round'
      />
      <Path
        d='M10 19a2 2 0 0 0 4 0'
        stroke={color}
        strokeWidth={2}
        strokeLinecap='round'
      />
    </Svg>
  );
}

function ShirtIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M9 4.5 12 7l3-2.5 3 2-2 3v9H8v-9L6 6.5l3-2Z'
        stroke={color}
        strokeWidth={2}
        strokeLinejoin='round'
      />
    </Svg>
  );
}

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

function getTabButton(routeName: string) {
  if (routeName !== 'ProductForm' && routeName !== 'Bag') {
    return undefined;
  }

  return function TabButton({
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
  };
}

export function TabRoutes() {
  const user = useAuthStore(state => state.user);
  const isStoreUser = user?.type === 'STORE';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarButton: getTabButton(route.name),
      })}
    >
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon color={color} size={focused ? 25 : 24} />
          ),
        }}
      />

      {isStoreUser ? (
        <Tab.Screen
          name='Suppliers'
          component={FeaturePlaceholderScreen}
          options={{ tabBarIcon: ({ color }) => <TruckIcon color={color} /> }}
        />
      ) : (
        <Tab.Screen
          name='Orders'
          component={FeaturePlaceholderScreen}
          options={{ tabBarIcon: ({ color }) => <ShirtIcon color={color} /> }}
        />
      )}

      {isStoreUser ? (
        <Tab.Screen
          name='ProductForm'
          component={FeaturePlaceholderScreen}
          options={{
            tabBarIcon: () => <PlusIcon color='#FFFFFF' size={28} />,
          }}
        />
      ) : (
        <Tab.Screen
          name='Bag'
          component={FeaturePlaceholderScreen}
          options={{
            tabBarIcon: () => <BagIcon color='#FFFFFF' />,
          }}
        />
      )}

      <Tab.Screen
        name='Notifications'
        component={FeaturePlaceholderScreen}
        options={{ tabBarIcon: ({ color }) => <BellIcon color={color} /> }}
      />

      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <UserAvatar focused={focused} user={user} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    height: 72,
    borderTopWidth: 0,
    borderRadius: 24,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarIcon: {
    marginTop: 2,
  },
  centerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
