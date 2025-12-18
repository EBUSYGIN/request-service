import { axiosInstance } from '@/shared/lib/axiosInstance';
import { WorkshopAPI } from '../api';
import type { WorkshopInstance } from '../types';

const getAllWorkshops = async (): Promise<WorkshopInstance[]> => {
  try {
    const serverResponse = await axiosInstance.get(WorkshopAPI.default());
    const workshops: WorkshopInstance[] = serverResponse.data.workshops;
    return workshops;
  } catch (e) {
    console.log('Ошибка получения цехов');
    if (e instanceof Error) {
      throw e;
    }

    throw new Error('Ошибка получения цехов');
  }
};

export const WorkshopsHandler = {
  getAllWorkshops,
};
