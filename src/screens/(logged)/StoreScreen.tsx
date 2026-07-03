import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { ProductFeedCard } from '../../components/ProductFeedCard';
import { RootStackParamList } from '../../navigation/types';
import { useCheckoutStore } from '../../stores/checkout.store';
import type { Product } from '../../types/product.type';
import { StoreService } from '../../services/store.service';

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

type Props = NativeStackScreenProps<RootStackParamList, 'Store'>;

export function StoreScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { storeUsername, storeName, storeImageUrl } = route.params;
  const selectProduct = useCheckoutStore(state => state.selectProduct);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStoreProducts() {
      try {
        setIsLoading(true);

        const allProducts = await StoreService.getStoreById(storeUsername);
        const storeProducts = allProducts.products.filter(
          (product: any) => product.storeUsername === storeUsername,
        );

        if (isMounted) {
          setProducts(storeProducts);
          setError(null);
        }
      } catch (loadError) {
        console.error('Erro ao carregar produtos da loja:', loadError);
        if (isMounted) {
          setError(t('Store.loadError'));
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStoreProducts();

    return () => {
      isMounted = false;
    };
  }, [storeUsername, t]);

  const header = useMemo(
    () => (
      <View style={styles.headerBlock}>
        <View style={styles.coverCard}>
          <View style={styles.storeHero}>
            <View style={styles.storeAvatarWrap}>
              {storeImageUrl ? (
                <Image
                  source={{ uri: storeImageUrl }}
                  style={styles.storeAvatar}
                />
              ) : (
                <View style={styles.storeAvatarFallback}>
                  <Text style={styles.storeAvatarLetter}>
                    {storeName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.storeHeroText}>
              <Text style={styles.storeName}>{storeName}</Text>
              <View style={styles.storeHandleRow}>
                <MapPin color={colors.muted} size={13} />
                <Text style={styles.storeHandle}>@{storeUsername}</Text>
              </View>
              <Text style={styles.storeDescription}>
                {t('Store.description')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>{t('Store.sectionTitle')}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{products.length}</Text>
          </View>
        </View>
      </View>
    ),
    [products.length, storeImageUrl, storeName, storeUsername, t],
  );

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.uid || item.id}
      numColumns={2}
      columnWrapperStyle={styles.gridRow}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={header}
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
            <Text style={styles.loadingText}>{t('Store.loadingText')}</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {error || t('Store.emptyTitle')}
            </Text>
            <Text style={styles.emptyDescription}>
              {t('Store.emptyDescription')}
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
  coverCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  storeHero: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  storeAvatarWrap: {
    width: 84,
    height: 84,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  storeAvatar: {
    width: '100%',
    height: '100%',
  },
  storeAvatarFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  storeAvatarLetter: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  storeHeroText: {
    flex: 1,
    gap: 6,
  },
  storeName: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: colors.text,
  },
  storeHandleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storeHandle: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '600',
  },
  storeDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
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
  emptyDescription: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
