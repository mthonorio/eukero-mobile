export interface ICreditCard {
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string;
  expirationYear: string;
  cvv: string;
  cpf?: string;
  installments?: string;
}

export interface IChooicePlan {
  key: 'standard' | 'pro' | 'premium';
  period: 'monthly' | 'yearly';
}

export type PaymentCardErrors = Partial<Record<keyof ICreditCard, string>>;

export interface PaymentMethodPayload {
  printedCardname: string;
  cardNumber: string;
  expirationDate: string;
  cardVerificationValue: string;
  cardDocument: string;
  primary: boolean;
}

export type CreatePaymentMethodPayload = PaymentMethodPayload;

export type UpdatePaymentMethodPayload = PaymentMethodPayload;

export interface PaymentMethod extends PaymentMethodPayload {
  id: string;
  brandCard?: string;
  createdAt?: string;
  updatedAt?: string;
}
