import { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { useCheckoutStore } from '../../stores/checkout.store';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

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

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export function CheckoutScreen({ navigation }: Props) {
  const selectedProduct = useCheckoutStore(state => state.selectedProduct);
  const isHydrated = useCheckoutStore(state => state.isHydrated);
  const hydrate = useCheckoutStore(state => state.hydrate);
  const clearSelection = useCheckoutStore(state => state.clearSelection);

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
    }
  }, [hydrate, isHydrated]);

  const handleContinue = () => {
    navigation.navigate('Details');
  };

  if (!isHydrated) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!selectedProduct) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.title}>Nenhum produto selecionado</Text>
        <Text style={styles.description}>
          Volte ao feed e selecione um item para iniciar o checkout.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Checkout</Text>
        <Text style={styles.title}>Confirme seu item antes de seguir.</Text>
        <Text style={styles.description}>
          O produto escolhido foi salvo no store e no storage para manter o
          fluxo mesmo após navegação.
        </Text>
      </View>

      <View style={styles.productCard}>
        {selectedProduct.image ? (
          <Image
            source={{ uri: selectedProduct.image }}
            style={styles.productImage}
          />
        ) : (
          <View style={styles.productImagePlaceholder} />
        )}

        <View style={styles.productInfo}>
          <Text style={styles.productSeller} numberOfLines={1}>
            {selectedProduct.seller}
          </Text>
          <Text style={styles.productName} numberOfLines={2}>
            {selectedProduct.name}
          </Text>
          <Text style={styles.productPrice}>
            {formatPrice(
              selectedProduct.promotionalPrice > 0 &&
                selectedProduct.promotionalPrice < selectedProduct.salePrice
                ? selectedProduct.promotionalPrice
                : selectedProduct.salePrice,
            )}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continuar para detalhes</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={clearSelection}>
          <Text style={styles.secondaryButtonText}>Remover seleção</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
    gap: 16,
  },
  heroCard: {
    padding: 18,
    borderRadius: 24,
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
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: colors.text,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  productCard: {
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productImage: {
    width: 96,
    height: 96,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
  },
  productImagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  productSeller: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
  },
  productName: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    color: colors.text,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  actions: {
    gap: 12,
    marginTop: 'auto',
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
    gap: 10,
  },
});
