import { ProductCard } from '@/entities/product/ui';

import { useProducts } from '@/entities/product/hooks';

import styles from './ProductsList.module.css';

export function ProductList() {
  const { data: products, refetch } = useProducts();

  return (
    <>
      <div className={styles.listTitle}>Вся доступная продукция</div>
      <ul className={styles.productsList}>
        {products &&
          products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              productionTime={
                product?.workshops[0]?.productionTime || 'Неизвестно'
              }
              material={product.material.name}
              refetch={refetch}
            />
          ))}
      </ul>
    </>
  );
}
