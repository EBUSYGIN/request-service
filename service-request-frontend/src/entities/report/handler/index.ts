import { axiosInstance } from '@/shared/lib/axiosInstance';
import { ReportsAPI } from '../api';
import type { CompletedReport, AvgTimeReport, ProblemReport } from '../types';

const getCompletedCount = async (from?: string, to?: string): Promise<CompletedReport> => {
  const response = await axiosInstance.get(ReportsAPI.getCompleted(from, to));
  return response.data;
};

const getAvgCompletionTime = async (): Promise<AvgTimeReport> => {
  const response = await axiosInstance.get(ReportsAPI.getAvgTime());
  return response.data;
};

const getByProblem = async (): Promise<ProblemReport[]> => {
  const response = await axiosInstance.get(ReportsAPI.getByProblem());
  return response.data;
};

export const ReportsHandler = {
  getCompletedCount,
  getAvgCompletionTime,
  getByProblem,
};

