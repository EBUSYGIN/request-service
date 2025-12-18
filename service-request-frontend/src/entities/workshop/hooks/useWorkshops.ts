import { useQuery } from '@tanstack/react-query';
import { WorkshopsHandler } from '../handler';

export const useWorkshops = () =>
  useQuery({
    queryKey: ['workshops'],
    queryFn: () => WorkshopsHandler.getAllWorkshops(),
  });
