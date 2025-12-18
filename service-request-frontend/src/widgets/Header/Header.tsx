import { useNavigate } from 'react-router';
import { Icon, Button } from '@/shared/ui';
import { useAuth } from '@/features/auth/context/AuthContext';
import styles from './Header.module.css';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>Сервис заявок</h1>
        <Icon.Logo className={styles.icon} />
      </div>

      <div className={styles.userInfo}>
        <Icon.Notifications />
        <div className={styles.userBlock}>
          <span className={styles.userName}>{user?.fio || 'Пользователь'}</span>
          <span className={styles.userRole}>
            {user?.role || 'Роль не определена'}
          </span>
        </div>
        <Button
          appearance='ghost-blue'
          size='s'
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Выход
        </Button>
      </div>
    </header>
  );
}
