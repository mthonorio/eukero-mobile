import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, Heart, Tag, Truck } from 'lucide-react-native';
import Video from 'react-native-video';

import { RootStackParamList } from '../../navigation/types';
import { useCheckoutStore } from '../../stores/checkout.store';
import Avatar from '../../components/atoms/Avatar';
import { formatPrice } from '../../utils/formatter.utils';
import { getDiscounted } from '../../utils/get.utils';

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
  destructive: '#DC2626',
};

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

type MediaItem =
  | { type: 'video'; uri: string }
  | { type: 'image'; uri: string };

export function DetailsScreen({ navigation, route }: Props) {
  const { product } = route.params;
  const selectProduct = useCheckoutStore(state => state.selectProduct);
  const { width: screenWidth } = useWindowDimensions();
  const carouselRef = useRef<FlatList<MediaItem>>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const discount = getDiscounted(
    product.salePrice,
    product.promotionalPrice || 0,
  );

  const imageUrl = product.images?.[0]?.url || product.storeImageUrl;
  const mediaItems = useMemo<MediaItem[]>(() => {
    const items: MediaItem[] = [];
    const images =
      product.images
        ?.map(image => image.url)
        .filter((url): url is string => Boolean(url))
        .slice(0, 3) || [];

    if (product.videoUrl?.trim()) {
      items.push({ type: 'video', uri: product.videoUrl.trim() });
    }

    images.forEach(uri => {
      if (!items.some(item => item.uri === uri)) {
        items.push({ type: 'image', uri });
      }
    });

    if (items.length === 0 && imageUrl) {
      items.push({ type: 'image', uri: imageUrl });
    }

    return items;
  }, [imageUrl, product.images, product.videoUrl]);

  const hasDiscount =
    product.promotionalPrice != null &&
    product.promotionalPrice > 0 &&
    product.promotionalPrice < product.salePrice;
  const price = hasDiscount ? product.promotionalPrice : product.salePrice;

  const handleCheckout = async () => {
    await selectProduct(product);
    navigation.navigate('Checkout');
  };

  const handleMediaMomentumEnd = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const index = Math.round(
        event.nativeEvent.contentOffset.x / (screenWidth - 32),
      );
      setActiveMediaIndex(Math.max(0, Math.min(index, mediaItems.length - 1)));
    },
    [mediaItems.length, screenWidth],
  );

  const scrollToMedia = useCallback((index: number) => {
    setActiveMediaIndex(index);
    carouselRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const renderMediaItem = useCallback(
    ({ item }: ListRenderItemInfo<MediaItem>) => (
      <View style={[styles.heroMediaItem, { width: screenWidth - 32 }]}>
        {item.type === 'video' ? (
          <Video
            source={{ uri: item.uri }}
            style={styles.heroMedia}
            resizeMode='cover'
            paused={false}
            repeat
            muted
            controls={false}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch='ignore'
          />
        ) : (
          <Image source={{ uri: item.uri }} style={styles.heroMedia} />
        )}
      </View>
    ),
    [screenWidth],
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroImageWrap}>
        {mediaItems.length > 1 ? (
          <FlatList
            ref={carouselRef}
            data={mediaItems}
            keyExtractor={item => `${item.type}:${item.uri}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            onMomentumScrollEnd={handleMediaMomentumEnd}
            renderItem={renderMediaItem}
            getItemLayout={(_, index) => ({
              length: screenWidth - 32,
              offset: (screenWidth - 32) * index,
              index,
            })}
          />
        ) : mediaItems[0]?.type === 'video' ? (
          <Video
            source={{ uri: mediaItems[0].uri }}
            style={styles.heroImage}
            resizeMode='cover'
            paused={false}
            repeat
            muted
            controls={false}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch='ignore'
          />
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.heroImage} />
        ) : (
          <View style={styles.heroPlaceholder} />
        )}

        {mediaItems.length > 1 ? (
          <View style={styles.dotsRow}>
            {mediaItems.map((item, index) => (
              <Pressable
                key={`${item.type}:${item.uri}:dot`}
                style={[
                  styles.dot,
                  index === activeMediaIndex ? styles.dotActive : null,
                ]}
                onPress={() => scrollToMedia(index)}
              />
            ))}
          </View>
        ) : null}

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
          <Avatar uri={product.storeImageUrl} size={32} />
          <Text style={styles.storeText} numberOfLines={1}>
            {product.storeName}
          </Text>
        </View>

        <Text style={styles.title}>{product.name}</Text>
        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}

        <View style={styles.priceRow}>
          <View style={styles.priceStack}>
            <Text style={styles.priceLabel}>Preço atual</Text>
            {hasDiscount ? (
              <View style={styles.chipRow}>
                <Text style={styles.originalPrice}>
                  {formatPrice(product.salePrice)}
                </Text>
                <Text style={styles.discountPrice}>
                  {discount > 0 ? `-${discount}%` : null}
                </Text>
              </View>
            ) : null}
            {price && (
              <Text style={styles.priceValue}>{formatPrice(price)}</Text>
            )}
          </View>
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

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Detalhes</Text>

        <View style={styles.detailList}>
          {product.department ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Departamento:</Text>
              <Text style={styles.detailValue}>{product.department}</Text>
            </View>
          ) : null}

          {product.category ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Categoria:</Text>
              <Text style={styles.detailValue}>{product.category}</Text>
            </View>
          ) : null}

          {product.classification ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Classificação:</Text>
              <Text style={styles.detailValue}>{product.classification}</Text>
            </View>
          ) : null}

          {product.style ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estilo:</Text>
              <Text style={styles.detailValue}>{product.style}</Text>
            </View>
          ) : null}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Qualidade:</Text>
            <Text style={styles.detailValue}>
              {product.quality != null
                ? String(product.quality)
                : 'Não informada'}
            </Text>
          </View>

          <View style={styles.detailColumnRow}>
            <Text style={styles.detailLabel}>Dimensões:</Text>
            <View style={styles.detailColumn}>
              <Text style={styles.detailValue}>{`Altura: ${
                product.height ?? 0
              }`}</Text>
              <Text style={styles.detailValue}>{`Largura: ${
                product.width ?? 0
              }`}</Text>
              <Text style={styles.detailValue}>{`Comprimento: ${
                product.length ?? 0
              }`}</Text>
              <Text style={styles.detailValue}>{`Peso: ${
                product.weight ?? 0
              }`}</Text>
            </View>
          </View>

          {product.size ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tamanho:</Text>
              <Text style={styles.detailValue}>{product.size}</Text>
            </View>
          ) : null}

          {product.color ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cor:</Text>
              <Text style={styles.detailValue}>{product.color}</Text>
            </View>
          ) : null}
        </View>
      </View>
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
  heroMedia: {
    width: '100%',
    height: '100%',
  },
  heroMediaItem: {
    height: '100%',
  },
  heroPlaceholder: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#FFFFFF',
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
  storeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 999,
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
  priceStack: {
    flex: 1,
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
    marginBottom: 2,
  },
  discountPrice: {
    fontSize: 14,
    color: colors.destructive,
    fontWeight: '500',
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
  detailList: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  detailColumnRow: {
    gap: 6,
  },
  detailColumn: {
    paddingLeft: 12,
    gap: 4,
  },
  detailLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.text,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  galleryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  galleryThumb: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  galleryThumbActive: {
    borderColor: colors.primary,
  },
  galleryImage: {
    width: 92,
    height: 92,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
  },
  videoThumb: {
    width: 92,
    height: 92,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  videoThumbText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.4,
  },
});
