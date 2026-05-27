import api from '../api';
import { CreditCard } from '../types/checkout.type';
import { IRegisterStoreForm, IRegisterUserForm } from '../types/register.type';

export class RegisterService {
  static async registerUser(data: IRegisterUserForm) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  }

  static async confirmEmail(data: { token: string; email: string }) {
    const response = await api.post('/auth/verify-email', data);
    return response.data;
  }

  static async registerStore(data: IRegisterStoreForm) {
    const response = await api.post('/auth/signup-store', {
      ...data,
    });
    return response.data;
  }

  static async resendConfirmationEmail(email: string) {
    const response = await api.post('/auth/verify-email/request', {
      email,
    });
    return response.data;
  }

  static async storePaySignature(data: CreditCard) {
    const response = await api.post('/store-pay-signature', data);
    return response.data;
  }

  static async deleteStorePaySignature() {
    const response = await api.delete('/store-pay-signature');
    return response.data;
  }
}
