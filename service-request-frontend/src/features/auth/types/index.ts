// Роли в системе
export type RoleName = 'Менеджер' | 'Специалист' | 'Оператор' | 'Заказчик';

export interface User {
  id: number;
  fio: string;
  phone?: string;
  login: string;
  role: RoleName; // Роль как строка
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

// Права ролей
export const ROLE_PERMISSIONS = {
  'Менеджер': ['requests', 'users', 'reports', 'quality', 'create-request', 'edit-request', 'assign-master'],
  'Специалист': ['requests', 'my-requests', 'edit-own-request'],
  'Оператор': ['requests', 'assign-master', 'create-request'],
  'Заказчик': ['my-requests', 'view-request'],
} as const;
