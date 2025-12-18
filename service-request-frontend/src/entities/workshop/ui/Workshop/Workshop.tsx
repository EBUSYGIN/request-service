import { Title, Card } from '@/shared/ui';

import type { WorkshopProps } from './Workshop.types';
import styles from './Workshop.module.css';

export function Workshop({ name, type, workers, products }: WorkshopProps) {
  console.log(products);

  return (
    <Card className={styles.workshopCard}>
      <div className={styles.info}>
        <Title tag={'h6'} size={'l'}>
          {name}
        </Title>
        <div>Тип: {type}</div>
        {/* <div className={styles.prod}>
          Производимая продукция:
          {products.map((product) => (
            <div key={product.id}>{product.product.name}</div>
          ))}
        </div> */}
      </div>

      <div className={styles.actions}>Количество рабочих: {workers}</div>
    </Card>
  );
}
