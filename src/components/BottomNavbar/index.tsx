import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../../screens/HomeScreen';
import { ProfileScreen } from '../../screens/ProfileScreen';
import { RootTabParamList } from '../../navigation/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
