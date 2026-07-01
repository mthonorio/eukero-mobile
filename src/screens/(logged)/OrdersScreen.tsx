import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { PackageSearch, Search } from 'lucide-react-native';

import { OrderCard } from '../../components/OrderCard';
import { OrderService } from '../../services/order.service';
import { RootStackParamList, RootTabParamList } from '../../navigation/types';
import { ORDER_STATUS_TABS } from '../../utils/orderStatus.utils';
import type { ApiOrderStatus } from '../../types/orders.type';

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Orders'>,
  NativeStackScreenProps<RootStackParamList>
>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
};

export function OrdersScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<ApiOrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const { data, isLoading, isRefetching, refetch, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => OrderService.getOrders(),
  });

  const orders = useMemo(() => {
    const items = data?.items ?? [];

    return items.filter(order => {
      const matchesStatus = activeTab === 'all' || order.status === activeTab;

      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch = normalizedSearch
        ? [order.store?.name, order.store?.username]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch)
        : true;

      return matchesStatus && matchesSearch;
    });
  }, [data, activeTab, search]);

  const header = (
    <View style={styles.headerBlock}>
      <View style={styles.headerCard}>
        <Text style={styles.heroEyebrow}>Minhas compras</Text>
        <Text style={styles.title}>Acompanhe seus pedidos.</Text>

        <View style={styles.searchBox}>
          <Search color={colors.muted} size={16} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder='Buscar por loja'
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        {ORDER_STATUS_TABS.map(tab => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <FlatList
      style={styles.screen}
      data={orders}
      keyExtractor={item => item.orderId}
      contentContainerStyle={styles.content}
      ListHeaderComponent={header}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <OrderCard
            order={item}
            mode='orders'
            onPress={() =>
              navigation.navigate('OrderDetails', { orderId: item.orderId })
            }
          />
        </View>
      )}
      ListEmptyComponent={
        isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <View style={styles.centerState}>
            <PackageSearch color={colors.muted} size={32} />
            <Text style={styles.emptyTitle}>
              {error
                ? 'Não foi possível carregar seus pedidos.'
                : 'Você ainda não fez nenhuma compra.'}
            </Text>
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 48, gap: 12 },
  headerBlock: { gap: 12, marginBottom: 4 },
  headerCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: { fontSize: 20, lineHeight: 26, fontWeight: '800', color: colors.text },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
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
  cardWrapper: { marginBottom: 4 },
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
