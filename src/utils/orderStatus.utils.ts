import type { ApiOrderStatus } from '../types/orders.type';

export const ORDER_STATUS_TABS: { key: ApiOrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'AP', label: 'Aguard. pagamento' },
  { key: 'PC', label: 'Preparando' },
  { key: 'EN', label: 'Enviado' },
  { key: 'EC', label: 'Finalizado' },
  { key: 'SD', label: 'Devolução' },
  { key: 'CA', label: 'Cancelado' },
];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  AP: 'Aguardando pagamento',
  PC: 'Preparando',
  EN: 'Enviado',
  EC: 'Finalizado',
  SD: 'Devolução solicitada',
  CA: 'Cancelado',
  DE: 'Devolvido',
};

export const ORDER_STATUS_COLORS: Record<
  string,
  { text: string; background: string }
> = {
  AP: { text: '#B54708', background: 'rgba(181, 71, 8, 0.10)' },
  PC: { text: '#175CD3', background: 'rgba(23, 92, 211, 0.10)' },
  EN: { text: '#B93815', background: 'rgba(185, 56, 21, 0.10)' },
  EC: { text: '#027A48', background: 'rgba(2, 122, 72, 0.10)' },
  SD: { text: '#B42318', background: 'rgba(180, 35, 24, 0.10)' },
  CA: { text: '#B42318', background: 'rgba(180, 35, 24, 0.10)' },
  DE: { text: '#B42318', background: 'rgba(180, 35, 24, 0.10)' },
};

export function getOrderStatusLabel(status: string) {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function getOrderStatusColor(status: string) {
  return (
    ORDER_STATUS_COLORS[status] ?? {
      text: '#667085',
      background: '#F3F4F6',
    }
  );
}
