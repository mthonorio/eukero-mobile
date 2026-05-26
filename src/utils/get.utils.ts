import { Product } from '../types/product.type';

export function getProductImage(product: Product) {
  return product.images?.[0]?.url || product.storeImageUrl || undefined;
}
