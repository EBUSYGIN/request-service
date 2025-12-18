import { useWorkshops } from '@/entities/workshop/hooks';

import styles from './WorkshopsList.module.css';
import { Workshop } from '@/entities/workshop/ui';

export function WorkshopsList() {
  const { data: workshops } = useWorkshops();

  console.log(workshops);

  return (
    <>
      <div className={styles.listTitle}>Все доступные цеха</div>
      <ul className={styles.productsList}>
        {workshops &&
          workshops.map((workshop) => (
            <Workshop
              key={workshop.id}
              name={workshop.name}
              type={workshop.type}
              workers={workshop.workers}
              products={workshop.products}
            />
          ))}
      </ul>
    </>
  );
}
