import api from '../api';
import {
  FinancialHeadersResponse,
  FinancialMovementsResponse,
} from '../types/financial.type';

export class FinancialService {
  static async getFinancialMovements(
    page: number,
    pageSize: number,
    dateInit?: string,
    dateEnd?: string,
    status?: string,
    type?: string,
    orderId?: string,
  ): Promise<FinancialMovementsResponse> {
    const response = await api.get('/financial-movements', {
      params: {
        page,
        page_size: pageSize,
        dateInit,
        dateEnd,
        status,
        type,
        orderId,
      },
    });
    return response.data;
  }

  static async getHeadersFinancialMovements(
    dateInit?: string,
    dateEnd?: string,
    status?: string,
    type?: string,
    orderId?: string,
  ): Promise<FinancialHeadersResponse> {
    const response = await api.get('/financial-movements/headers', {
      params: { dateInit, dateEnd, status, type, orderId },
    });
    return response.data;
  }
}

export default FinancialService;
