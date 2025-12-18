import { axiosInstance } from '@/shared/lib/axiosInstance';
import { QualityAPI } from '../api';
import type { OverdueRequest, ExtendDeadlineDTO } from '../types';
import type { ServiceRequest } from '@/entities/request/types';

const getOverdueRequests = async (): Promise<OverdueRequest[]> => {
  const response = await axiosInstance.get(QualityAPI.getOverdue());
  return response.data;
};

const extendDeadline = async (id: number, data: ExtendDeadlineDTO): Promise<ServiceRequest> => {
  const response = await axiosInstance.patch(QualityAPI.extendDeadline(id), data);
  return response.data;
};

export const QualityHandler = {
  getOverdueRequests,
  extendDeadline,
};

