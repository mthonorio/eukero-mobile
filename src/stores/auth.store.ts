import { create } from 'zustand';

import { api } from '../api';

import {
  getAuthStorage,
  removeAuthStorage,
  saveAuthStorage,
} from '../storage/auth.storage';
import { AuthService } from '../services/auth.service';
import { AuthResponse, AuthStorage, User } from '../types/user.type';

type AuthStore = {
  user: User | null;

  token: string | null;
  refreshToken: string | null;

  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;

  hydrate: () => Promise<void>;

  signIn: (login: string, password: string) => Promise<AuthResponse>;

  signInWithBiometrics: () => Promise<void>;

  updateProfile: (data: Partial<User>) => Promise<void>;

  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>(set => ({
  user: null,

  token: null,
  refreshToken: null,

  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,

  hydrate: async () => {
    try {
      const storage = await getAuthStorage({
        promptMessage: 'Autentique-se para entrar no aplicativo',
      });

      if (storage) {
        api.defaults.headers.common.Authorization = `Bearer ${storage.token}`;

        set({
          user: storage.user,
          token: storage.token,
          refreshToken: storage.refreshToken,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.log('AUTH HYDRATE ERROR:', error);
    } finally {
      set({
        isHydrated: true,
      });
    }
  },

  signIn: async (login, password) => {
    try {
      set({
        isLoading: true,
      });

      const response: AuthResponse = await AuthService.login({
        login,
        password,
      });

      api.defaults.headers.common.Authorization = `Bearer ${response.authToken}`;

      if (!response.isActive) {
        set({
          user: null,
          token: response.authToken,
          refreshToken: response.refreshToken,
          isAuthenticated: false,
        });

        return response;
      }

      const userLogin: User = {
        id: response.userUid,
        name: response.userName,
        email: response.userEmail,
        avatar: response.userPhoto,
        phone: response.userPhone,
        type: response.userType ?? 'USER',
        username: response.userUsername,
        storeName: response.storeName,
        plan: response.plan,
        planExpiration: response.planExpiration,
      };

      const authStorage: AuthStorage = {
        user: userLogin,
        token: response.authToken,
        refreshToken: response.refreshToken,
      };

      await saveAuthStorage(authStorage);

      set({
        user: userLogin,
        token: response.authToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
      });

      return response;
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  signInWithBiometrics: async () => {
    try {
      set({
        isLoading: true,
      });

      const storage = await getAuthStorage({
        promptMessage: 'Autentique-se para recuperar sua sessão',
      });

      if (!storage) {
        throw new Error(
          'Nenhuma sessão biométrica cadastrada neste dispositivo.',
        );
      }

      api.defaults.headers.common.Authorization = `Bearer ${storage.token}`;

      set({
        user: storage.user,
        token: storage.token,
        refreshToken: storage.refreshToken,
        isAuthenticated: true,
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  updateProfile: async data => {
    const state = useAuthStore.getState();

    if (!state.user || !state.token || !state.refreshToken) {
      return;
    }

    const updatedUser = {
      ...state.user,
      ...data,
    };

    await saveAuthStorage({
      user: updatedUser,
      token: state.token,
      refreshToken: state.refreshToken,
    });

    set({
      user: updatedUser,
    });
  },

  signOut: async () => {
    await removeAuthStorage();

    delete api.defaults.headers.common.Authorization;

    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
}));
