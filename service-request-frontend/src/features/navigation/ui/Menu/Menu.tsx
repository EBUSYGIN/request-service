import { NavLink } from 'react-router';
import cn from 'classnames';
import { Icon } from '@/shared/ui';
import { useAuth } from '@/features/auth/context/AuthContext';
import type { RoleName } from '@/features/auth/types';

import styles from './Menu.module.css';

// Конфигурация меню для каждой роли
const MENU_CONFIG: Record<RoleName, Array<{ path: string; label: string; icon: keyof typeof Icon }>> = {
  'Менеджер': [
    { path: '/requests', label: 'Заявки', icon: 'ProductsList' },
    { path: '/users', label: 'Создать пользователя', icon: 'Workshop' },
    { path: '/reports', label: 'Статистика', icon: 'OrderCalc' },
  ],
  'Специалист': [
    { path: '/requests', label: 'Мои заявки', icon: 'ProductsList' },
  ],
  'Оператор': [
    { path: '/requests', label: 'Заявки', icon: 'ProductsList' },
  ],
  'Заказчик': [
    { path: '/requests', label: 'Мои заявки', icon: 'ProductsList' },
  ],
};

export function Menu() {
  const { user } = useAuth();
  
  // Роль теперь строка напрямую
  const roleName = user?.role as RoleName;
  const menuItems = roleName ? MENU_CONFIG[roleName] || [] : [];

  return (
    <nav className={styles.menu}>
      <div className={styles.title}>Главное меню</div>
      <ul className={styles.list}>
        {menuItems.map((item) => {
          const IconComponent = Icon[item.icon];
          return (
            <NavLink
              key={item.path}
              className={({ isActive }) =>
                cn(styles.link, { [styles.active]: isActive })
              }
              to={item.path}
            >
              {IconComponent && <IconComponent />}
              {item.label}
            </NavLink>
          );
        })}
      </ul>
    </nav>
  );
}
