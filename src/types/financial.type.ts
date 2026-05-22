export type MovementType = 'CR' | 'CP';

export enum EnumMovementType {
  CREDIT_RECEIVE = 'CR',
  CREDIT_PAY = 'CP',
}

export type MovementStatus = 'A' | 'T' | 'L' | 'S' | 'Q';

export enum EnumMovementStatus {
  OPEN = 'A', // Aberto
  IN_TRANSIT = 'T', // Transito
  RELEASED = 'L', // Liberado
  PAYMENT_REQUESTED = 'S', // Solicitado Pagamento
  SETTLED = 'Q', // Quitado
}

export interface FinancialMovement {
  type: MovementType;
  salesOrderId: string;
  productId: string;
  account: string;
  payer: string;
  payerName: string;
  recipient: string;
  recipientName: string;
  installment: string | number;
  emissionDate: string;
  expirationDate: string | null;
  value: string;
  status: MovementStatus;
  note?: string;
  paymentMethod?: string;
  bankReference?: string;
  creationDate: string;
  updateDate: string;
  isManual?: boolean;
}

export interface FinancialMetrics {
  totalRevenue: number;
  revenueChange: number;
  pendingReceive: number;
  pendingReceiveChange: number;
  pendingPayments: number;
  pendingPaymentsChange: number;
  netProfit: number;
  netProfitChange: number;
  availableBalance: number;
  availableBalanceChange: number;
  totalRevenueChange?: number;
}

export interface FinancialData {
  metrics: FinancialMetrics;
  movements: FinancialMovement[];
}

export interface FinancialMovementGroup {
  orderId: string;
  paymentMethod: string;
  movements: FinancialMovement[];
}

export interface FinancialMovementsResponse {
  items: FinancialMovementGroup[];
  count: number;
}
