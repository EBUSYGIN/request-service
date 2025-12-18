import { useQuery } from '@tanstack/react-query';
import { ReportsHandler } from '../handler';

export const useCompletedReport = (from?: string, to?: string) =>
  useQuery({
    queryKey: ['reports', 'completed', from, to],
    queryFn: () => ReportsHandler.getCompletedCount(from, to),
  });

export const useAvgTimeReport = () =>
  useQuery({
    queryKey: ['reports', 'avg-time'],
    queryFn: () => ReportsHandler.getAvgCompletionTime(),
  });

export const useProblemReport = () =>
  useQuery({
    queryKey: ['reports', 'by-problem'],
    queryFn: () => ReportsHandler.getByProblem(),
  });

export const useReports = (from?: string, to?: string) => {
  const completed = useCompletedReport(from, to);
  const avgTime = useAvgTimeReport();
  const byProblem = useProblemReport();

  return {
    completed,
    avgTime,
    byProblem,
    isLoading: completed.isLoading || avgTime.isLoading || byProblem.isLoading,
  };
};

