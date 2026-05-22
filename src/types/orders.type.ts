export type OrderStatus =
  | 'all'
  | 'withdrawal'
  | 'pending'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refund';

export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  status: OrderStatus;
}

export interface OrderStore {
  storeName: string;
  storeId: string;
  status: OrderStatus;
  products: OrderProduct[];
  createdAt: string;
  updatedAt: string;
  orderId?: string;
  total: number;
  shipping?: {
    type: string;
    date: string;
    price: number;
  };
}

export interface Order {
  id: string;
  storeGroups: OrderStore[];
  totalPrice: number;
  status: ApiOrderStatus | string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// AGUARDANDO_PAGAMENTO = 'AP'
// PAGAMENTO_CONFIRMADO = 'PC'
// ENVIADO = 'EN'
// ENTREGA_CONFIRMADA = 'EC'
// SOLICITADO_DEVOLUCAO = 'SD'
// CANCELADO = 'CA'
// DEVOLVIDO = 'DE'

export type ApiOrderStatus = 'AP' | 'PC' | 'EN' | 'EC' | 'SD' | 'CA' | 'DE';

export type FulfillmentType = 'DELIVERY' | 'PICKUP';

export interface DeliveryAddress {
  cep: string;
  address: string;
  number?: string | null;
  complement?: string;
  neighborhood?: string | null;
  city: string;
  state: string;
}

export interface ApiOrderItemProduct {
  id: string;
  name: string;
  description?: string;
  salePrice: string;
  promotionalPrice: string;
  imageUrl?: string;
  videoUrl?: string;
  category?: string;
  inStock: boolean;
  quantity: number;
  length?: string;
  height?: string;
  width?: string;
  weight?: string;
  likes: number;
  status: string;
  quality: number;
  images?: Array<{
    id: string;
    url: string;
  }>;
}

export interface ApiOrderItem {
  id: string;
  quantity: number;
  discountValue: string;
  totalValue: string;
  unitValue: string;
  product: ApiOrderItemProduct;
}

export interface ApiOrderStore {
  uid: string;
  name: string;
  username: string;
  photo: string;
  phone: string | null;
  email: string | null;
  cpfCnpj: string;
  address: string;
  cep: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface ApiOrder {
  orderId: string;
  status: ApiOrderStatus | string;
  items: ApiOrderItem[];
  shippingValue: string;
  totalValue: string;
  createdAt: string;
  fulfillment: FulfillmentType;
  aditionalFulfillmentInfo?: string;
  payedAt?: string | null;
  sentAt?: string | null;
  completeAt?: string | null;
  pixCopyAndPaste?: string | null;
  store: ApiOrderStore;
  buyer?: ApiOrderStore;
  deliveryAddress?: DeliveryAddress | null;
  deliveryValidationCode?: string | null;
  returnedAt: string | null;
  returnedSellerInfo: string | null;
  returnedBuyerInfo: string | null;
}

export interface ApiOrdersResponse {
  items: ApiOrder[];
  count: number;
}

export type OrderCardMode = 'sales' | 'orders';
