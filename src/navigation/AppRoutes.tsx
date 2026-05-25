import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Header from '../components/Header';
import { DetailsScreen } from '../screens/DetailsScreen';
import { TabRoutes } from '../components/BottomNavbar';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: props => <Header {...props} />,
      }}
    >
      <Stack.Screen name='MainTabs' component={TabRoutes} />

      <Stack.Screen name='Details' component={DetailsScreen} />
    </Stack.Navigator>
  );
}
