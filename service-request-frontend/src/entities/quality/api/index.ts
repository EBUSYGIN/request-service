import { API_URL } from '@/shared/config/api';

export const QualityAPI = {
  getOverdue: () => `${API_URL}/quality/overdue`,
  extendDeadline: (id: number) => `${API_URL}/quality/requests/${id}/deadline`,
};

