import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Heart, PencilLine, Star } from 'lucide-react-native';

import { Product } from '../../types/product.type';
import { getProductImage } from '../../utils/get.utils';
import { ProductBadge } from '../molecules/ProductBadge';
import { colors } from '../../styles/colors';

const noImage = require('../../assets/images/no-image-available.png');

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

type Props = {
  product: Product;
  onPress?: () => void;
  onEditPress?: () => void;
  onFavoritePress?: () => void;
};

export function MyProductCard({
  product,
  onPress,
  onEditPress,
  onFavoritePress,
}: Props) {
  const imageUrl = getProductImage(product);
  const hasDiscount =
    product.promotionalPrice != null &&
    product.promotionalPrice > 0 &&
    product.promotionalPrice < product.salePrice;
  const price = hasDiscount ? product.promotionalPrice || 0 : product.salePrice;
  const quantityLabel =
    product.quantity > 0 ? `${product.quantity} un.` : 'Sem estoque';

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.imageWrap, pressed && styles.pressed]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode='cover'
          />
        ) : (
          <Image source={noImage} style={styles.image} resizeMode='cover' />
        )}

        <View style={styles.imageOverlay}>
          <ProductBadge status={product.status} />

          <Pressable
            onPress={onFavoritePress}
            style={styles.favoriteButton}
            hitSlop={8}
          >
            <Heart
              color={colors.zen.accent}
              size={14}
              fill={colors.zen.accent}
            />
          </Pressable>
        </View>
      </Pressable>

      <View style={styles.body}>
        <View style={styles.storeRow}>
          <View style={styles.storeDot} />
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
            <Text style={styles.priceLabel}>Preço</Text>
            <Text style={styles.priceValue}>{formatPrice(price)}</Text>
          </View>

          {hasDiscount ? (
            <Text style={styles.originalPrice}>
              {formatPrice(product.salePrice)}
            </Text>
          ) : null}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaBadgePrimary}>
            <Text style={styles.metaBadgePrimaryText}>{quantityLabel}</Text>
          </View>

          {product.likes > 0 ? (
            <View style={styles.metaBadgeSoft}>
              <Text style={styles.metaBadgeSoftText}>
                {product.likes} curtidas
              </Text>
            </View>
          ) : null}

          {product.classification ? (
            <View style={styles.metaBadgeSoft}>
              <Text style={styles.metaBadgeSoftText}>
                {product.classification}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={onEditPress}
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <PencilLine color={colors.zen.primary} size={16} />
            <Text style={styles.editButtonText}>Editar</Text>
          </Pressable>

          <View
            style={[
              styles.stockBadge,
              product.inStock ? styles.stockBadgeOn : styles.stockBadgeOff,
            ]}
          >
            <Text
              style={[
                styles.stockBadgeText,
                product.inStock
                  ? styles.stockBadgeTextOn
                  : styles.stockBadgeTextOff,
              ]}
            >
              {product.inStock ? 'Em estoque' : 'Sem estoque'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.zen.surface,
    borderWidth: 1,
    borderColor: colors.zen.border,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.96,
  },
  imageWrap: {
    position: 'relative',
    aspectRatio: 0.92,
    backgroundColor: colors.zen.surfaceSoft,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.zen.accentSoft,
  },
  imageOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  statusBadgeSuccess: {
    backgroundColor: 'rgba(18, 183, 106, 0.12)',
  },
  statusBadgeDanger: {
    backgroundColor: 'rgba(240, 68, 56, 0.12)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusTextSuccess: {
    color: colors.zen.success,
  },
  statusTextDanger: {
    color: colors.zen.danger,
  },
  favoriteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  body: {
    padding: 14,
    gap: 8,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.zen.primary,
  },
  storeText: {
    flex: 1,
    fontSize: 12,
    color: colors.zen.muted,
    fontWeight: '600',
  },
  productName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    color: colors.zen.text,
  },
  productDescription: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.zen.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  priceLabel: {
    fontSize: 10,
    color: colors.zen.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  priceValue: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    color: colors.zen.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.zen.muted,
    textDecorationLine: 'line-through',
    marginBottom: 1,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaBadgePrimary: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.zen.primarySoft,
  },
  metaBadgePrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.zen.primary,
  },
  metaBadgeSoft: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.zen.surfaceSoft,
  },
  metaBadgeSoftText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.zen.text,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 4,
  },
  editButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.zen.primarySoft,
    flexDirection: 'row',
  },
  editButtonText: {
    color: colors.zen.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  stockBadge: {
    height: 42,
    minWidth: 108,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockBadgeOn: {
    backgroundColor: colors.zen.successSoft,
  },
  stockBadgeOff: {
    backgroundColor: colors.zen.dangerSoft,
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  stockBadgeTextOn: {
    color: colors.zen.success,
  },
  stockBadgeTextOff: {
    color: colors.zen.danger,
  },
  buttonPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
});
