import { useMutation } from '@tanstack/react-query';
import { CalculateLossHandler } from '../handler';
import type { CalculationResult } from '../ui/CalculateLossForm/CalculateLossForm.types';

export const useCalculateLoss = () => {
  return useMutation<
    CalculationResult,
    Error,
    { productId: number; quantity: number }
  >({
    mutationFn: ({ productId, quantity }) =>
      CalculateLossHandler.getMaterialConsumption(productId, quantity),
  });
};
