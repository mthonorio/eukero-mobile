export type ShippingCostRequest = {
  SellerCEP: string;
  RecipientCEP: string;
  ShipmentInvoiceValue: number;
  ShippingServiceCode?: string | null;
  ShippingItemArray: Array<{
    Height: number;
    Length: number;
    Quantity: number;
    Weight: number;
    Width: number;
    SKU: string;
    Category: string;
  }>;
  RecipientCountry: string;
};

export type ShippingCostResponse = {
  PAC: ShippingCarrierResponse;
};

export type ShippingCarrierResponse = {
  AllowBuyLabel: boolean;
  Carrier: string;
  CarrierCode: string;
  DeliveryBranchOfficeCarrierId: number;
  DeliveryTime: number;
  Error: boolean;
  Msg: string;
  OriginalDeliveryTime: number;
  OriginalShippingPrice: number;
  PresentationalPrice: number;
  ProtectionValue: number;
  ResponseTime: number;
  ServiceCode: string;
  ServiceDescription: string;
  ShippingPrice: number;
};

export interface ShippingInfo {
  type: string;
  date: string;
  price: number;
  estimatedDays?: number;
  carrier?: string;
  serviceDescription?: string;
}

export interface CheckoutProduct {
  id: string;
  name: string;
  salePrice: number;
  promotionalPrice: number;
  quantity: number;
  image?: string;
  seller: string;
  storeUsername?: string;
  sku?: string;
  category?: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  shipping: ShippingInfo;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  zipCode: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface PaymentMethod {
  type: 'credit' | 'debit' | 'pix' | 'boleto';
  installments?: number;
}

export interface CreditCard {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

export interface CheckoutOrder {
  products: CheckoutProduct[];
  delivery: DeliveryAddress;
  payment: PaymentMethod;
  card?: CreditCard;
  cpf: string;
  total: number;
  subtotal: number;
  shipping: number;
  discount?: number;
}

export interface CheckoutState {
  step: 'delivery' | 'payment' | 'review' | 'confirmation';
  loading: boolean;
  error?: string;
}

export interface CheckoutFormData {
  paymentMethod: 'pix';
  fulfillment: 'DELIVERY' | 'PICKUP';
  selectedAddressId?: string;
}

export interface AddressFormData extends DeliveryAddress {
  phone: string;
}

// Tipos para APIs de pagamento
export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  orderId?: string;
  paymentUrl?: string; // Para PIX ou Boleto
  error?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  carrier: string;
}

export interface CouponCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minValue?: number;
  valid: boolean;
}
