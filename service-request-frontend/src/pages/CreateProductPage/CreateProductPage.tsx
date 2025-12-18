import { UpdateCreateProductForm } from '@/features/update-create-product/ui';
import { Card } from '@/shared/ui';

export function CreateProductPage() {
  return (
    <Card>
      <UpdateCreateProductForm
        title='Создание продукта'
        buttonText='Создать продукт'
        toastSuccess={'Продукт создан'}
        toastError={'Ошибка создания'}
      />
    </Card>
  );
}
