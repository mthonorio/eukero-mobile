import axios from 'axios';
import { Alert } from 'react-native';

import env from '../config/env';
import { useAuthStore } from '../stores/auth.store';
import { getCurrentRouteName } from '../navigation/navigationRef';

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
});

const authRouteNames = new Set([
  'Login',
  'ForgetPassword',
  'Register',
  'ActivateAccount',
  'Signup',
]);

api.interceptors.request.use(
  config => {
    try {
      const token = useAuthStore.getState().token;

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Erro ao obter token para requisição API:', error);
    }

    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => response,
  async error => {
    const status = error?.response?.status;

    if (status === 500) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro desconhecido na aplicação. Tente novamente.',
      );
    }

    if (status === 401) {
      const currentRouteName = getCurrentRouteName();

      if (!currentRouteName || !authRouteNames.has(currentRouteName)) {
        await useAuthStore.getState().signOut();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
