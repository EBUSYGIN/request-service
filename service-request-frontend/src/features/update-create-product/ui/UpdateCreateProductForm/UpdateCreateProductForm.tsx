import { Button, Input, Select, Title } from '@/shared/ui';
import type {
  CreateProductForm,
  UpdateCreateProductFormProps,
} from './UpdateCreateProductForm.types';

import styles from './UpdateCreateProductForm.module.css';
import { useProductTypes } from '@/entities/product/hooks';
import { useMaterials } from '@/entities/materials/hooks';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { ProductsHandler } from '@/entities/product/handler';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';

export function UpdateCreateProductForm({
  title,
  buttonText,
  toastSuccess,
  toastError,
}: UpdateCreateProductFormProps) {
  const { data: types } = useProductTypes();
  const { data: materials } = useMaterials();
  const productId = useParams().id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductForm>();

  const onSubmit: SubmitHandler<CreateProductForm> = async (data) => {
    console.log(data);
    const result = await ProductsHandler.createUpdateProduct(data, productId);
    if (!result) {
      toast.error(toastError);
    } else {
      toast.success(toastSuccess);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Title tag={'h2'} size={'xl'}>
        {title}
      </Title>
      <div>
        <Input
          {...register('name', { required: 'Поле обязательно к заполнению' })}
          name='name'
          placeholder='Введите название'
          label='Название продукта'
          error={errors.name?.message}
        />
        <Select
          optionsItems={types || []}
          valueToReturn='id'
          label='Тип продукта'
          {...register('typeId')}
          error={errors.typeId?.message}
        />
        <Select
          optionsItems={materials || []}
          valueToReturn={'id'}
          label='Материал'
          {...register('materialId')}
          error={errors.materialId?.message}
        />
        <Input
          type='number'
          placeholder='Введите мин. цену'
          label='Мин. цена'
          {...register('minPrice', {
            required: 'Поле обязательно к заполнению',
          })}
          error={errors.minPrice?.message}
        />
      </div>
      <div className={styles.submitButtonWrapper}>
        <Button appearance='primary' size='sm'>
          {buttonText}
        </Button>
      </div>
    </form>
  );
}
