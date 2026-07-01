export type StockMovementType = 'ENTRADA' | 'SAIDA';

export type StockMovementOrigin =
  | 'COMPRA'
  | 'VENDA'
  | 'AJUSTE'
  | 'DEVOLUCAO'
  | 'PERDA'
  | 'TRANSFERENCIA';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  type: StockMovementType;
  origin: StockMovementOrigin;
  quantity: number;
  balanceAfter: number;
  date: string;
  notes?: string;
}
