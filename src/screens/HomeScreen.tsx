import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  RefreshControl,
  View,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronRight, Heart, MapPin, Search, Star } from 'lucide-react-native';

import ProductService from '../services/product.service';
import { RootStackParamList, RootTabParamList } from '../navigation/types';
import type { Product } from '../types/product.type';

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

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

function getProductImage(product: Product) {
  return product.images?.[0]?.url || product.storeImageUrl || undefined;
}

function isRenderableProduct(product: Product) {
  return Boolean(
    product &&
      ((product.images && product.images.length > 0) ||
        (product.videoUrl && product.videoUrl.trim() !== '')),
  );
}

function ProductFeedCard({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  const imageUrl = getProductImage(product);
  const hasDiscount =
    product.promotionalPrice > 0 &&
    product.promotionalPrice < product.salePrice;
  const price = hasDiscount ? product.promotionalPrice : product.salePrice;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardImageWrap}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.cardImage}
            resizeMode='cover'
          />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Star color={colors.accent} size={28} fill={colors.accent} />
          </View>
        )}

        <View style={styles.favoriteBadge}>
          <Heart color={colors.accent} size={14} fill={colors.accent} />
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.storeRow}>
          <MapPin color={colors.muted} size={12} />
          <Text style={styles.storeText} numberOfLines={1}>
            {product.storeName}
          </Text>
        </View>

        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        {product.description ? (
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.description}
          </Text>
        ) : null}

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>A partir de</Text>
            <Text style={styles.priceValue}>{formatPrice(price)}</Text>
          </View>

          {hasDiscount ? (
            <Text style={styles.originalPrice}>
              {formatPrice(product.salePrice)}
            </Text>
          ) : null}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.likes} curtidas</Text>
          </View>
          <View style={styles.badgeSoft}>
            <Text style={styles.badgeSoftText}>
              {product.inStock ? 'Em estoque' : 'Sob consulta'}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function HomeScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FeedTab>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        setIsLoading(true);

        const response =
          activeTab === 'all'
            ? await ProductService.fetchExplorerProductsPaginated({
                page,
                limit: PAGE_SIZE,
              })
            : await ProductService.fetchFollowingProductsPaginated({
                page,
                limit: PAGE_SIZE,
              });

        const validProducts = response.items?.filter(isRenderableProduct) || [];
        const calculatedTotalPages = Math.max(
          1,
          Math.ceil((response.count || 0) / PAGE_SIZE),
        );

        setProducts(prev =>
          append ? [...prev, ...validProducts] : validProducts,
        );
        setHasMore(page < calculatedTotalPages);
        setError(null);
      } catch (fetchError) {
        console.error('Erro ao buscar produtos:', fetchError);
        setError('Não foi possível carregar os produtos agora.');
        if (!append) {
          setProducts([]);
        }
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [activeTab],
  );

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    setProducts([]);
    fetchProducts(1, false);
  }, [activeTab, fetchProducts]);

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
    setIsRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    fetchProducts(1, false);
  }, [fetchProducts]);

  const loadMoreProducts = useCallback(() => {
    if (isLoading || !hasMore) {
      return;
    }

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchProducts(nextPage, true);
  }, [currentPage, fetchProducts, hasMore, isLoading]);

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
              onPress={() => navigation.navigate('Details')}
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
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{visibleProducts.length}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={visibleProducts}
      keyExtractor={item => item.uid || item.id}
      numColumns={2}
      columnWrapperStyle={styles.gridRow}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={header}
      onEndReachedThreshold={0.4}
      onEndReached={loadMoreProducts}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      renderItem={({ item }) => (
        <View style={styles.gridItem}>
          <ProductFeedCard
            product={item}
            onPress={() => navigation.navigate('Details')}
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
              {error || 'Nenhum produto encontrado.'}
            </Text>
            <Text style={styles.emptyDescription}>
              Ajuste a busca ou troque a aba para ver outros itens.
            </Text>
          </View>
        )
      }
      ListFooterComponent={
        hasMore && visibleProducts.length > 0 ? (
          <View style={styles.footerLoading}>
            {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
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
    paddingHorizontal: 16,
  },
  gridItem: {
    flex: 1,
    marginTop: 12,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.96,
  },
  cardImageWrap: {
    position: 'relative',
    aspectRatio: 0.92,
    backgroundColor: colors.surfaceSoft,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storeText: {
    flex: 1,
    fontSize: 11,
    color: colors.muted,
    fontWeight: '600',
  },
  productName: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.text,
  },
  productDescription: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  priceLabel: {
    fontSize: 10,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  priceValue: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.muted,
    textDecorationLine: 'line-through',
    marginBottom: 1,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  badgeSoft: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  badgeSoftText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
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
