import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronRight, Handshake, Plus, Truck } from 'lucide-react-native';

import { Avatar } from '../../../components/atoms/Avatar';
import { SupplierService } from '../../../services/supplier.service';
import { RootStackParamList, RootTabParamList } from '../../../navigation/types';
import type { SupplierMeResponse } from '../../../types/supplier.type';

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Suppliers'>,
  NativeStackScreenProps<RootStackParamList>
>;

const PAGE_SIZE = 20;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
};

export function SuppliersScreen({ navigation }: Props) {
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
    queryKey: ['suppliers'],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }: { pageParam?: number }) =>
      SupplierService.getSuppliers({ page: pageParam, pageSize: PAGE_SIZE }),
    getNextPageParam: (lastPage, allPages) => {
      const items = lastPage.items ?? [];
      if (items.length < PAGE_SIZE) return undefined;
      if (lastPage.count) {
        const totalPages = Math.ceil(lastPage.count / PAGE_SIZE);
        const nextPage = allPages.length + 1;
        return nextPage <= totalPages ? nextPage : undefined;
      }
      return allPages.length + 1;
    },
  });

  const suppliers = useMemo(
    () => data?.pages.flatMap(page => page.items ?? []) ?? [],
    [data],
  );

  const header = (
    <View style={styles.headerCard}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.heroEyebrow}>Fornecedores</Text>
          <Text style={styles.title}>Gerencie seus fornecedores.</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={styles.secondaryActionButton}
            onPress={() => navigation.navigate('SupplierConsigned')}
          >
            <Handshake color={colors.primary} size={18} />
          </Pressable>

          <Pressable
            style={styles.addButton}
            onPress={() => navigation.navigate('SupplierForm', {})}
          >
            <Plus color='#FFFFFF' size={18} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.screen}
      data={suppliers}
      keyExtractor={(item: SupplierMeResponse) => item.id}
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
        <Pressable
          style={styles.card}
          onPress={() =>
            navigation.navigate('SupplierForm', { supplierId: item.userId })
          }
        >
          <Avatar uri={item.userPhoto} size={40} />

          <View style={styles.cardInfo}>
            <Text style={styles.cardName} numberOfLines={1}>
              {item.userName}
            </Text>
            <Text style={styles.cardUsername} numberOfLines={1}>
              @{item.userUsername}
            </Text>
          </View>

          <View style={styles.percentageBadge}>
            <Text style={styles.percentageText}>
              {item.percentageValue ?? 0}%
            </Text>
          </View>

          <ChevronRight color={colors.muted} size={18} />
        </Pressable>
      )}
      ListEmptyComponent={
        isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <View style={styles.centerState}>
            <Truck color={colors.muted} size={32} />
            <Text style={styles.emptyTitle}>
              {error
                ? 'Não foi possível carregar seus fornecedores.'
                : 'Você ainda não cadastrou fornecedores.'}
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
  headerCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
    maxWidth: 220,
  },
  headerActions: { flexDirection: 'row', gap: 8 },
  secondaryActionButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '700', color: colors.text },
  cardUsername: { fontSize: 12, color: colors.muted },
  percentageBadge: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  percentageText: { fontSize: 12, fontWeight: '800', color: colors.text },
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
