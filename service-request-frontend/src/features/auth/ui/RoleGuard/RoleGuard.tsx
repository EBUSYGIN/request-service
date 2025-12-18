import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { RoleName } from '../../types';

interface RoleGuardProps {
  allowedRoles: RoleName[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { hasRole } = useAuth();

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
