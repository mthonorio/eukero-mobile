import { api } from '../api/api';

type LoginDTO = {
  login: string;
  password: string;
  token: string;
};

export class AuthService {
  static async login(data: LoginDTO) {
    const response = await api.post('/auth/login', data);
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
      }
    );
    return response.data.exists;
  }

  static async checkUsernameExists(username: string): Promise<boolean> {
    const response = await api.post<{ exists: boolean }>(
      '/auth/check-username-exists',
      {
        username,
      }
    );
    return response.data.exists;
  }

  static async checkDocumentExists(document: string): Promise<boolean> {
    const response = await api.post<{ exists: boolean }>(
      '/auth/check-document-exists',
      {
        document,
      }
    );
    return response.data.exists;
  }
}
