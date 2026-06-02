import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  ChevronRight,
  Grid2x2,
  Rows2,
  Search,
  Star,
} from 'lucide-react-native';

import { ProductFeedCard } from '../../components/ProductFeedCard';
import ProductService from '../../services/product.service';
import { RootStackParamList, RootTabParamList } from '../../navigation/types';
import { useCheckoutStore } from '../../stores/checkout.store';
import type { Product } from '../../types/product.type';

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

type FeedTab = 'all' | 'following';

type FeaturedStore = {
  name: string;
  username: string;
  imageUrl?: string;
};

type PaginatedProductsResponse = {
  items: Product[];
  count: number;
};

const PAGE_SIZE = 20;

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
  accentSoft: 'rgba(249, 115, 22, 0.10)',
};

function isRenderableProduct(product: Product) {
  return Boolean(
    product &&
      ((product.images && product.images.length > 0) ||
        (product.videoUrl && product.videoUrl.trim() !== '')),
  );
}

export function HomeScreen({ navigation }: Props) {
  const selectProduct = useCheckoutStore(state => state.selectProduct);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FeedTab>('all');
  const [columnCount, setColumnCount] = useState<1 | 2>(2);

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
    queryKey: ['home-products', activeTab],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
      const response =
        activeTab === 'all'
          ? await ProductService.fetchExplorerProductsPaginated({
              page: pageParam,
              limit: PAGE_SIZE,
            })
          : await ProductService.fetchFollowingProductsPaginated({
              page: pageParam,
              limit: PAGE_SIZE,
            });

      return response as PaginatedProductsResponse;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.max(
        1,
        Math.ceil(lastPage.count / PAGE_SIZE),
      );
      const nextPage = allPages.length + 1;

      return nextPage <= totalPages ? nextPage : undefined;
    },
  });

  const products = useMemo(
    () =>
      data?.pages.flatMap(page => page.items.filter(isRenderableProduct)) ?? [],
    [data],
  );

  const errorMessage = error
    ? 'Não foi possível carregar os produtos agora.'
    : null;

  const featuredStores = useMemo(() => {
    const storesMap = new Map<string, FeaturedStore>();

    products.forEach(product => {
      if (!product.storeName || storesMap.has(product.storeName)) {
        return;
      }

      storesMap.set(product.storeName, {
        name: product.storeName,
        username: product.storeUsername,
        imageUrl: product.storeImageUrl,
      });
    });

    return Array.from(storesMap.values()).slice(0, 6);
  }, [products]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter(product => {
      const searchableText = [
        product.name,
        product.description,
        product.storeName,
        product.category,
        product.department,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [products, query]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const loadMoreProducts = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const header = (
    <View style={styles.headerContainer}>
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Descubra agora</Text>
        <Text style={styles.heroTitle}>
          Feed com itens em destaque para o mobile.
        </Text>
        <Text style={styles.heroDescription}>
          Explore novidades, acompanhe lojas e encontre produtos com uma
          navegação pensada para a tela pequena.
        </Text>
      </View>

      <View style={styles.searchCard}>
        <View style={styles.searchInputWrap}>
          <Search color={colors.muted} size={18} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder='Pesquisar produtos ou lojas'
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            returnKeyType='search'
          />
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeadingRow}>
          <View>
            <Text style={styles.sectionTitle}>Lojas em destaque</Text>
            <Text style={styles.sectionSubtitle}>
              Atalhos para os perfis mais recentes do feed.
            </Text>
          </View>
          <Star color={colors.accent} size={18} fill={colors.accent} />
        </View>

        <FlatList
          data={featuredStores}
          keyExtractor={item => item.username}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storesList}
          renderItem={({ item }) => (
            <Pressable
              style={styles.storeChip}
              onPress={() =>
                navigation.navigate('Store', {
                  storeUsername: item.username,
                  storeName: item.name,
                  storeImageUrl: item.imageUrl,
                })
              }
            >
              <View style={styles.storeAvatar}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.storeAvatarImage}
                  />
                ) : (
                  <Text style={styles.storeAvatarFallback}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <Text style={styles.storeChipText} numberOfLines={2}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <View style={styles.toggleRow}>
        <Pressable
          onPress={() => setActiveTab('all')}
          style={[
            styles.toggleChip,
            activeTab === 'all' && styles.toggleChipActive,
          ]}
        >
          <Text
            style={[
              styles.toggleChipText,
              activeTab === 'all' && styles.toggleChipTextActive,
            ]}
          >
            Explorar
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('following')}
          style={[
            styles.toggleChip,
            activeTab === 'following' && styles.toggleChipActive,
          ]}
        >
          <Text
            style={[
              styles.toggleChipText,
              activeTab === 'following' && styles.toggleChipTextActive,
            ]}
          >
            Seguindo
          </Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionTitle}>Produtos</Text>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => setColumnCount(count => (count === 2 ? 1 : 2))}
            style={styles.layoutToggleButton}
          >
            {columnCount === 2 ? (
              <Rows2 color={colors.text} />
            ) : (
              <Grid2x2 color={colors.text} />
            )}
          </Pressable>

          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{visibleProducts.length}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      key={String(columnCount)}
      data={visibleProducts}
      keyExtractor={item => item.uid || item.id}
      numColumns={columnCount}
      columnWrapperStyle={columnCount > 1 ? styles.gridRow : undefined}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={header}
      onEndReachedThreshold={0.4}
      onEndReached={loadMoreProducts}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      renderItem={({ item }) => (
        <View style={styles.gridItem}>
          <ProductFeedCard
            product={item}
            onPress={() => navigation.navigate('Details', { product: item })}
            onCheckoutPress={async () => {
              await selectProduct(item);
              navigation.navigate('Checkout');
            }}
          />
        </View>
      )}
      ListEmptyComponent={
        isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Carregando produtos...</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {errorMessage || 'Nenhum produto encontrado.'}
            </Text>
            <Text style={styles.emptyDescription}>
              Ajuste a busca ou troque a aba para ver outros itens.
            </Text>
          </View>
        )
      }
      ListFooterComponent={
        hasNextPage && visibleProducts.length > 0 ? (
          <View style={styles.footerLoading}>
            {isFetchingNextPage ? (
              <ActivityIndicator color={colors.primary} />
            ) : null}
            <Text style={styles.footerText}>
              Puxe para atualizar ou role para mais itens
            </Text>
            <ChevronRight color={colors.muted} size={16} />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },
  heroCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: colors.text,
  },
  heroDescription: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  searchCard: {
    padding: 14,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  sectionBlock: {
    gap: 12,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.muted,
  },
  countBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  layoutToggleButton: {
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  layoutToggleButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  storesList: {
    gap: 12,
    paddingRight: 4,
  },
  storeChip: {
    width: 90,
    alignItems: 'center',
    gap: 10,
  },
  storeAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeAvatarImage: {
    width: '100%',
    height: '100%',
  },
  storeAvatarFallback: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  storeChipText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  toggleRow: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  toggleChip: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
  },
  toggleChipTextActive: {
    color: '#FFFFFF',
  },
  gridRow: {
    gap: 12,
  },
  gridColumn: {
    gap: 8,
  },
  gridItem: {
    flex: 1,
    marginTop: 12,
    marginBottom: 36,
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
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLoading: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  footerText: {
    fontSize: 12,
    color: colors.muted,
  },
});
