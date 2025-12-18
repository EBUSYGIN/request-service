import type {
  RefetchOptions,
  QueryObserverResult,
} from '@tanstack/react-query';
import type { Product } from '../../types';

export interface ProductCardProps {
  id: number;
  name: string;
  article: string;
  minPrice: number;
  material: string;
  productionTime: number | string;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<Product[], Error>>;
}
