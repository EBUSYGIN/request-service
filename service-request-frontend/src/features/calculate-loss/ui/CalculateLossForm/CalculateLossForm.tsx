import { useProducts } from '@/entities/product/hooks';
import { Button, Card, Input, Select, Title } from '@/shared/ui';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useCalculateLoss } from '../../hooks';
import type { CalculateLossFormData } from './CalculateLossForm.types';
import styles from './CalculateLossForm.module.css';

export function CalculateLossForm() {
  const { data: products } = useProducts();
  const {
    mutate,
    data: calculationResult,
    isPending,
    isError,
  } = useCalculateLoss();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CalculateLossFormData>();

  const onSubmit: SubmitHandler<CalculateLossFormData> = (data) => {
    const productId = Number(data.productId);
    const quantity = Number(data.quantity);

    if (productId && quantity > 0) {
      mutate({ productId, quantity });
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <Card className={styles.card}>
      <Title tag='h1' size='xl' className={styles.title}>
        Калькулятор расхода сырья
      </Title>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formFields}>
          <Select
            optionsItems={products || []}
            valueToReturn='id'
            label='Продукт'
            {...register('productId', {
              required: 'Выберите продукт',
            })}
            error={errors.productId?.message}
          />
          <Input
            type='number'
            placeholder='Введите количество'
            label='Количество продукции'
            {...register('quantity', {
              required: 'Введите количество',
              min: {
                value: 1,
                message: 'Количество должно быть больше 0',
              },
              validate: (value) => {
                const num = Number(value);
                if (!Number.isInteger(num)) {
                  return 'Количество должно быть целым числом';
                }
                return true;
              },
            })}
            error={errors.quantity?.message}
          />
        </div>
        <div className={styles.submitButtonWrapper}>
          <Button
            appearance='primary'
            size='sm'
            typeOf='button'
            type='submit'
            disabled={isPending}
          >
            {isPending ? 'Расчет...' : 'Рассчитать'}
          </Button>
        </div>
      </form>

      {isError && (
        <div className={styles.errorMessage}>
          Произошла ошибка при расчете. Проверьте правильность введенных данных.
        </div>
      )}

      {calculationResult && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <Title tag='h3' size='xl'>
              Результаты расчета
            </Title>
          </div>

          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Продукт:</span>
              <span className={styles.resultValue}>
                {calculationResult.productName}
              </span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Материал:</span>
              <span className={styles.resultValue}>
                {calculationResult.materialName}
              </span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Количество продукции:</span>
              <span className={styles.resultValue}>
                {calculationResult.quantity} шт.
              </span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Процент потерь:</span>
              <span className={styles.resultValue}>
                {(calculationResult.lossPercent * 100).toFixed(3)}%
              </span>
            </div>
          </div>

          <div className={styles.resultTotals}>
            <div className={styles.totalItem}>
              <span className={styles.totalLabel}>Расход на единицу:</span>
              <span className={styles.totalValue}>
                {formatNumber(calculationResult.basePerUnit)}
              </span>
            </div>
            <div className={styles.totalItem}>
              <span className={styles.totalLabel}>
                Общий расход (без потерь):
              </span>
              <span className={styles.totalValue}>
                {formatNumber(calculationResult.baseTotal)}
              </span>
            </div>
            <div className={`${styles.totalItem} ${styles.highlight}`}>
              <span className={styles.totalLabel}>
                Требуемое количество сырья:
              </span>
              <span className={`${styles.totalValue} ${styles.requiredTotal}`}>
                {formatNumber(calculationResult.requiredTotal)}
              </span>
            </div>
          </div>

          <div className={styles.lossInfo}>
            С учетом потерь материала (
            {formatNumber(calculationResult.lossPercent * 100)}%)
          </div>
        </div>
      )}
    </Card>
  );
}
