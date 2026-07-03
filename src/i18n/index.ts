import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { getLanguagePreference, type LanguageCode } from '../storage/language.storage';

import ptCommon from './locales/pt-BR/common.json';
import ptValidation from './locales/pt-BR/validation.json';
import ptAuth from './locales/pt-BR/auth.json';
import ptHome from './locales/pt-BR/home.json';
import ptShopping from './locales/pt-BR/shopping.json';
import ptOrders from './locales/pt-BR/orders.json';
import ptProfile from './locales/pt-BR/profile.json';
import ptBusinessSettings from './locales/pt-BR/businessSettings.json';
import ptProducts from './locales/pt-BR/products.json';
import ptSuppliers from './locales/pt-BR/suppliers.json';
import ptFinance from './locales/pt-BR/finance.json';

import enCommon from './locales/en-US/common.json';
import enValidation from './locales/en-US/validation.json';
import enAuth from './locales/en-US/auth.json';
import enHome from './locales/en-US/home.json';
import enShopping from './locales/en-US/shopping.json';
import enOrders from './locales/en-US/orders.json';
import enProfile from './locales/en-US/profile.json';
import enBusinessSettings from './locales/en-US/businessSettings.json';
import enProducts from './locales/en-US/products.json';
import enSuppliers from './locales/en-US/suppliers.json';
import enFinance from './locales/en-US/finance.json';

import esCommon from './locales/es/common.json';
import esValidation from './locales/es/validation.json';
import esAuth from './locales/es/auth.json';
import esHome from './locales/es/home.json';
import esShopping from './locales/es/shopping.json';
import esOrders from './locales/es/orders.json';
import esProfile from './locales/es/profile.json';
import esBusinessSettings from './locales/es/businessSettings.json';
import esProducts from './locales/es/products.json';
import esSuppliers from './locales/es/suppliers.json';
import esFinance from './locales/es/finance.json';

const resources = {
  'pt-BR': {
    translation: {
      ...ptCommon,
      ...ptValidation,
      ...ptAuth,
      ...ptHome,
      ...ptShopping,
      ...ptOrders,
      ...ptProfile,
      ...ptBusinessSettings,
      ...ptProducts,
      ...ptSuppliers,
      ...ptFinance,
    },
  },
  'en-US': {
    translation: {
      ...enCommon,
      ...enValidation,
      ...enAuth,
      ...enHome,
      ...enShopping,
      ...enOrders,
      ...enProfile,
      ...enBusinessSettings,
      ...enProducts,
      ...enSuppliers,
      ...enFinance,
    },
  },
  es: {
    translation: {
      ...esCommon,
      ...esValidation,
      ...esAuth,
      ...esHome,
      ...esShopping,
      ...esOrders,
      ...esProfile,
      ...esBusinessSettings,
      ...esProducts,
      ...esSuppliers,
      ...esFinance,
    },
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export async function initI18n(): Promise<void> {
  const language = await getLanguagePreference();
  if (i18next.language !== language) {
    await i18next.changeLanguage(language);
  }
}

export async function changeLanguage(code: LanguageCode): Promise<void> {
  await i18next.changeLanguage(code);
}

export { i18next as i18n };
export default i18next;
