import api from '../api';
import { GroupedBagStore } from '../types/bag.type';

export class UserBagService {
  static async getUserBag(): Promise<GroupedBagStore[]> {
    try {
      const response = await api.get<GroupedBagStore[]>('/user-bag');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar sacola:', error);
      throw error;
    }
  }

  static async addItemToBag(item: {
    productUid: string;
    quantity: number;
  }): Promise<GroupedBagStore[]> {
    try {
      const response = await api.post<GroupedBagStore[]>('/user-bag', item);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar item na sacola:', error);
      throw error;
    }
  }

  static async updateBagItemQuantity(
    productUid: string,
    quantity: number,
  ): Promise<GroupedBagStore[]> {
    try {
      const response = await api.patch<GroupedBagStore[]>(
        `/user-bag/${productUid}`,
        { quantity },
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar quantidade da sacola:', error);
      throw error;
    }
  }

  static async removeItemFromBag(
    productUid: string,
  ): Promise<GroupedBagStore[]> {
    try {
      const response = await api.delete<GroupedBagStore[]>(
        `/user-bag/${productUid}`,
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao remover item da sacola:', error);
      throw error;
    }
  }
}

export default UserBagService;
