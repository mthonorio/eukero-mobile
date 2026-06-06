import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronLeft, PackageSearch } from 'lucide-react-native';

import { MyProductCard } from '../../../components/MyProductCard';
import ProductService from '../../../services/product.service';
import { RootStackParamList } from '../../../navigation/types';
import type { Product } from '../../../types/product.type';

type Props = NativeStackScreenProps<RootStackParamList, 'MyProducts'>;

type PaginatedProductsResponse = {
  items: Product[];
  count: number;
};

const PAGE_SIZE = 12;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
};

function isRenderableProduct(product: Product) {
  return Boolean(product && product.name);
}

export function MyProductsScreen({ navigation }: Props) {
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
    queryKey: ['my-products'],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
      const response = (await ProductService.fetchMyProducts({
        page: pageParam,
        limit: PAGE_SIZE,
      })) as PaginatedProductsResponse;

      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.max(1, Math.ceil(lastPage.count / PAGE_SIZE));
      const nextPage = allPages.length + 1;

      return nextPage <= totalPages ? nextPage : undefined;
    },
  });

  const products = useMemo(
    () =>
      data?.pages.flatMap(page => page.items.filter(isRenderableProduct)) ?? [],
    [data],
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const header = useMemo(
    () => (
      <View style={styles.headerBlock}>
        <View style={styles.headerCard}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ChevronLeft color={colors.text} size={22} />
          </Pressable>

          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>Meus produtos</Text>
            <Text style={styles.title}>Gerencie seus produtos no mobile.</Text>
            <Text style={styles.description}>
              A lista usa carregamento progressivo com Tanstack Query e exibe
              cada item através do MyProductCard.
            </Text>
          </View>

          <View style={styles.heroBadge}>
            <PackageSearch color={colors.primary} size={18} />
            <Text style={styles.heroBadgeText}>{products.length} itens</Text>
          </View>
        </View>
      </View>
    ),
    [navigation, products.length],
  );

  const emptyTitle = error
    ? 'Não foi possível carregar os seus produtos.'
    : 'Você ainda não cadastrou produtos.';

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.uid || item.id}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={header}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footerLoading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.45}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <MyProductCard
            product={item}
            onPress={() => navigation.navigate('Details', { product: item })}
            onEditPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'ProductForm',
                params: {
                  mode: 'edit',
                  productId: item.id,
                },
              })
            }
          />
        </View>
      )}
      ListEmptyComponent={
        isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
    backgroundColor: colors.background,
  },
  headerBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerCard: {
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
  heroContent: {
    gap: 8,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: colors.text,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.surfaceSoft,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  cardWrapper: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  footerLoading: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingState: {
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.muted,
  },
  emptyState: {
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
});
