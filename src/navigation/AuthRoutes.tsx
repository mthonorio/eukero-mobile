import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ForgetPasswordScreen } from '../screens/(auth)/ForgetPasswordScreen';
import { ActivateAccountScreen } from '../screens/(auth)/ActivateAccountScreen';
import { LoginScreen } from '../screens/(auth)/LoginScreen';
import RegisterScreen from '../screens/(register)/RegisterScreen';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** Authentication routes for the app. (Non-authenticated) */
export function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='ForgetPassword' component={ForgetPasswordScreen} />
      <Stack.Screen name='ActivateAccount' component={ActivateAccountScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
    </Stack.Navigator>
  );
}
