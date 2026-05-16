import { create } from 'zustand';

import * as authService from '../services/auth.service';

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

type AuthStore = {
  user: User | null;
  token: string | null;
  refreshToken?: string | null;

  signIn: (login: string, password: string, token: string) => Promise<void>;
  signOut: () => void;
};

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  token: null,

  signIn: async (login, password, token) => {
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
    };

    set({
      user: userLogin,
      token: response.authToken,
    });
  },

  signOut: () => set({ user: null, token: null }),
}));
