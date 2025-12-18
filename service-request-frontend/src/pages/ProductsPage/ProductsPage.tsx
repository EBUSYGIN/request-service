import { Button, Card, Title } from '@/shared/ui';
import { ProductList } from '@/widgets';

import styles from './ProductsPage.module.css';

export function ProductsPage() {
  return (
    <>
      <Card>
        <div className={styles.actions}>
          <Title tag='h2' size='xl' className={styles.pageTitle}>
            Продукция
          </Title>
          <Button
            typeOf='link'
            appearance='primary'
            size='sm'
            path='/product/create'
          >
            Добавить продукцию
          </Button>
        </div>
        <ProductList />
      </Card>
    </>
  );
}
