import type { Product } from '@/entities/product/types';

export interface Workshop {
  id: number;
  productId: number;
  workshopId: number;
  productionTime: number;
  createdAt: string;
  updatedAt: string;
  workshop: Workshop;
}

export interface WorkshopInstance {
  id: number;
  name: string;
  type: string;
  workers: number;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}
