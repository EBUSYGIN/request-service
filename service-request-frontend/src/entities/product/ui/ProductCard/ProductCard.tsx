import { memo } from 'react';
import { Button, Card, Title } from '@/shared/ui';
import type { ProductCardProps } from './ProductCard.types';

import styles from './ProductCard.module.css';
import { ProductsHandler } from '../../handler';

export const ProductCard = memo(
  ({
    name,
    article,
    minPrice,
    material,
    productionTime,
    id,
    refetch,
  }: ProductCardProps) => {
    const handleDeletion = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      await ProductsHandler.deleteProduct(id);
      await refetch();
    };

    return (
      <Card className={styles.productCard}>
        <div className={styles.info}>
          <Title tag={'h6'} size={'l'}>
            {name}
          </Title>
          <span>Артикль: {article}</span>
          <span>
            Мин. цена:{' '}
            {new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
            }).format(minPrice)}
          </span>
          <span>Материал: {material}</span>
        </div>

        <div>
          <span>Время на производство: {productionTime} час</span>
          <div className={styles.actions}>
            <Button
              size='s'
              typeOf='link'
              path={`/product/${id}`}
              appearance='ghost-blue'
            >
              Изменить
            </Button>
            <Button
              appearance='danger'
              size='s'
              className={styles.delete}
              onClick={handleDeletion}
            >
              Удалить
            </Button>
          </div>
        </div>
      </Card>
    );
  }
);
