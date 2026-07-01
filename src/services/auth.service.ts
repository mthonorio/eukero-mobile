import { api } from '../api';
import { PixData } from '../types/user.type';

type LoginDTO = {
  login: string;
  password: string;
};

export class AuthService {
  static async login(data: LoginDTO) {
    const response = await api.post('/auth/login-mobile', data);
    return response.data;
  }

  static async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }

  static async forgotPassword(email: string): Promise<{ successo: boolean }> {
    const response = await api.post('/auth/forgot-password', {
      email,
    });
    return response.data as { successo: boolean };
  }

  static async resetPassword(data: { token: string; newPassword: string }) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  }

  static async changePassword(newPassword: string): Promise<void> {
    await api.post('/auth/change-password', { newPassword });
  }

  static async checkEmailExists(email: string): Promise<boolean> {
    const response = await api.post<{ exists: boolean }>(
      '/auth/check-email-exists',
      {
        email,
      },
    );
    return response.data.exists;
  }

  static async checkUsernameExists(username: string): Promise<boolean> {
    const response = await api.post<{ exists: boolean }>(
      '/auth/check-username-exists',
      {
        username,
      },
    );
    return response.data.exists;
  }

  static async checkDocumentExists(document: string): Promise<boolean> {
    const response = await api.post<{ exists: boolean }>(
      '/auth/check-document-exists',
      {
        document,
      },
    );
    return response.data.exists;
  }

  static async getPixData(): Promise<PixData> {
    const response = await api.get<PixData>('/auth/pix-data');
    return response.data;
  }

  static async postPixData(data: PixData): Promise<PixData> {
    const response = await api.post<PixData>('/auth/pix-data', data);
    return response.data;
  }
}
