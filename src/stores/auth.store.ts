import { create } from 'zustand';

import * as authService from '../services/auth.service';

import { api } from '../api/api';

import {
  getAuthStorage,
  removeAuthStorage,
  saveAuthStorage,
} from '../storage/auth.storage';

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  type: 'USER' | 'STORE';
  username: string;
  storeName?: string;
  plan?: string;
  planExpiration?: string;
};

type AuthResponse = {
  id?: string;

  userUid: string;
  userUsername: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  userPhoto: string;

  userType?: 'USER' | 'STORE';

  authToken: string;
  refreshToken: string;
  expireTime: number;

  storeName?: string;
  plan?: string;
  planExpiration?: string;

  isActive: boolean;
};

type AuthStorage = {
  user: User;
  token: string;
  refreshToken: string;
};

type AuthStore = {
  user: User | null;

  token: string | null;
  refreshToken: string | null;

  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;

  hydrate: () => Promise<void>;

  signIn: (login: string, password: string, token: string) => Promise<void>;

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
      const storage = await getAuthStorage();

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

  signIn: async (login, password, token) => {
    try {
      set({
        isLoading: true,
      });

      const response: AuthResponse = await authService.login({
        login,
        password,
        token,
      });

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

      api.defaults.headers.common.Authorization = `Bearer ${response.authToken}`;

      set({
        user: userLogin,

        token: response.authToken,

        refreshToken: response.refreshToken,

        isAuthenticated: true,
      });
    } finally {
      set({
        isLoading: false,
      });
    }
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
