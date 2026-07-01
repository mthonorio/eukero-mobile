import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  CreditCard,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react-native';

import { RootStackParamList } from '../../../navigation/types';
import { formatPrice } from '../../../utils/formatter.utils';
import type {
  DashboardData,
  TimeFilter,
} from '../../../types/dashboard.type';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
  primarySoft: 'rgba(15, 122, 79, 0.10)',
  accent: '#F97316',
  danger: '#F04438',
};

const TIME_FILTERS: TimeFilter[] = ['Week', 'Month', 'Quarter', 'Year'];

// TODO: integrar endpoint real de métricas quando existir no backend.
function buildMockDashboardData(): DashboardData {
  return {
    metrics: {
      totalRevenue: 18420,
      revenueChange: 12.4,
      newOrders: 46,
      ordersChange: 8.1,
      totaltoPay: 2350,
      toPayChange: -4.2,
      totalToReceive: 6120,
      toReceiveChange: 5.6,
    },
    revenueOverview: {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      datasets: [
        { label: 'Receita', data: [3200, 4100, 3800, 5300] },
        { label: 'Lucro', data: [1200, 1600, 1400, 2100] },
      ],
    },
    salesByCategory: {
      labels: ['Masculino', 'Feminino', 'Unissex', 'Infantil', 'Outros'],
      datasets: [
        {
          data: [32, 38, 12, 10, 8],
          backgroundColor: [
            '#0F7A4F',
            '#F97316',
            '#175CD3',
            '#B54708',
            '#667085',
          ],
          borderWidth: 0,
        },
      ],
    },
    topProducts: [
      { name: 'Vestido floral', price: 189.9, sales: 24, trend: 12 },
      { name: 'Jaqueta jeans', price: 249.9, sales: 18, trend: 6 },
      { name: 'Tênis retrô', price: 329.9, sales: 15, trend: -3 },
      { name: 'Bolsa transversal', price: 159.9, sales: 12, trend: 4 },
    ],
    recentActivities: [
      {
        type: 'order',
        description: 'Novo pedido recebido',
        details: '#8f21ac',
        time: 'há 12 min',
      },
      {
        type: 'payment',
        description: 'Pagamento liberado',
        details: 'R$ 189,90',
        time: 'há 1 h',
      },
      {
        type: 'customer',
        description: 'Novo seguidor',
        details: '@ana.silva',
        time: 'há 3 h',
      },
      {
        type: 'review',
        description: 'Nova avaliação recebida',
        details: '5 estrelas',
        time: 'há 5 h',
      },
    ],
  };
}

export function DashboardScreen({ navigation }: Props) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Month');
  const data = useMemo(() => buildMockDashboardData(), []);

  const maxRevenue = Math.max(...data.revenueOverview.datasets[0].data);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>

        <View>
          <Text style={styles.heroEyebrow}>Dashboard</Text>
          <Text style={styles.title}>Visão geral da sua loja.</Text>
        </View>
      </View>

      <View style={styles.tabsRow}>
        {TIME_FILTERS.map(filter => (
          <Pressable
            key={filter}
            style={[styles.tab, timeFilter === filter && styles.tabActive]}
            onPress={() => setTimeFilter(filter)}
          >
            <Text
              style={[
                styles.tabText,
                timeFilter === filter && styles.tabTextActive,
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: colors.primarySoft }]}>
            <Wallet color={colors.primary} size={18} />
          </View>
          <Text style={styles.metricLabel}>Receita total</Text>
          <Text style={styles.metricValue}>
            {formatPrice(data.metrics.totalRevenue)}
          </Text>
          <ChangeBadge value={data.metrics.revenueChange} />
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: 'rgba(23, 92, 211, 0.10)' }]}>
            <ShoppingCart color='#175CD3' size={18} />
          </View>
          <Text style={styles.metricLabel}>Pedidos novos</Text>
          <Text style={styles.metricValue}>{data.metrics.newOrders}</Text>
          <ChangeBadge value={data.metrics.ordersChange} />
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: 'rgba(249, 115, 22, 0.10)' }]}>
            <CreditCard color={colors.accent} size={18} />
          </View>
          <Text style={styles.metricLabel}>A pagar</Text>
          <Text style={styles.metricValue}>
            {formatPrice(data.metrics.totaltoPay)}
          </Text>
          <ChangeBadge value={data.metrics.toPayChange} />
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: colors.primarySoft }]}>
            <TrendingUp color={colors.primary} size={18} />
          </View>
          <Text style={styles.metricLabel}>A receber</Text>
          <Text style={styles.metricValue}>
            {formatPrice(data.metrics.totalToReceive)}
          </Text>
          <ChangeBadge value={data.metrics.toReceiveChange} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Receita ao longo do tempo</Text>
        <View style={styles.barsRow}>
          {data.revenueOverview.labels.map((label, index) => {
            const value = data.revenueOverview.datasets[0].data[index];
            const heightPct = Math.max(8, (value / maxRevenue) * 100);

            return (
              <View key={label} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${heightPct}%` }]} />
                </View>
                <Text style={styles.barLabel}>{label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Vendas por categoria</Text>
        {data.salesByCategory.labels.map((label, index) => {
          const value = data.salesByCategory.datasets[0].data[index];
          const color = data.salesByCategory.datasets[0].backgroundColor[index];

          return (
            <View key={label} style={styles.categoryRow}>
              <View style={styles.categoryLabelRow}>
                <View style={[styles.categoryDot, { backgroundColor: color }]} />
                <Text style={styles.categoryLabel}>{label}</Text>
              </View>
              <View style={styles.categoryTrack}>
                <View
                  style={[
                    styles.categoryFill,
                    { width: `${value}%`, backgroundColor: color },
                  ]}
                />
              </View>
              <Text style={styles.categoryValue}>{value}%</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Produtos mais vendidos</Text>
        {data.topProducts.map(product => (
          <View key={product.name} style={styles.productRow}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productMeta}>
                {formatPrice(product.price)} · {product.sales} vendas
              </Text>
            </View>
            <View style={styles.trendRow}>
              {product.trend >= 0 ? (
                <TrendingUp color={colors.primary} size={16} />
              ) : (
                <TrendingDown color={colors.danger} size={16} />
              )}
              <Text
                style={[
                  styles.trendText,
                  product.trend < 0 && styles.trendTextNegative,
                ]}
              >
                {Math.abs(product.trend)}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Atividades recentes</Text>
        {data.recentActivities.map((activity, index) => (
          <View key={index} style={styles.activityRow}>
            <View style={styles.activityDot} />
            <View style={styles.activityInfo}>
              <Text style={styles.activityDescription}>
                {activity.description}
              </Text>
              <Text style={styles.activityDetails}>{activity.details}</Text>
            </View>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function ChangeBadge({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <View style={styles.changeRow}>
      {isPositive ? (
        <TrendingUp color={colors.primary} size={12} />
      ) : (
        <TrendingDown color={colors.danger} size={12} />
      )}
      <Text
        style={[
          styles.changeText,
          !isPositive && styles.changeTextNegative,
        ]}
      >
        {Math.abs(value)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 48, gap: 12 },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: { fontSize: 18, lineHeight: 24, fontWeight: '800', color: colors.text },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: {
    flex: 1,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 12, fontWeight: '700', color: colors.muted },
  tabTextActive: { color: '#FFFFFF' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: {
    flexBasis: '48%',
    flexGrow: 1,
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: { fontSize: 12, color: colors.muted, fontWeight: '700' },
  metricValue: { fontSize: 17, fontWeight: '800', color: colors.text },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  changeText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  changeTextNegative: { color: colors.danger },
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    gap: 12,
  },
  barColumn: { flex: 1, alignItems: 'center', gap: 6, height: '100%' },
  barTrack: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    backgroundColor: colors.surfaceSoft,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', backgroundColor: colors.primary, borderRadius: 10 },
  barLabel: { fontSize: 11, color: colors.muted, fontWeight: '600' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  categoryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 90,
  },
  categoryDot: { width: 8, height: 8, borderRadius: 4 },
  categoryLabel: { fontSize: 12, color: colors.text, fontWeight: '600' },
  categoryTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceSoft,
    overflow: 'hidden',
  },
  categoryFill: { height: '100%', borderRadius: 4 },
  categoryValue: { fontSize: 12, fontWeight: '700', color: colors.text, width: 34 },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  productInfo: { flex: 1, gap: 2 },
  productName: { fontSize: 13, fontWeight: '700', color: colors.text },
  productMeta: { fontSize: 12, color: colors.muted },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trendText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  trendTextNegative: { color: colors.danger },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  activityInfo: { flex: 1 },
  activityDescription: { fontSize: 13, fontWeight: '700', color: colors.text },
  activityDetails: { fontSize: 12, color: colors.muted },
  activityTime: { fontSize: 11, color: colors.muted },
});
