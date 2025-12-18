import { API_URL } from '@/shared/config/api';

export const RequestsAPI = {
  getAll: () => `${API_URL}/requests`,
  getById: (id: number) => `${API_URL}/requests/${id}`,
  create: () => `${API_URL}/requests`,
  updateStatus: (id: number) => `${API_URL}/requests/${id}/status`,
  assignMaster: (id: number) => `${API_URL}/requests/${id}/assign-master`,
  addComment: (id: number) => `${API_URL}/requests/${id}/comments`,
};
