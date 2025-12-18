import { UpdateCreateProductForm } from '@/features/update-create-product/ui';
import { Card } from '@/shared/ui';

export function UpdateProductPage() {
  return (
    <Card>
      <UpdateCreateProductForm
        title='Редактирование продукта'
        buttonText='Редактировать'
        toastSuccess={'Редактирование успешно'}
        toastError={'Ошибка редактирования'}
      />
    </Card>
  );
}
