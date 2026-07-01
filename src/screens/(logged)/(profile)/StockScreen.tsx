import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft, Plus, X } from 'lucide-react-native';

import ProductService from '../../../services/product.service';
import { RootStackParamList } from '../../../navigation/types';
import type { Product } from '../../../types/product.type';
import type {
  StockMovement,
  StockMovementOrigin,
  StockMovementType,
} from '../../../types/stock.type';

type Props = NativeStackScreenProps<RootStackParamList, 'Stock'>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
  accent: '#F97316',
};

const ORIGIN_OPTIONS: StockMovementOrigin[] = [
  'COMPRA',
  'VENDA',
  'AJUSTE',
  'DEVOLUCAO',
  'PERDA',
  'TRANSFERENCIA',
];

// TODO: integrar endpoint real de estoque quando existir no backend.
function buildMockMovements(products: Product[]): StockMovement[] {
  return products.slice(0, 8).map((product, index) => ({
    id: `${product.uid || product.id}-${index}`,
    productId: product.uid || product.id,
    productName: product.name,
    productImage: product.images?.[0]?.url,
    type: index % 3 === 0 ? 'SAIDA' : 'ENTRADA',
    origin: index % 3 === 0 ? 'VENDA' : 'COMPRA',
    quantity: (index % 4) + 1,
    balanceAfter: product.quantity ?? 0,
    date: new Date(Date.now() - index * 86400000).toISOString(),
  }));
}

export function StockScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<StockMovementType | 'all'>(
    'all',
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null,
  );
  const [movementType, setMovementType] = useState<StockMovementType>(
    'ENTRADA',
  );
  const [origin, setOrigin] = useState<StockMovementOrigin>('COMPRA');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { items } = await ProductService.fetchMyProducts({
          page: 1,
          limit: 100,
        });
        setProducts(items);
        setMovements(buildMockMovements(items));
      } catch {
        setProducts([]);
        setMovements([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filteredMovements = useMemo(
    () =>
      typeFilter === 'all'
        ? movements
        : movements.filter(item => item.type === typeFilter),
    [movements, typeFilter],
  );

  function handleAddMovement() {
    if (!selectedProduct) return;

    const newMovement: StockMovement = {
      id: `manual-${Date.now()}`,
      productId: selectedProduct.uid || selectedProduct.id,
      productName: selectedProduct.name,
      productImage: selectedProduct.images?.[0]?.url,
      type: movementType,
      origin,
      quantity: Number(quantity) || 1,
      balanceAfter:
        (selectedProduct.quantity ?? 0) +
        (movementType === 'ENTRADA' ? Number(quantity) : -Number(quantity)),
      date: new Date().toISOString(),
      notes,
    };

    setMovements(prev => [newMovement, ...prev]);
    setIsModalOpen(false);
    setSelectedProduct(null);
    setQuantity('1');
    setNotes('');
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ChevronLeft color={colors.text} size={22} />
          </Pressable>

          <View style={styles.headerTitleBlock}>
            <Text style={styles.heroEyebrow}>Estoque</Text>
            <Text style={styles.title}>Movimentações de produtos.</Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() => setIsModalOpen(true)}
          >
            <Plus color='#FFFFFF' size={18} />
          </Pressable>
        </View>

        <View style={styles.tabsRow}>
          {(['all', 'ENTRADA', 'SAIDA'] as const).map(filter => (
            <Pressable
              key={filter}
              style={[styles.tab, typeFilter === filter && styles.tabActive]}
              onPress={() => setTypeFilter(filter)}
            >
              <Text
                style={[
                  styles.tabText,
                  typeFilter === filter && styles.tabTextActive,
                ]}
              >
                {filter === 'all' ? 'Todos' : filter === 'ENTRADA' ? 'Entradas' : 'Saídas'}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : filteredMovements.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={styles.emptyTitle}>
              Nenhuma movimentação encontrada.
            </Text>
          </View>
        ) : (
          filteredMovements.map(movement => (
            <View key={movement.id} style={styles.movementCard}>
              {movement.type === 'ENTRADA' ? (
                <ArrowDownCircle color={colors.primary} size={22} />
              ) : (
                <ArrowUpCircle color={colors.accent} size={22} />
              )}

              <View style={styles.movementInfo}>
                <Text style={styles.movementName} numberOfLines={1}>
                  {movement.productName}
                </Text>
                <Text style={styles.movementMeta}>
                  {movement.origin} ·{' '}
                  {new Date(movement.date).toLocaleDateString('pt-BR')}
                </Text>
              </View>

              <View style={styles.movementRight}>
                <Text
                  style={[
                    styles.movementQuantity,
                    movement.type === 'SAIDA' && styles.movementQuantityNegative,
                  ]}
                >
                  {movement.type === 'ENTRADA' ? '+' : '-'}
                  {movement.quantity}
                </Text>
                <Text style={styles.movementBalance}>
                  Saldo: {movement.balanceAfter}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={isModalOpen}
        transparent
        animationType='fade'
        onRequestClose={() => setIsModalOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsModalOpen(false)}
        >
          <Pressable style={styles.modalCard} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova movimentação</Text>
              <Pressable onPress={() => setIsModalOpen(false)}>
                <X color={colors.text} size={20} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.label}>Produto</Text>
              <ScrollView style={styles.productList}>
                {products.map(product => {
                  const isSelected =
                    selectedProduct?.id === product.id ||
                    selectedProduct?.uid === product.uid;
                  return (
                    <Pressable
                      key={product.uid || product.id}
                      style={[
                        styles.productOption,
                        isSelected && styles.productOptionSelected,
                      ]}
                      onPress={() => setSelectedProduct(product)}
                    >
                      <Text style={styles.productOptionText} numberOfLines={1}>
                        {product.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <Text style={[styles.label, styles.spacedLabel]}>Tipo</Text>
              <View style={styles.optionsRow}>
                {(['ENTRADA', 'SAIDA'] as StockMovementType[]).map(option => (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionButton,
                      movementType === option && styles.optionButtonActive,
                    ]}
                    onPress={() => setMovementType(option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        movementType === option && styles.optionTextActive,
                      ]}
                    >
                      {option === 'ENTRADA' ? 'Entrada' : 'Saída'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.label, styles.spacedLabel]}>Origem</Text>
              <View style={styles.optionsWrap}>
                {ORIGIN_OPTIONS.map(option => (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionButton,
                      origin === option && styles.optionButtonActive,
                    ]}
                    onPress={() => setOrigin(option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        origin === option && styles.optionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.label, styles.spacedLabel]}>Quantidade</Text>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                keyboardType='numeric'
                style={styles.textInput}
              />

              <Text style={[styles.label, styles.spacedLabel]}>
                Notas (opcional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                style={styles.textInput}
                multiline
              />

              <Pressable style={styles.primaryButton} onPress={handleAddMovement}>
                <Text style={styles.primaryButtonText}>
                  Registrar movimentação
                </Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 48, gap: 10 },
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
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: {
    flex: 1,
    height: 36,
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
  centerState: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
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
  movementMeta: { fontSize: 11, color: colors.muted },
  movementRight: { alignItems: 'flex-end' },
  movementQuantity: { fontSize: 14, fontWeight: '800', color: colors.primary },
  movementQuantityNegative: { color: colors.accent },
  movementBalance: { fontSize: 11, color: colors.muted },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(16, 24, 40, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '85%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  modalScroll: { gap: 8 },
  label: { fontSize: 13, fontWeight: '700', color: colors.text },
  spacedLabel: { marginTop: 12 },
  productList: { maxHeight: 160, marginTop: 6 },
  productOption: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    marginBottom: 6,
  },
  productOptionSelected: { backgroundColor: colors.primary },
  productOptionText: { fontSize: 13, fontWeight: '600', color: colors.text },
  optionsRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  optionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  optionButton: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { fontSize: 12, fontWeight: '700', color: colors.muted },
  optionTextActive: { color: '#FFFFFF' },
  textInput: {
    marginTop: 6,
    minHeight: 46,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
    color: colors.text,
  },
  primaryButton: {
    marginTop: 16,
    marginBottom: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
