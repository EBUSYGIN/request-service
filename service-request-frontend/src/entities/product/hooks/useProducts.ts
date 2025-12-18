import { useQuery } from '@tanstack/react-query';
import { ProductsHandler } from '../handler';

export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: () => ProductsHandler.getAllProducts(),
  });
