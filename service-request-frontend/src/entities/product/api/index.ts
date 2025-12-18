import { API_URL } from '@/shared/config/api';

export const ProductsAPI = {
  default: (productId?: string) =>
    `${API_URL}/products${productId ? `/${productId}` : ''}`,
  delete: (id: number) => `${API_URL}/products/${id}`,
  getProductTypes: () => `${API_URL}/products/types`,
};
