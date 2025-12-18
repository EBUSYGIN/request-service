import { Navigate } from 'react-router';
import { LoginForm } from '@/features/auth/ui';
import { useAuth } from '@/features/auth/context/AuthContext';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const { isAuthenticated } = useAuth();

  // Если уже авторизован - редирект на главную
  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <LoginForm />
      </div>
    </div>
  );
}

