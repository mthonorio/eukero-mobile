import { ICreditCard } from './payments.type';

export type IRegisterUserForm = {
  username?: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  userType: string;
  document: string;
};

export type IAddress = {
  id?: string;
  uid?: string;
  name?: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood?: string;
  city: string;
  state: string;
};

export type IRegisterStoreForm = {
  storeName: string;
  document: string;
  address: IAddress;
} & IRegisterUserForm;

export type IConvertUserToStoreForm = {
  storeName: string;
  pixKey: string;
  address: IAddress;
};

export type IStep2Form = {
  nomeCompleto: string;
  nomeUsuario: string;
  celular: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  termos: boolean;
};

export enum IRegisterTypeUser {
  USER = 'user',
  MARKET = 'market',
}

export enum Plan {
  STANDARD = 'standard',
  PRO = 'pro',
  PREMIUM = 'premium',
}

export type IMarketInfo = {
  email: string;
  nome_usuario: string;
  nome_loja: string;
  telefone: string;
  celular: string;
  cnpj: string;
  address: IAddress;
};

export type IStep3Form = {
  userUid?: string;
  storeName: string;
  cpfCnpj: string;
  address: IAddress;
};

export interface IStep4Form extends ICreditCard {
  plan: Plan;
}
