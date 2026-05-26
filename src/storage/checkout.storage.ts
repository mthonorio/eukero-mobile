import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CheckoutProduct } from '../types/checkout.type';

const CHECKOUT_STORAGE_KEY = '@eukero:checkout:selected-product';

type CheckoutSelectionStorage = {
  selectedProduct: CheckoutProduct;
};

export async function saveCheckoutSelection(data: CheckoutSelectionStorage) {
  await AsyncStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(data));
}

export async function getCheckoutSelection() {
  const storage = await AsyncStorage.getItem(CHECKOUT_STORAGE_KEY);

  if (!storage) {
    return null;
  }

  return JSON.parse(storage) as CheckoutSelectionStorage;
}

export async function removeCheckoutSelection() {
  await AsyncStorage.removeItem(CHECKOUT_STORAGE_KEY);
}
