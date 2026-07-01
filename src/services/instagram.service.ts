import api from '../api';

export type InstagramStatus = {
  connected: boolean;
  username?: string;
};

export class InstagramService {
  static async getStatus(): Promise<InstagramStatus> {
    const response = await api.get<InstagramStatus>('/instagram/status');
    return response.data;
  }

  static async connect(): Promise<{ authUrl: string }> {
    const response = await api.post<{ authUrl: string }>(
      '/instagram/connect',
    );
    return response.data;
  }

  static async disconnect(): Promise<void> {
    await api.delete('/instagram/disconnect');
  }
}
