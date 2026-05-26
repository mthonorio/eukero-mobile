import { create } from 'zustand';

import type { Product } from '../types/product.type';
import type { CheckoutProduct } from '../types/checkout.type';
import {
  getCheckoutSelection,
  removeCheckoutSelection,
  saveCheckoutSelection,
} from '../storage/checkout.storage';

function mapProductToCheckoutProduct(product: Product): CheckoutProduct {
  return {
    id: product.id,
    name: product.name,
    salePrice: product.salePrice,
    promotionalPrice: product.promotionalPrice,
    quantity: product.quantity || 1,
    image: product.images?.[0]?.url || product.storeImageUrl || undefined,
    seller: product.storeName,
    storeUsername: product.storeUsername,
    sku: product.sku,
    category: product.category ?? product.department ?? undefined,
    weight: product.weight,
    height: product.height,
    width: product.width,
    length: product.length,
    shipping: {
      type: 'standard',
      date: '',
      price: 0,
      carrier: undefined,
      serviceDescription: undefined,
      estimatedDays: undefined,
    },
  };
}

type CheckoutStore = {
  selectedProduct: CheckoutProduct | null;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  selectProduct: (product: Product) => Promise<void>;
  clearSelection: () => Promise<void>;
};

export const useCheckoutStore = create<CheckoutStore>(set => ({
  selectedProduct: null,
  isHydrated: false,

  hydrate: async () => {
    try {
      const storage = await getCheckoutSelection();

      set({
        selectedProduct: storage?.selectedProduct ?? null,
      });
    } finally {
      set({
        isHydrated: true,
      });
    }
  },

  selectProduct: async product => {
    const selectedProduct = mapProductToCheckoutProduct(product);

    await saveCheckoutSelection({ selectedProduct });

    set({ selectedProduct });
  },

  clearSelection: async () => {
    await removeCheckoutSelection();

    set({ selectedProduct: null });
  },
}));
