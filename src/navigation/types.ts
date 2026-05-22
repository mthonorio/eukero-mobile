import { NavigatorScreenParams } from '@react-navigation/native';

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
  Details: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ForgetPassword: undefined;
};
