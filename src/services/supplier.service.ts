import api from '../api';
import {
  PaginatedSuppliersResponse,
  SupplierMeResponse,
  SupplierRequest,
} from '../types/supplier.type';

export class SupplierService {
  static async getSuppliers({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): Promise<PaginatedSuppliersResponse> {
    const response = await api.get('/suppliers', {
      params: { page, pageSize },
    });
    return response.data;
  }

  static async getSearchSuppliers({
    search,
  }: {
    search?: string;
  }): Promise<SupplierMeResponse[]> {
    const response = await api.get('/suppliers/search', {
      params: { q: search },
    });
    return response.data;
  }

  static async postSupplier(
    data: SupplierRequest,
  ): Promise<SupplierMeResponse> {
    const response = await api.post('/suppliers', data);
    return response.data;
  }

  static async patchSupplier(
    userId: string,
    data: SupplierRequest,
  ): Promise<SupplierMeResponse> {
    const response = await api.patch(`/suppliers/${userId}`, data);
    return response.data;
  }

  static async getSupplierById(userId: string): Promise<SupplierMeResponse> {
    const response = await api.get(`/suppliers/${userId}`);
    return response.data;
  }

  static async deleteSupplier(userId: string): Promise<void> {
    await api.delete(`/suppliers/${userId}`);
  }

  static async getSupplierMe(): Promise<SupplierMeResponse[]> {
    const response = await api.get('/suppliers/me');
    return response.data;
  }
}

export default SupplierService;
