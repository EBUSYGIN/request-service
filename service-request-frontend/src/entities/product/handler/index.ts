import { axiosInstance } from '@/shared/lib/axiosInstance';
import { ProductsAPI } from '../api';
import type { CreateUpdateProduct, Product, Type } from '../types';

const getAllProducts = async (): Promise<Product[]> => {
  try {
    const serverResponse = await axiosInstance.get(ProductsAPI.default());
    const products: Product[] = serverResponse.data.products;
    return products;
  } catch (e) {
    console.log('Ошибка загрузки продуктов');
    if (e instanceof Error) {
      throw e;
    }

    throw new Error('Ошибка загрузки продуктов');
  }
};

const deleteProduct = async (id: number) => {
  try {
    await axiosInstance.delete(ProductsAPI.delete(id));
  } catch (e) {
    console.log('Ошибка удаления');
    if (e instanceof Error) {
      throw e;
    }

    throw new Error('Ошибка удаления');
  }
};

const getAllProductTypes = async (): Promise<Type[]> => {
  try {
    const serverResponse = await axiosInstance.get(ProductsAPI.getProductTypes());
    const types: Type[] = serverResponse.data.productTypes;
    return types;
  } catch (e) {
    console.log('Ошибка загрузки типов');
    if (e instanceof Error) {
      throw e;
    }

    throw new Error('Ошибка загрузки типов');
  }
};

const createUpdateProduct = async (
  data: CreateUpdateProduct,
  productId?: string
): Promise<boolean> => {
  const method = productId ? 'put' : 'post';
  try {
    await axiosInstance[method](ProductsAPI.default(productId), data);
    return true;
  } catch (e) {
    console.log('Ошибка создания продукта');
    if (e instanceof Error) {
      throw e;
    }

    throw new Error('Ошибка создания продукта');
  }
};

export const ProductsHandler = {
  getAllProducts,
  deleteProduct,
  getAllProductTypes,
  createUpdateProduct,
};
