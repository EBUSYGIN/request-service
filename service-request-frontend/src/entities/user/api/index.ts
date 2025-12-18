import { API_URL } from '@/shared/config/api';

export const UsersAPI = {
  getAll: () => `${API_URL}/users`,
  getClients: () => `${API_URL}/users/clients`,
  getById: (id: number) => `${API_URL}/users/${id}`,
  create: () => `${API_URL}/users`,
};
