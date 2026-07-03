import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, SearchIcon } from 'lucide-react-native';

import { Avatar } from '../../components/atoms/Avatar';
import { ProductFeedCard } from '../../components/ProductFeedCard';
import ProductService from '../../services/product.service';
import { UserService, type UserMeResponse } from '../../services/user.service';
import { useCheckoutStore } from '../../stores/checkout.store';
import { RootStackParamList } from '../../navigation/types';
import type { Product } from '../../types/product.type';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

type SearchTab = 'products' | 'stores';

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
};

export function SearchScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const selectProduct = useCheckoutStore(state => state.selectProduct);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('products');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<UserMeResponse[]>([]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setProducts([]);
      setStores([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        if (activeTab === 'products') {
          const results = await ProductService.searchProducts(trimmed);
          setProducts(results);
        } else {
          const results = await UserService.searchStore(trimmed);
          setStores(results);
        }
      } catch {
        setProducts([]);
        setStores([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, activeTab]);

  return (
    <View style={styles.screen}>
      <View style={styles.headerCard}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>

        <View style={styles.searchBox}>
          <SearchIcon color={colors.muted} size={16} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('Search.searchPlaceholder')}
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            autoFocus
          />
        </View>
      </View>

      <View style={styles.tabsRow}>
        <Pressable
          style={[styles.tab, activeTab === 'products' && styles.tabActive]}
          onPress={() => setActiveTab('products')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'products' && styles.tabTextActive,
            ]}
          >
            {t('Search.tabProducts')}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'stores' && styles.tabActive]}
          onPress={() => setActiveTab('stores')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'stores' && styles.tabTextActive,
            ]}
          >
            {t('Search.tabStores')}
          </Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : activeTab === 'products' ? (
        <FlatList
          data={products}
          keyExtractor={item => item.uid || item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.productWrapper}>
              <ProductFeedCard
                product={item}
                onPress={() => navigation.navigate('Details', { product: item })}
                onCheckoutPress={() => selectProduct(item)}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Text style={styles.emptyTitle}>
                {query.trim()
                  ? t('Search.emptyProductsFound')
                  : t('Search.emptyProductsPrompt')}
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={stores}
          keyExtractor={item => item.uid}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.storeRow}
              onPress={() =>
                navigation.navigate('Store', {
                  storeUsername: item.username,
                  storeName: item.name,
                  storeImageUrl: item.photo,
                })
              }
            >
              <Avatar uri={item.photo} size={44} />
              <View style={styles.storeInfo}>
                <Text style={styles.storeName}>{item.name}</Text>
                <Text style={styles.storeUsername}>@{item.username}</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Text style={styles.emptyTitle}>
                {query.trim()
                  ? t('Search.emptyStoresFound')
                  : t('Search.emptyStoresPrompt')}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.muted },
  tabTextActive: { color: '#FFFFFF' },
  listContent: { padding: 16, paddingTop: 4, gap: 10 },
  columnWrapper: { gap: 12 },
  productWrapper: { flex: 1 },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 14, fontWeight: '700', color: colors.text },
  storeUsername: { fontSize: 12, color: colors.muted },
  centerState: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
    textAlign: 'center',
  },
});
