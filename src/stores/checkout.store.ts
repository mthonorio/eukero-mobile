import { create } from 'zustand';

import type { Product } from '../types/product.type';
import type { CheckoutProduct } from '../types/checkout.type';
import {
  getCheckoutSelection,
  removeCheckoutSelection,
  saveCheckoutSelection,
} from '../storage/checkout.storage';

// function mapProductToCheckoutProduct(product: Product): CheckoutProduct {
//   return {
//     ...product,
//     seller: product.storeName,
//     shipping: {
//       type: 'standard',
//       date: '',
//       price: 0,
//       carrier: undefined,
//       serviceDescription: undefined,
//       estimatedDays: undefined,
//     },
//   };
// }

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
    const selectedProduct = product as CheckoutProduct;

    await saveCheckoutSelection({ selectedProduct });

    set({ selectedProduct });
  },

  clearSelection: async () => {
    await removeCheckoutSelection();

    set({ selectedProduct: null });
  },
}));
