import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ForgetPasswordScreen } from '../screens/(auth)/ForgetPasswordScreen';
import { LoginScreen } from '../screens/(auth)/LoginScreen';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** Authentication routes for the app. (Non-authenticated) */
export function AuthRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='ForgetPassword' component={ForgetPasswordScreen} />
    </Stack.Navigator>
  );
}
