import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronLeft,
  Plus,
  Wallet,
} from 'lucide-react-native';

import { FinancialService } from '../../../services/financial.service';
import { RootStackParamList } from '../../../navigation/types';
import { formatPrice } from '../../../utils/formatter.utils';
import type { MovementType } from '../../../types/financial.type';

type Props = NativeStackScreenProps<RootStackParamList, 'Financial'>;

const PAGE_SIZE = 10;

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
};

export function FinancialScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [typeFilter, setTypeFilter] = useState<MovementType | 'all'>('all');

  const STATUS_LABELS: Record<string, string> = {
    A: t('Financial.statusLabels.A'),
    T: t('Financial.statusLabels.T'),
    L: t('Financial.statusLabels.L'),
    S: t('Financial.statusLabels.S'),
    Q: t('Financial.statusLabels.Q'),
  };

  const TYPE_FILTERS: { key: MovementType | 'all'; label: string }[] = [
    { key: 'all', label: t('Financial.typeFilters.all') },
    { key: 'CR', label: t('Financial.typeFilters.receivable') },
    { key: 'CP', label: t('Financial.typeFilters.payable') },
  ];

  const { data: headers } = useQuery({
    queryKey: ['financial-headers', typeFilter],
    queryFn: () =>
      FinancialService.getHeadersFinancialMovements(
        undefined,
        undefined,
        undefined,
        typeFilter === 'all' ? undefined : typeFilter,
      ),
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['financial-movements', typeFilter],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      FinancialService.getFinancialMovements(
        pageParam,
        PAGE_SIZE,
        undefined,
        undefined,
        undefined,
        typeFilter === 'all' ? undefined : typeFilter,
      ),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.max(1, Math.ceil(lastPage.count / PAGE_SIZE));
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
  });

  const movements = useMemo(
    () =>
      data?.pages.flatMap(page =>
        page.items.flatMap(group =>
          group.movements.map(movement => ({
            ...movement,
            orderId: group.orderId,
          })),
        ),
      ) ?? [],
    [data],
  );

  const header = (
    <View style={styles.headerBlock}>
      <View style={styles.headerCard}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>

        <View style={styles.headerTitleBlock}>
          <Text style={styles.heroEyebrow}>{t('Financial.heroEyebrow')}</Text>
          <Text style={styles.title}>{t('Financial.title')}</Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate('FinancialForm', {})}
        >
          <Plus color='#FFFFFF' size={18} />
        </Pressable>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t('Financial.metrics.open')}</Text>
          <Text style={styles.metricValue}>
            {formatPrice(headers?.aberto ?? 0)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t('Financial.metrics.inTransit')}</Text>
          <Text style={styles.metricValue}>
            {formatPrice(headers?.transito ?? 0)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t('Financial.metrics.paymentRequested')}</Text>
          <Text style={styles.metricValue}>
            {formatPrice(headers?.agendado ?? 0)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t('Financial.metrics.paid')}</Text>
          <Text style={styles.metricValue}>
            {formatPrice(headers?.quitado ?? 0)}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        {TYPE_FILTERS.map(filter => (
          <Pressable
            key={filter.key}
            style={[
              styles.tab,
              typeFilter === filter.key && styles.tabActive,
            ]}
            onPress={() => setTypeFilter(filter.key)}
          >
            <Text
              style={[
                styles.tabText,
                typeFilter === filter.key && styles.tabTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <FlatList
      style={styles.screen}
      data={movements}
      keyExtractor={(item, index) => `${item.orderId}-${item.productId}-${index}`}
      contentContainerStyle={styles.content}
      ListHeaderComponent={header}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.45}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footerLoading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null
      }
      renderItem={({ item }) => (
        <View style={styles.movementCard}>
          {item.type === 'CR' ? (
            <ArrowDownCircle color={colors.primary} size={22} />
          ) : (
            <ArrowUpCircle color={colors.accent} size={22} />
          )}

          <View style={styles.movementInfo}>
            <Text style={styles.movementName} numberOfLines={1}>
              {item.type === 'CR' ? item.payerName : item.recipientName}
            </Text>
            <Text style={styles.movementDate}>
              {t('Financial.movementDate', {
                date: new Date(item.emissionDate).toLocaleDateString('pt-BR'),
                orderId: item.orderId.slice(0, 8),
              })}
            </Text>
          </View>

          <View style={styles.movementRight}>
            <Text
              style={[
                styles.movementValue,
                item.type === 'CP' && styles.movementValueNegative,
              ]}
            >
              {item.type === 'CP' ? '-' : '+'}
              {formatPrice(Number(item.value))}
            </Text>
            <Text style={styles.movementStatus}>
              {STATUS_LABELS[item.status] ?? item.status}
            </Text>
          </View>
        </View>
      )}
      ListEmptyComponent={
        isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <View style={styles.centerState}>
            <Wallet color={colors.muted} size={32} />
            <Text style={styles.emptyTitle}>
              {error
                ? t('Financial.emptyError')
                : t('Financial.emptyTitle')}
            </Text>
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 48, gap: 10 },
  headerBlock: { gap: 12, marginBottom: 4 },
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
  headerTitleBlock: { flex: 1 },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: { fontSize: 16, lineHeight: 22, fontWeight: '800', color: colors.text },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
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
  metricLabel: { fontSize: 12, color: colors.muted, fontWeight: '700' },
  metricValue: { fontSize: 16, fontWeight: '800', color: colors.text },
  tabsRow: { gap: 8, paddingHorizontal: 2 },
  tab: {
    height: 36,
    paddingHorizontal: 14,
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
  movementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  movementInfo: { flex: 1, gap: 2 },
  movementName: { fontSize: 13, fontWeight: '700', color: colors.text },
  movementDate: { fontSize: 11, color: colors.muted },
  movementRight: { alignItems: 'flex-end' },
  movementValue: { fontSize: 14, fontWeight: '800', color: colors.primary },
  movementValueNegative: { color: colors.accent },
  movementStatus: { fontSize: 11, color: colors.muted },
  footerLoading: { paddingVertical: 18, alignItems: 'center' },
  centerState: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
});
