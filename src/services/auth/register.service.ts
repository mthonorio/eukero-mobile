import api from '../../api';

import type {
  RegisterPersonPayload,
  RegisterStorePayload,
} from '../../types/auth/register';

export class RegisterAuthService {
  static async registerPerson(data: RegisterPersonPayload) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  }

  static async registerStore(data: RegisterStorePayload) {
    const response = await api.post('/auth/signup-store', data);
    return response.data;
  }
}
