import type { Material } from '@/entities/materials/types';
import type { Workshop } from '@/entities/workshop/types';

export interface Product {
  id: number;
  name: string;
  article: string;
  typeId: number;
  materialId: number;
  minPrice: number;
  createdAt: Date;
  updatedAt: Date;
  material: Material;
  type: Type;
  workshops: Workshop[];
}

export interface Type {
  id: number;
  name: string;
  coefficient: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUpdateProduct {
  id?: number;
  name: string;
  typeId: number;
  materialId: number;
  minPrice: number;
}
