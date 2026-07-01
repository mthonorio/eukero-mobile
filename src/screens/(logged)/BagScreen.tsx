import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CheckSquare,
  Minus,
  Plus,
  ShoppingBag,
  Square,
  Trash2,
} from 'lucide-react-native';

import { Avatar } from '../../components/atoms/Avatar';
import { UserBagService } from '../../services/bag.service';
import { RootStackParamList, RootTabParamList } from '../../navigation/types';
import { useCheckoutStore } from '../../stores/checkout.store';
import { formatPrice } from '../../utils/formatter.utils';
import { getProductImage } from '../../utils/get.utils';
import type { GroupedBagStore } from '../../types/bag.type';
import type { Product } from '../../types/product.type';

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Bag'>,
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
  primarySoft: 'rgba(15, 122, 79, 0.10)',
  danger: '#F04438',
};

function productPrice(product: Product) {
  return product.promotionalPrice && product.promotionalPrice > 0
    ? product.promotionalPrice
    : product.salePrice;
}

export function BagScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const selectProduct = useCheckoutStore(state => state.selectProduct);

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const { data, isLoading, isRefetching, refetch, error } = useQuery({
    queryKey: ['user-bag'],
    queryFn: () => UserBagService.getUserBag(),
  });

  const stores = useMemo(() => data ?? [], [data]);

  const updateQuantityMutation = useMutation({
    mutationFn: ({
      productUid,
      quantity,
    }: {
      productUid: string;
      quantity: number;
    }) => UserBagService.updateBagItemQuantity(productUid, quantity),
    onSuccess: updated => {
      queryClient.setQueryData(['user-bag'], updated);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (productUid: string) =>
      UserBagService.removeItemFromBag(productUid),
    onSuccess: updated => {
      queryClient.setQueryData(['user-bag'], updated);
    },
  });

  const toggleItem = useCallback((uid: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(uid)) {
        next.delete(uid);
      } else {
        next.add(uid);
      }
      return next;
    });
  }, []);

  const toggleStore = useCallback((store: GroupedBagStore) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      const allSelected = store.items.every(item => next.has(item.uid));

      store.items.forEach(item => {
        if (allSelected) {
          next.delete(item.uid);
        } else {
          next.add(item.uid);
        }
      });

      return next;
    });
  }, []);

  const selectedProducts = useMemo(
    () =>
      stores
        .flatMap(store => store.items)
        .filter(item => selectedItems.has(item.uid)),
    [stores, selectedItems],
  );

  const subtotal = useMemo(
    () =>
      selectedProducts.reduce(
        (total, item) => total + productPrice(item) * (item.quantity || 1),
        0,
      ),
    [selectedProducts],
  );

  const handleContinue = useCallback(async () => {
    if (!selectedProducts.length) return;

    await selectProduct(selectedProducts[0]);
    navigation.navigate('Checkout');
  }, [navigation, selectProduct, selectedProducts]);

  const isEmpty = !isLoading && stores.length === 0;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      <View style={styles.headerCard}>
        <Text style={styles.heroEyebrow}>Sacola</Text>
        <Text style={styles.title}>Seus itens selecionados</Text>
        <Text style={styles.description}>
          Selecione os produtos que deseja levar e finalize a compra.
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : isEmpty ? (
        <View style={styles.centerState}>
          <ShoppingBag color={colors.muted} size={32} />
          <Text style={styles.emptyTitle}>Sua sacola está vazia.</Text>
          <Text style={styles.description}>
            Explore o feed e adicione produtos para vê-los aqui.
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.emptyTitle}>
            Não foi possível carregar sua sacola.
          </Text>
        </View>
      ) : (
        stores.map(store => {
          const allSelected =
            store.items.length > 0 &&
            store.items.every(item => selectedItems.has(item.uid));

          return (
            <View key={store.storeId} style={styles.storeCard}>
              <Pressable
                style={styles.storeHeader}
                onPress={() => toggleStore(store)}
              >
                {allSelected ? (
                  <CheckSquare color={colors.primary} size={20} />
                ) : (
                  <Square color={colors.muted} size={20} />
                )}
                <Avatar uri={store.storeImageUrl} size={32} />
                <View style={styles.storeInfo}>
                  <Text style={styles.storeName}>{store.storeName}</Text>
                  <Text style={styles.storeUsername}>
                    @{store.storeUsername}
                  </Text>
                </View>
                <View style={styles.storeBadge}>
                  <Text style={styles.storeBadgeText}>
                    {store.items.length}
                  </Text>
                </View>
              </Pressable>

              {store.items.map(item => (
                <View key={item.uid} style={styles.itemRow}>
                  <Pressable onPress={() => toggleItem(item.uid)}>
                    {selectedItems.has(item.uid) ? (
                      <CheckSquare color={colors.primary} size={18} />
                    ) : (
                      <Square color={colors.muted} size={18} />
                    )}
                  </Pressable>

                  {getProductImage(item) ? (
                    <Image
                      source={{ uri: getProductImage(item) }}
                      style={styles.itemImage}
                    />
                  ) : (
                    <View style={styles.itemImagePlaceholder} />
                  )}

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemPrice}>
                      {formatPrice(productPrice(item))}
                    </Text>

                    <View style={styles.quantityRow}>
                      <Pressable
                        style={styles.quantityButton}
                        onPress={() =>
                          updateQuantityMutation.mutate({
                            productUid: item.uid,
                            quantity: Math.max(1, (item.quantity || 1) - 1),
                          })
                        }
                      >
                        <Minus color={colors.text} size={14} />
                      </Pressable>
                      <Text style={styles.quantityValue}>
                        {item.quantity || 1}
                      </Text>
                      <Pressable
                        style={styles.quantityButton}
                        onPress={() =>
                          updateQuantityMutation.mutate({
                            productUid: item.uid,
                            quantity: (item.quantity || 1) + 1,
                          })
                        }
                      >
                        <Plus color={colors.text} size={14} />
                      </Pressable>
                    </View>
                  </View>

                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeItemMutation.mutate(item.uid)}
                  >
                    <Trash2 color={colors.danger} size={18} />
                  </Pressable>
                </View>
              ))}
            </View>
          );
        })
      )}

      {selectedProducts.length > 0 ? (
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>

          <Pressable style={styles.primaryButton} onPress={handleContinue}>
            <Text style={styles.primaryButtonText}>Finalizar compra</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 48, gap: 16 },
  headerCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
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
  centerState: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  storeCard: {
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: colors.surfaceSoft,
  },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 14, fontWeight: '800', color: colors.text },
  storeUsername: { fontSize: 12, color: colors.muted },
  storeBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  storeBadgeText: { fontSize: 12, fontWeight: '800', color: colors.primary },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  itemImage: { width: 56, height: 56, borderRadius: 14 },
  itemImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
  },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 14, fontWeight: '700', color: colors.text },
  itemPrice: { fontSize: 14, fontWeight: '800', color: colors.primary },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  quantityButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityValue: { fontSize: 13, fontWeight: '700', color: colors.text },
  removeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: { fontSize: 14, color: colors.muted, fontWeight: '600' },
  summaryValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
