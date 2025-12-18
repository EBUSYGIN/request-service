import { Outlet } from 'react-router';

import styles from './RootLayout.module.css';
import { Footer, Header, Sidebar } from '@/widgets';

export function RootLayout() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Sidebar />
        <div className={styles.mainContentWrapper}>
          <Header />
          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
