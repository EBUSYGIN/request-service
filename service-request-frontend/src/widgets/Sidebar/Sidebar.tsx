import { Menu } from '@/features/navigation/ui';

import styles from './Sidebar.module.css';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Menu />
    </aside>
  );
}
