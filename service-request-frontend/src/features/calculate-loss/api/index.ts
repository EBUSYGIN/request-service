import { API_URL } from '@/shared/config/api';

export const CalculateLossAPI = {
  getMaterialConsumption: (productId: number, quantity: number) =>
    `${API_URL}/products/${productId}/material-consumption?quantity=${quantity}`,
};
