import { Image, Pressable, StyleSheet, View, Text } from 'react-native';
import { Heart, Star } from 'lucide-react-native';

import { Product } from '../../types/product.type';
import { getProductImage } from '../../utils/get.utils';

const colors = {
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

export function ProductFeedCard({
  product,
  onPress,
  onCheckoutPress,
}: {
  product: Product;
  onPress: () => void;
  onCheckoutPress: () => void;
}) {
  const imageUrl = getProductImage(product);
  const hasDiscount =
    product.promotionalPrice > 0 &&
    product.promotionalPrice < product.salePrice;
  const price = hasDiscount ? product.promotionalPrice : product.salePrice;

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.cardImageWrap,
          pressed && styles.cardPressed,
        ]}
      >
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
      </Pressable>

      <View style={styles.cardBody}>
        <View style={styles.storeRow}>
          <Image
            source={{ uri: product.storeImageUrl }}
            style={styles.storeAvatar}
          />
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

        <Pressable style={styles.checkoutButton} onPress={onCheckoutPress}>
          <Text style={styles.checkoutButtonText}>EUKERO</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  storeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 999,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storeText: {
    flex: 1,
    fontSize: 12,
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
  checkoutButton: {
    height: 42,
    marginTop: 4,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
