import { api } from '../api/api';

type LoginDTO = {
  login: string;
  password: string;
  token: string;
};

export async function login(data: LoginDTO) {
  const response = await api.post('/auth/login', data);

  return response.data;
}
