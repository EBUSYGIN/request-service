import { axiosInstance } from '@/shared/lib/axiosInstance';
import { CalculateLossAPI } from '../api';
import type { CalculationResult } from '../ui/CalculateLossForm/CalculateLossForm.types';

const getMaterialConsumption = async (
  productId: number,
  quantity: number
): Promise<CalculationResult> => {
  try {
    const serverResponse = await axiosInstance.get(
      CalculateLossAPI.getMaterialConsumption(productId, quantity)
    );
    const result: CalculationResult = serverResponse.data;
    return result;
  } catch (e) {
    console.log('Ошибка расчета сырья');
    if (e instanceof Error) {
      throw e;
    }

    throw new Error('Ошибка расчета сырья');
  }
};

export const CalculateLossHandler = {
  getMaterialConsumption,
};
