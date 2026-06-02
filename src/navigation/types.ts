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

export type RootTabParamList = {
  Home: undefined;
  Suppliers: undefined;
  Orders: undefined;
  ProductForm: undefined;
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
  ProfileCollection: ProfileCollectionRouteParams;
  ProfileFeature: ProfileFeatureRouteParams;
  ProfileSettings: undefined;
  MyProducts: undefined;
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
