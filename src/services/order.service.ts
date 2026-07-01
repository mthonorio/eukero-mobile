import api from '../api';
import { ApiOrder, ApiOrdersResponse } from '../types/orders.type';

export class OrderService {
  static async getOrders(
    params?: Record<string, any>,
  ): Promise<ApiOrdersResponse> {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw error;
    }
  }

  static async getOrderById(orderId: string): Promise<ApiOrder | null> {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data || null;
    } catch (error) {
      console.error('Erro ao buscar pedido por ID:', error);
      throw error;
    }
  }

  static async fetchMySales(
    status?: string,
    search?: string,
  ): Promise<ApiOrder[]> {
    try {
      const params: Record<string, any> = {};
      if (status && status !== 'all') {
        params.status = status;
      }
      if (search) {
        params.search = search;
      }

      const response = await api.get<ApiOrder[]>('/my-sales', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      throw error;
    }
  }

  static async getSellerById(sellerId: string): Promise<ApiOrder | null> {
    try {
      const response = await api.get(`/my-sales/${sellerId}`);
      return response.data || null;
    } catch (error) {
      console.error('Erro ao buscar venda por ID:', error);
      throw error;
    }
  }

  static async createOrder(orderData: {
    buyer: { fulfillment: string; addressId?: string };
    storeId: string;
    items: Array<{ productId: string; quantity: number }>;
    shippingValue: number;
  }): Promise<ApiOrder> {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  }
}

export default OrderService;
