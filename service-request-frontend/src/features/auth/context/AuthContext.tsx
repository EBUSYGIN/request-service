import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, RoleName, ROLE_PERMISSIONS } from '../types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hasRole: (allowedRoles: RoleName[]) => boolean;
  hasPermission: (permission: keyof typeof ROLE_PERMISSIONS[RoleName]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('accessToken');
  });

  const isAuthenticated = !!accessToken && !!user;

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (allowedRoles: RoleName[]) => {
      if (!user) return false;
      // Роль теперь строка напрямую
      return allowedRoles.includes(user.role as RoleName);
    },
    [user]
  );

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false;
      const roleName = user.role as RoleName;
      const permissions = {
        'Менеджер': ['requests', 'users', 'reports', 'quality', 'create-request', 'edit-request', 'assign-master'],
        'Специалист': ['requests', 'my-requests', 'edit-own-request'],
        'Оператор': ['requests', 'assign-master', 'create-request'],
        'Заказчик': ['my-requests', 'view-request'],
      };
      return permissions[roleName]?.includes(permission) ?? false;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isAuthenticated, login, logout, hasRole, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
