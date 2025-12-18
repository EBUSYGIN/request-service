export interface CalculationResult {
  productId: number;
  productName: string;
  materialId: number;
  materialName: string;
  lossPercent: number;
  quantity: number;
  basePerUnit: number;
  baseTotal: number;
  requiredTotal: number;
}

export interface CalculateLossFormData {
  productId: string;
  quantity: string;
}
