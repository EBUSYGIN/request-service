import { API_URL } from '@/shared/config/api';

export const ReportsAPI = {
  getCompleted: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const query = params.toString();
    return `${API_URL}/reports/completed${query ? `?${query}` : ''}`;
  },
  getAvgTime: () => `${API_URL}/reports/avg-completion-time`,
  getByProblem: () => `${API_URL}/reports/by-problem`,
};

