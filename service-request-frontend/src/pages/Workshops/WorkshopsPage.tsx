import { Card, Title } from '@/shared/ui';

import styles from './WorkshopsPage.module.css';
import { WorkshopsList } from '@/widgets';

export function WorkshopsPage() {
  return (
    <>
      <Card>
        <div className={styles.actions}>
          <Title tag='h2' size='xl' className={styles.pageTitle}>
            Производственные цеха
          </Title>
        </div>
        <WorkshopsList />
      </Card>
    </>
  );
}
