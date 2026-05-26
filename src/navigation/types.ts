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

export type RootTabParamList = {
  Home: undefined;
  Suppliers: undefined;
  Orders: undefined;
  ProductForm: undefined;
  Bag: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>;
  Details: ProductDetailsRouteParams;
  Store: StoreRouteParams;
  Checkout: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ForgetPassword: undefined;
};

export type AppNavigatorParamList = RootStackParamList & AuthStackParamList;
