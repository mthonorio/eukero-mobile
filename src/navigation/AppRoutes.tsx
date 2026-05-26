import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Header from '../components/Header';
import { CheckoutScreen } from '../screens/(logged)/CheckoutScreen';
import { DetailsScreen } from '../screens/(logged)/DetailsScreen';
import { ProfileCollectionScreen } from '../screens/(logged)/(profile)/ProfileCollectionScreen';
import { ProfileFeatureScreen } from '../screens/(logged)/(profile)/ProfileFeatureScreen';
import { ProfileSettingsScreen } from '../screens/(logged)/(profile)/ProfileSettingsScreen';
import { StoreScreen } from '../screens/(logged)/StoreScreen';
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
      <Stack.Screen name='Store' component={StoreScreen} />
      <Stack.Screen name='Checkout' component={CheckoutScreen} />
      <Stack.Screen
        name='ProfileCollection'
        component={ProfileCollectionScreen}
      />
      <Stack.Screen name='ProfileFeature' component={ProfileFeatureScreen} />
      <Stack.Screen name='ProfileSettings' component={ProfileSettingsScreen} />
    </Stack.Navigator>
  );
}
