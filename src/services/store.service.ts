import api from '../api';

export class StoreService {
  static async getStoreById(storeId: string): Promise<any> {
    try {
      const response = await api.get(`/store/${storeId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar store por ID:', error);
      throw error;
    }
  }

  static async patchStore(storeId: string, data: any): Promise<any> {
    try {
      const response = await api.patch(`/store/${storeId}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar store:', error);
      throw error;
    }
  }
}
