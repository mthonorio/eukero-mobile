export type LoginDTO = {
  login: string;
  password: string;
  token: string;
};

export type User = {
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

export type AuthResponse = {
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

export type AuthStorage = {
  user: User;
  token: string;
  refreshToken: string;
};

export type PixData = {
  ownerName: string;
  pixKey: string;
  document: string;
};
