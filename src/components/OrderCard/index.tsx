import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react-native';

import { Avatar } from '../atoms/Avatar';
import { formatPrice } from '../../utils/formatter.utils';
import {
  getOrderStatusColor,
  getOrderStatusLabel,
} from '../../utils/orderStatus.utils';
import type { ApiOrder } from '../../types/orders.type';

type Props = {
  order: ApiOrder;
  mode: 'orders' | 'sales';
  onPress: () => void;
};

const colors = {
  surface: '#FFFFFF',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
};

export function OrderCard({ order, mode, onPress }: Props) {
  const { t } = useTranslation();
  const counterpart = mode === 'orders' ? order.store : order.buyer;
  const statusColor = getOrderStatusColor(order.status);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Avatar uri={counterpart?.photo} size={36} />

        <View style={styles.headerInfo}>
          <Text style={styles.storeName} numberOfLines={1}>
            {counterpart?.name ?? t('OrderCard.defaultUserName')}
          </Text>
          <Text style={styles.storeUsername} numberOfLines={1}>
            @{counterpart?.username}
          </Text>
        </View>

        <View
          style={[styles.statusBadge, { backgroundColor: statusColor.background }]}
        >
          <Text style={[styles.statusText, { color: statusColor.text }]}>
            {getOrderStatusLabel(t, order.status)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.orderId} numberOfLines={1}>
            {t('OrderCard.orderIdLabel', { id: order.orderId.slice(0, 8) })}
          </Text>
          <Text style={styles.date}>
            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
          </Text>
        </View>

        <View style={styles.footerRight}>
          <Text style={styles.total}>{formatPrice(Number(order.totalValue))}</Text>
          <ChevronRight color={colors.muted} size={18} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerInfo: { flex: 1 },
  storeName: { fontSize: 14, fontWeight: '800', color: colors.text },
  storeUsername: { fontSize: 12, color: colors.muted },
  statusBadge: {
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { fontSize: 11, fontWeight: '800' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  orderId: { fontSize: 13, fontWeight: '700', color: colors.text },
  date: { fontSize: 12, color: colors.muted, marginTop: 2 },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  total: { fontSize: 15, fontWeight: '800', color: colors.text },
});
