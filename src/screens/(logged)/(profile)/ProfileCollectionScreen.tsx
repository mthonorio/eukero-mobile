import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { ChevronLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { ProductFeedCard } from '../../../components/ProductFeedCard';
import ProductService from '../../../services/product.service';
import { RootStackParamList } from '../../../navigation/types';
import { useCheckoutStore } from '../../../stores/checkout.store';
import type { Product } from '../../../types/product.type';

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
  primarySoft: 'rgba(15, 122, 79, 0.10)',
};

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileCollection'>;

function isRenderableProduct(product: Product) {
  return Boolean(
    product &&
      ((product.images && product.images.length > 0) ||
        (product.videoUrl && product.videoUrl.trim() !== '')),
  );
}

export function ProfileCollectionScreen({ navigation, route }: Props) {
  const { title, source } = route.params;
  const { t } = useTranslation();
  const selectProduct = useCheckoutStore(state => state.selectProduct);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);

      const response =
        source === 'liked'
          ? await ProductService.getProductLikes()
          : await ProductService.fetchMyProducts({ page: 1, limit: 100 });

      if (!response || (Array.isArray(response) && response.length === 0)) {
        setProducts([]);
        setError(t('ProfileCollection.errorEmpty'));
        return;
      }

      if (
        source === 'liked' &&
        Array.isArray(response) &&
        response.length > 0
      ) {
        const validProducts = response.filter(isRenderableProduct);
        if (validProducts.length === 0) {
          setProducts([]);
          setError(t('ProfileCollection.errorEmpty'));
          return;
        }
        return setProducts(validProducts);
      }
      setProducts(response);
      setError(null);
    } catch (loadError) {
      console.error('Erro ao carregar coleção de produtos:', loadError);
      setError(t('ProfileCollection.errorLoad'));
      setProducts([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [source, t]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>
              {source === 'liked'
                ? t('ProfileCollection.descriptionLiked')
                : t('ProfileCollection.descriptionMine')}
            </Text>
          </View>
        </View>
      </View>
    ),
    [navigation, source, title, t],
  );

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.uid || item.id}
      numColumns={2}
      columnWrapperStyle={styles.gridRow}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={header}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            loadProducts();
          }}
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
            <Text style={styles.loadingText}>{t('ProfileCollection.loading')}</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {error || t('ProfileCollection.emptyDefault')}
            </Text>
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
    gap: 16,
  },
  headerCard: {
    display: 'flex',
    flexDirection: 'row',
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
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
  gridRow: {
    gap: 12,
    paddingHorizontal: 16,
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
});
