import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Header from '../components/atoms/Header';
import { CheckoutScreen } from '../screens/(logged)/CheckoutScreen';
import { CheckoutCompletedScreen } from '../screens/(logged)/CheckoutCompletedScreen';
import { DetailsScreen } from '../screens/(logged)/DetailsScreen';
import { MyProductsScreen } from '../screens/(logged)/(products)/MyProducts';
import { ProfileCollectionScreen } from '../screens/(logged)/(profile)/ProfileCollectionScreen';
import { ProfileFeatureScreen } from '../screens/(logged)/(profile)/ProfileFeatureScreen';
import { ProfileSettingsScreen } from '../screens/(logged)/(profile)/ProfileSettingsScreen';
import { SettingsScreen } from '../screens/(logged)/(profile)/SettingsScreen';
import { AddressesScreen } from '../screens/(logged)/(profile)/AddressesScreen';
import { LanguageScreen } from '../screens/(logged)/(profile)/LanguageScreen';
import { TermsScreen } from '../screens/(logged)/(profile)/TermsScreen';
import { ConnectScreen } from '../screens/(logged)/(profile)/ConnectScreen';
import { GlobalVariablesScreen } from '../screens/(logged)/(profile)/GlobalVariablesScreen';
import { MigrateToStoreScreen } from '../screens/(logged)/(profile)/MigrateToStoreScreen';
import { StoreScreen } from '../screens/(logged)/StoreScreen';
import { OrderDetailsScreen } from '../screens/(logged)/OrderDetailsScreen';
import { SalesScreen } from '../screens/(logged)/(profile)/SalesScreen';
import { SaleDetailsScreen } from '../screens/(logged)/(profile)/SaleDetailsScreen';
import { SupplierFormScreen } from '../screens/(logged)/(suppliers)/SupplierFormScreen';
import { SupplierConsignedScreen } from '../screens/(logged)/(suppliers)/SupplierConsignedScreen';
import { FinancialScreen } from '../screens/(logged)/(profile)/FinancialScreen';
import { FinancialFormScreen } from '../screens/(logged)/(profile)/FinancialFormScreen';
import { DashboardScreen } from '../screens/(logged)/(profile)/DashboardScreen';
import { PiecesScreen } from '../screens/(logged)/(suppliers)/PiecesScreen';
import { StockScreen } from '../screens/(logged)/(profile)/StockScreen';
import { PlansScreen } from '../screens/(logged)/(profile)/PlansScreen';
import { SearchScreen } from '../screens/(logged)/SearchScreen';
import { SupportScreen } from '../screens/(logged)/SupportScreen';
import { LegalDocumentScreen } from '../screens/(logged)/LegalDocumentScreen';
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
        name='CheckoutCompleted'
        component={CheckoutCompletedScreen}
      />
      <Stack.Screen name='MyProducts' component={MyProductsScreen} />
      <Stack.Screen
        name='ProfileCollection'
        component={ProfileCollectionScreen}
      />
      <Stack.Screen name='ProfileFeature' component={ProfileFeatureScreen} />
      <Stack.Screen name='ProfileSettings' component={ProfileSettingsScreen} />
      <Stack.Screen name='Settings' component={SettingsScreen} />
      <Stack.Screen name='Addresses' component={AddressesScreen} />
      <Stack.Screen name='Language' component={LanguageScreen} />
      <Stack.Screen name='Terms' component={TermsScreen} />
      <Stack.Screen name='Connect' component={ConnectScreen} />
      <Stack.Screen name='GlobalVariables' component={GlobalVariablesScreen} />
      <Stack.Screen name='MigrateToStore' component={MigrateToStoreScreen} />
      <Stack.Screen name='OrderDetails' component={OrderDetailsScreen} />
      <Stack.Screen name='Sales' component={SalesScreen} />
      <Stack.Screen name='SaleDetails' component={SaleDetailsScreen} />
      <Stack.Screen name='SupplierForm' component={SupplierFormScreen} />
      <Stack.Screen
        name='SupplierConsigned'
        component={SupplierConsignedScreen}
      />
      <Stack.Screen name='Financial' component={FinancialScreen} />
      <Stack.Screen name='FinancialForm' component={FinancialFormScreen} />
      <Stack.Screen name='Dashboard' component={DashboardScreen} />
      <Stack.Screen name='Pieces' component={PiecesScreen} />
      <Stack.Screen name='Stock' component={StockScreen} />
      <Stack.Screen name='Plans' component={PlansScreen} />
      <Stack.Screen name='Search' component={SearchScreen} />
      <Stack.Screen name='Support' component={SupportScreen} />
      <Stack.Screen name='LegalDocument' component={LegalDocumentScreen} />
    </Stack.Navigator>
  );
}
