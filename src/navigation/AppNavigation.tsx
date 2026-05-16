import { NavigationContainer } from '@react-navigation/native';

import { AppRoutes } from './AppRoutes';
import { AuthRoutes } from './AuthRoutes';
import { useAuthStore } from '../stores/auth.store';

export function AppNavigator() {
  const user = useAuthStore(state => state.user);

  return (
    <NavigationContainer>
      {user ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
