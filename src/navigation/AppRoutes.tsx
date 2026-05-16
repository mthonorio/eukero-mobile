import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DetailsScreen } from '../screens/DetailsScreen';
import { TabRoutes } from '../components/BottomNavbar';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={TabRoutes}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}
