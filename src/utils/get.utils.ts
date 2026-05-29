import { Product } from '../types/product.type';

export function getProductImage(product: Product) {
  return product.images?.[0]?.url || product.storeImageUrl || undefined;
}

/**
 * Calcula o percentual de desconto entre o preço original e o preço promocional
 * @param originalPrice - Preço original
 * @param promotionalPrice - Preço promocional
 * @returns Percentual de desconto arredondado
 */
export function getDiscounted(
  originalPrice: number,
  promotionalPrice: number,
): number {
  if (
    isNaN(originalPrice) ||
    isNaN(promotionalPrice) ||
    originalPrice <= 0 ||
    promotionalPrice < 0 ||
    promotionalPrice >= originalPrice
  ) {
    return 0;
  }

  const discount = ((originalPrice - promotionalPrice) / originalPrice) * 100;
  return Math.round(discount);
}
