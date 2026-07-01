import { NavigatorScreenParams } from '@react-navigation/native';

import type { Product } from '../types/product.type';

export type StoreRouteParams = {
  storeUsername: string;
  storeName: string;
  storeImageUrl?: string;
};

export type ProductDetailsRouteParams = {
  product: Product;
};

export type ProfileCollectionRouteParams = {
  title: string;
  source: 'liked' | 'mine';
};

export type ProfileFeatureRouteParams = {
  title: string;
  description: string;
};

export type OrderDetailsRouteParams = {
  orderId: string;
};

export type SaleDetailsRouteParams = {
  saleId: string;
};

export type SupplierFormRouteParams = {
  supplierId?: string;
};

export type FinancialFormRouteParams = {
  movementId?: string;
};

export type CheckoutCompletedRouteParams = {
  orderId?: string;
};

export type LegalDocumentRouteParams = {
  type: 'terms' | 'policy' | 'return';
};

export type RootTabParamList = {
  Home: undefined;
  Suppliers: undefined;
  Orders: undefined;
  ProductForm:
    | undefined
    | {
        mode?: 'create' | 'edit';
        productId?: string;
      };
  Bag: undefined;
  Notifications: undefined;
  Profile: undefined;
  Menu: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>;
  Details: ProductDetailsRouteParams;
  Store: StoreRouteParams;
  Checkout: undefined;
  CheckoutCompleted: CheckoutCompletedRouteParams;
  ProfileCollection: ProfileCollectionRouteParams;
  ProfileFeature: ProfileFeatureRouteParams;
  ProfileSettings: undefined;
  Settings: undefined;
  Addresses: undefined;
  Language: undefined;
  Terms: undefined;
  Connect: undefined;
  GlobalVariables: undefined;
  MigrateToStore: undefined;
  MyProducts: undefined;
  OrderDetails: OrderDetailsRouteParams;
  Sales: undefined;
  SaleDetails: SaleDetailsRouteParams;
  SupplierForm: SupplierFormRouteParams;
  SupplierConsigned: undefined;
  Financial: undefined;
  FinancialForm: FinancialFormRouteParams;
  Dashboard: undefined;
  Pieces: undefined;
  Stock: undefined;
  Plans: undefined;
  Search: undefined;
  Support: undefined;
  LegalDocument: LegalDocumentRouteParams;
};

export type AuthStackParamList = {
  Login: undefined;
  ForgetPassword: undefined;
  Register: undefined;
  ActivateAccount: {
    email?: string;
  };
};

export type AppNavigatorParamList = RootStackParamList & AuthStackParamList;
