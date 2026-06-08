import api from '../api';
import { IAddress } from '../types/register.type';

export interface UserMeResponse {
  id?: string;
  uid: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  photo: string;
  type: 'USER' | 'STORE';
  pixKey?: string;
  document?: string;
}

export interface UserUpdateData {
  name?: string;
  username?: string;
  phone?: string;
  photo?: string;
  pixKey?: string;
}

export class UserService {
  static async getMe(): Promise<UserMeResponse> {
    const response = await api.get<UserMeResponse>('/users/me');
    return response.data;
  }

  static async updateUserProfile(
    data: UserUpdateData,
  ): Promise<UserMeResponse> {
    const response = await api.patch<UserMeResponse>('/users/me', data);
    return response.data;
  }

  static async changeUserAvatar(
    photoFile:
      | File
      | Blob
      | { uri: string; name: string; type?: string },
  ): Promise<UserMeResponse> {
    const formData = new FormData();
    formData.append('file', photoFile as any);

    const response = await api.post<UserMeResponse>(
      '/users/change-avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  }

  static async searchUsers(query: {
    search: string;
    type?: string;
  }): Promise<UserMeResponse[]> {
    const response = await api.get<UserMeResponse[]>('/search-users', {
      params: query,
    });
    return response.data;
  }

  static async searchStore(query: string): Promise<UserMeResponse[]> {
    const response = await api.get<UserMeResponse[]>('/search-stores', {
      params: { search: query },
    });
    return response.data;
  }

  static async followingStore(userId: string): Promise<void> {
    await api.post('/user-follow/follow', { userId });
  }

  static async unfollowingStore(userId: string): Promise<void> {
    await api.post('/user-follow/unfollow', { userId });
  }

  static async getStore(storeId: string): Promise<any> {
    const response = await api.get(`/store/${storeId}`);
    return response.data;
  }

  static async getAddresses(): Promise<IAddress[]> {
    const response = await api.get('/user-address');
    return response.data;
  }

  static async addAddress(addressData: IAddress): Promise<IAddress> {
    const response = await api.post('/user-address', addressData);
    return response.data;
  }

  static async updateAddress(
    addressId: string,
    addressData: IAddress,
  ): Promise<IAddress> {
    const response = await api.put(`/user-address/${addressId}`, addressData);
    return response.data;
  }

  static async deleteAddress(addressId: string): Promise<void> {
    await api.delete(`/user-address/${addressId}`);
  }

  static async getStoreShippingPolicy(): Promise<any> {
    const response = await api.get('/store-shipping-policy');
    return response.data;
  }

  static async updateStoreShippingPolicy({
    policy,
    allowReturn,
  }: {
    policy: string;
    allowReturn: boolean;
  }): Promise<any> {
    const response = await api.put('/store-shipping-policy', {
      policy,
      allowReturn,
    });
    return response.data;
  }

  static async getPlatformTerms(): Promise<any> {
    const response = await api.get('/platform/terms');
    return response.data;
  }

  static async getPlatformPrivacy(): Promise<any> {
    const response = await api.get('/platform/privacy');
    return response.data;
  }

  static async getPlatformReturnPolicy(): Promise<any> {
    const response = await api.get('/platform/return-policy');
    return response.data;
  }
}
