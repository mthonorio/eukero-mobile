import api from '../api';
import { Product } from '../types/product.type';

type Props = {
  page?: number;
  limit?: number;
};

type PaginatedProductsResponse = {
  items: Product[];
  count: number;
};

export default class ProductService {
  static async fetchExplorerProductsPaginated(
    { page, limit }: Props = {
      page: 1,
      limit: 20,
    },
  ): Promise<PaginatedProductsResponse> {
    try {
      const response = await api.get(`/feed/explorer`, {
        params: { page, page_size: limit },
      });

      return {
        items: response.data?.items || [],
        count: response.data?.count || 0,
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  static async fetchExplorerProducts(
    { page, limit }: Props = {
      page: 1,
      limit: 20,
    },
  ): Promise<Product[]> {
    const response = await this.fetchExplorerProductsPaginated({ page, limit });
    return response.items;
  }

  static async fetchFollowingProductsPaginated(
    { page, limit }: Props = {
      page: 1,
      limit: 20,
    },
  ): Promise<PaginatedProductsResponse> {
    try {
      const response = await api.get('/feed/following', {
        params: { page, page_size: limit },
      });

      return {
        items: response.data?.items || [],
        count: response.data?.count || 0,
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  static async fetchFollowingProducts(
    { page, limit }: Props = {
      page: 1,
      limit: 20,
    },
  ): Promise<Product[]> {
    const response = await this.fetchFollowingProductsPaginated({
      page,
      limit,
    });
    return response.items;
  }
}
