import type { Product } from './product.type';

export interface GroupedBagStore {
  storeId: string;
  storeName: string;
  storeUsername: string;
  storeImageUrl?: string;
  items: Product[];
}
