import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QualityHandler } from '../handler';
import type { ExtendDeadlineDTO } from '../types';

export const useOverdueRequests = () =>
  useQuery({
    queryKey: ['quality', 'overdue'],
    queryFn: () => QualityHandler.getOverdueRequests(),
  });

export const useExtendDeadline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ExtendDeadlineDTO }) =>
      QualityHandler.extendDeadline(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quality', 'overdue'] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
};

