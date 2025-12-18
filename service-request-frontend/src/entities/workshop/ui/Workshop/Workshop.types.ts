import type { Product } from '@/entities/product/types';

export interface WorkshopProps {
  name: string;
  type: string;
  workers: number;
  products: Product[];
}
