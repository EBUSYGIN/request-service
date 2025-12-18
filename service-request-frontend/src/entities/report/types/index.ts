// Статистика по выполненным заявкам
export interface CompletedReport {
  count: number;
}

// Среднее время выполнения
export interface AvgTimeReport {
  avgHours: number;
}

// Статистика по типам проблем
export interface ProblemReport {
  problemDescription: string;
  count: number;
}

// Параметры фильтра для отчётов
export interface ReportFilters {
  from?: string;
  to?: string;
}

