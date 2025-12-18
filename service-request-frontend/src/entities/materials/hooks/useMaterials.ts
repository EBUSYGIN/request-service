import { useQuery } from '@tanstack/react-query';
import { materialsHandler } from '../handler';

export const useMaterials = () =>
  useQuery({
    queryKey: ['materials'],
    queryFn: () => materialsHandler.getAllMaterials(),
  });
