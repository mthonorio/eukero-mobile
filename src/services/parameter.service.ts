import api from '../api';

export class ParameterService {
  static async fetchParameters(): Promise<Record<string, any>> {
    const response = await api.get<Record<string, any>>('/parameters');
    return response.data;
  }

  static async putParameters(
    data: Record<string, any>,
  ): Promise<Record<string, any>> {
    const response = await api.put<Record<string, any>>('/parameters', data);
    return response.data;
  }
}
