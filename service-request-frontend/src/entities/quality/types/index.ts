import type { ServiceRequest } from '@/entities/request/types';

// Просроченная заявка (те же поля что и ServiceRequest)
export type OverdueRequest = ServiceRequest;

// DTO для продления срока
export interface ExtendDeadlineDTO {
  plannedCompletionDate: string;
  reason?: string;
}

