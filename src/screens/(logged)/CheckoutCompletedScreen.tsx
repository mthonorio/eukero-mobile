import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckCircle2, X } from 'lucide-react-native';

import { ProductFeedCard } from '../../components/ProductFeedCard';
import { useCheckoutStore } from '../../stores/checkout.store';
import ProductService from '../../services/product.service';
import { RootStackParamList } from '../../navigation/types';
import type { Product } from '../../types/product.type';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckoutCompleted'>;

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

export function CheckoutCompletedScreen({ navigation, route }: Props) {
  const { orderId } = route.params ?? {};
  const selectProduct = useCheckoutStore(state => state.selectProduct);
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    ProductService.fetchExplorerProductsPaginated({ page: 1, limit: 10 })
      .then(response => setRecommended(response.items))
      .catch(() => setRecommended([]));
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable
        style={styles.closeButton}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
      >
        <X color={colors.text} size={20} />
      </Pressable>

      <View style={styles.successCard}>
        <CheckCircle2 color={colors.primary} size={48} />
        <Text style={styles.title}>Agradecemos a sua compra!</Text>
        <Text style={styles.description}>
          {orderId
            ? `Seu pedido #${orderId.slice(0, 8)} foi registrado com sucesso.`
            : 'Seu pedido foi registrado com sucesso.'}
        </Text>

        {orderId ? (
          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate('OrderDetails', { orderId })
            }
          >
            <Text style={styles.primaryButtonText}>Ver pedido</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Onde encontrar seu pedido</Text>
        <Text style={styles.infoDescription}>
          Você pode acompanhar o status da sua compra a qualquer momento.
        </Text>
        <Text style={styles.infoStep}>1. Acesse o Menu do aplicativo.</Text>
        <Text style={styles.infoStep}>2. Toque em "Minhas compras".</Text>
        <Text style={styles.infoStep}>
          3. Encontre seu pedido na lista de status.
        </Text>
      </View>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
      >
        <Text style={styles.secondaryButtonText}>Continuar comprando</Text>
      </Pressable>

      {recommended.length > 0 ? (
        <View style={styles.recommendedSection}>
          <Text style={styles.recommendedTitle}>Você também pode gostar</Text>
          <FlatList
            data={recommended}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.uid || item.id}
            contentContainerStyle={styles.recommendedList}
            renderItem={({ item }) => (
              <View style={styles.recommendedItem}>
                <ProductFeedCard
                  product={item}
                  onPress={() => navigation.navigate('Details', { product: item })}
                  onCheckoutPress={() => selectProduct(item)}
                />
              </View>
            )}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 48, gap: 16 },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  successCard: {
    padding: 24,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 8,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  infoCard: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  infoTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  infoDescription: { fontSize: 13, color: colors.muted, lineHeight: 18 },
  infoStep: { fontSize: 13, color: colors.text, marginTop: 4 },
  secondaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '700', color: colors.text },
  recommendedSection: { gap: 12 },
  recommendedTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  recommendedList: { gap: 12 },
  recommendedItem: { width: 170 },
});
