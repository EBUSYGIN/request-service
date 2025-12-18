import { useQuery } from '@tanstack/react-query';
import { ProductsHandler } from '../handler';

export const useProductTypes = () =>
  useQuery({
    queryKey: ['productTypes'],
    queryFn: () => ProductsHandler.getAllProductTypes(),
  });
