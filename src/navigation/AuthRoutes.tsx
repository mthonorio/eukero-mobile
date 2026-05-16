import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

/** Authentication routes for the app. (Non-authenticated) */
export function AuthRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
