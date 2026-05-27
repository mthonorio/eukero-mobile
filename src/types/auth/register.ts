export type RegisterUserType = 'USER' | 'STORE';

export type RegisterAddressFormValues = {
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

export type RegisterPersonFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  userType: 'USER';
  document: string;
  pixKey: string;
};

export type RegisterStoreFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  userType: 'STORE';
  storeName: string;
  document: string;
  address: RegisterAddressFormValues;
  pixKey: string;
};

export type RegisterPersonPayload = Omit<
  RegisterPersonFormValues,
  'confirmPassword'
>;

export type RegisterStorePayload = Omit<
  RegisterStoreFormValues,
  'confirmPassword'
>;
