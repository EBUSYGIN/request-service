import { useAuth } from '@/features/auth/context/AuthContext';
import type { UserRole } from '@/features/auth/types';

export function useRole() {
  const { user, hasRole } = useAuth();

  return {
    role: user?.role ?? null,
    hasRole,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isUser: user?.role === 'user',
    checkRoles: (roles: UserRole[]) => hasRole(roles),
  };
}

