import { Image, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

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
};

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
};

export function OrderDetailsContent({ order, mode }: Props) {
  const { t } = useTranslation();
  const counterpart = mode === 'orders' ? order.store : order.buyer;
  const statusColor = getOrderStatusColor(order.status);

  const subtotal = order.items.reduce(
    (total, item) => total + Number(item.totalValue),
    0,
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View
          style={[styles.statusBadge, { backgroundColor: statusColor.background }]}
        >
          <Text style={[styles.statusText, { color: statusColor.text }]}>
            {getOrderStatusLabel(t, order.status)}
          </Text>
        </View>

        <Text style={styles.orderId}>
          {t('OrderDetailsContent.orderIdLabel', { id: order.orderId })}
        </Text>
        <Text style={styles.date}>
          {new Date(order.createdAt).toLocaleString('pt-BR')}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          {mode === 'orders'
            ? t('OrderDetailsContent.storeSectionTitle')
            : t('OrderDetailsContent.buyerSectionTitle')}
        </Text>
        <View style={styles.counterpartRow}>
          <Avatar uri={counterpart?.photo} size={44} />
          <View>
            <Text style={styles.counterpartName}>{counterpart?.name}</Text>
            <Text style={styles.counterpartUsername}>
              @{counterpart?.username}
            </Text>
          </View>
        </View>

        <Text style={styles.fulfillmentLabel}>
          {order.fulfillment === 'PICKUP'
            ? t('OrderDetailsContent.fulfillmentPickup')
            : t('OrderDetailsContent.fulfillmentDelivery')}
        </Text>

        {order.deliveryAddress ? (
          <Text style={styles.addressText}>
            {order.deliveryAddress.address}, {order.deliveryAddress.number} -{' '}
            {order.deliveryAddress.city}/{order.deliveryAddress.state}
          </Text>
        ) : null}

        {order.deliveryValidationCode ? (
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>
              {t('OrderDetailsContent.validationCodeLabel')}
            </Text>
            <Text style={styles.codeValue}>
              {order.deliveryValidationCode}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          {t('OrderDetailsContent.productsSectionTitle')}
        </Text>

        {order.items.map(item => (
          <View key={item.id} style={styles.productRow}>
            {item.product.images?.[0]?.url ? (
              <Image
                source={{ uri: item.product.images[0].url }}
                style={styles.productImage}
              />
            ) : (
              <View style={styles.productImagePlaceholder} />
            )}

            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.product.name}
              </Text>
              <Text style={styles.productQuantity}>
                {t('OrderDetailsContent.quantityLabel', { quantity: item.quantity })}
              </Text>
            </View>

            <Text style={styles.productValue}>
              {formatPrice(Number(item.totalValue))}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            {t('OrderDetailsContent.subtotalLabel')}
          </Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            {t('OrderDetailsContent.shippingLabel')}
          </Text>
          <Text style={styles.summaryValue}>
            {formatPrice(Number(order.shippingValue))}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotalRow]}>
          <Text style={styles.summaryTotalLabel}>
            {t('OrderDetailsContent.totalLabel')}
          </Text>
          <Text style={styles.summaryTotalValue}>
            {formatPrice(Number(order.totalValue))}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { fontSize: 12, fontWeight: '800' },
  orderId: { fontSize: 16, fontWeight: '800', color: colors.text },
  date: { fontSize: 13, color: colors.muted },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  counterpartRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterpartName: { fontSize: 15, fontWeight: '700', color: colors.text },
  counterpartUsername: { fontSize: 13, color: colors.muted },
  fulfillmentLabel: { fontSize: 13, fontWeight: '700', color: colors.primary },
  addressText: { fontSize: 13, color: colors.muted, lineHeight: 18 },
  codeBox: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    gap: 4,
  },
  codeLabel: { fontSize: 12, color: colors.muted },
  codeValue: { fontSize: 18, fontWeight: '800', color: colors.text, letterSpacing: 2 },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  productImage: { width: 48, height: 48, borderRadius: 12 },
  productImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
  },
  productInfo: { flex: 1, gap: 2 },
  productName: { fontSize: 13, fontWeight: '700', color: colors.text },
  productQuantity: { fontSize: 12, color: colors.muted },
  productValue: { fontSize: 14, fontWeight: '800', color: colors.text },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: { fontSize: 13, color: colors.muted },
  summaryValue: { fontSize: 13, fontWeight: '700', color: colors.text },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 4,
  },
  summaryTotalLabel: { fontSize: 15, fontWeight: '800', color: colors.text },
  summaryTotalValue: { fontSize: 18, fontWeight: '800', color: colors.primary },
});
