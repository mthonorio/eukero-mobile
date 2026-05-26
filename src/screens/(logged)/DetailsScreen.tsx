import { useMemo } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, Heart, MapPin, Tag, Truck } from 'lucide-react-native';

import { RootStackParamList } from '../../navigation/types';
import { useCheckoutStore } from '../../stores/checkout.store';

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

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export function DetailsScreen({ navigation, route }: Props) {
  const { product } = route.params;
  const selectProduct = useCheckoutStore(state => state.selectProduct);

  const imageUrl = product.images?.[0]?.url || product.storeImageUrl;
  const hasDiscount =
    product.promotionalPrice > 0 &&
    product.promotionalPrice < product.salePrice;
  const price = hasDiscount ? product.promotionalPrice : product.salePrice;

  const showcaseImages = useMemo(() => {
    const urls = product.images?.map(image => image.url).filter(Boolean) || [];

    if (imageUrl && !urls.includes(imageUrl)) {
      urls.unshift(imageUrl);
    }

    return urls.slice(0, 4);
  }, [imageUrl, product.images]);

  const handleCheckout = async () => {
    await selectProduct(product);
    navigation.navigate('Checkout');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroImageWrap}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.heroImage} />
        ) : (
          <View style={styles.heroPlaceholder} />
        )}

        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>

        <View style={styles.favoriteButton}>
          <Heart color={colors.accent} size={18} fill={colors.accent} />
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.storeRow}>
          <MapPin color={colors.muted} size={14} />
          <Text style={styles.storeText}>{product.storeName}</Text>
        </View>

        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>Preço atual</Text>
            <Text style={styles.priceValue}>{formatPrice(price)}</Text>
          </View>
          {hasDiscount ? (
            <Text style={styles.originalPrice}>
              {formatPrice(product.salePrice)}
            </Text>
          ) : null}
        </View>

        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Tag color={colors.primary} size={14} />
            <Text style={styles.chipText}>{product.category || 'Produto'}</Text>
          </View>
          <View style={styles.chipSoft}>
            <Truck color={colors.muted} size={14} />
            <Text style={styles.chipSoftText}>
              {product.inStock ? 'Em estoque' : 'Sob consulta'}
            </Text>
          </View>
        </View>

        <Pressable style={styles.primaryButton} onPress={handleCheckout}>
          <Text style={styles.primaryButtonText}>EUKERO</Text>
        </Pressable>
      </View>

      {showcaseImages.length > 0 ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Galeria</Text>
          <View style={styles.galleryRow}>
            {showcaseImages.map(url => (
              <Image
                key={url}
                source={{ uri: url }}
                style={styles.galleryImage}
              />
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  heroImageWrap: {
    position: 'relative',
    height: 420,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSoft,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  heroCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeText: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  priceLabel: {
    fontSize: 11,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.primarySoft,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  chipSoft: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.surfaceSoft,
  },
  chipSoftText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
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
    letterSpacing: 0.4,
  },
  sectionCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  galleryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  galleryImage: {
    width: 92,
    height: 92,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
  },
});
