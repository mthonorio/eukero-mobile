import type { TFunction } from 'i18next';

import type { ApiOrderStatus } from '../types/orders.type';

export function getOrderStatusTabs(
  t: TFunction,
): { key: ApiOrderStatus | 'all'; label: string }[] {
  return [
    { key: 'all', label: t('OrderStatus.tabs.all') },
    { key: 'AP', label: t('OrderStatus.tabs.AP') },
    { key: 'PC', label: t('OrderStatus.tabs.PC') },
    { key: 'EN', label: t('OrderStatus.tabs.EN') },
    { key: 'EC', label: t('OrderStatus.tabs.EC') },
    { key: 'SD', label: t('OrderStatus.tabs.SD') },
    { key: 'CA', label: t('OrderStatus.tabs.CA') },
  ];
}

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

export function getOrderStatusLabel(t: TFunction, status: string) {
  const key = `OrderStatus.labels.${status}`;
  const translated = t(key);
  return translated === key ? status : translated;
}

export function getOrderStatusColor(status: string) {
  return (
    ORDER_STATUS_COLORS[status] ?? {
      text: '#667085',
      background: '#F3F4F6',
    }
  );
}
