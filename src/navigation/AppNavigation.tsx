import { NavigationContainer } from '@react-navigation/native';

import { useAuthStore } from '../stores/auth.store';
import { navigationRef } from './navigationRef';

import { AppRoutes } from './AppRoutes';
import { AuthRoutes } from './AuthRoutes';

export function AppNavigator() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const isHydrated = useAuthStore(state => state.isHydrated);

  if (!isHydrated) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
