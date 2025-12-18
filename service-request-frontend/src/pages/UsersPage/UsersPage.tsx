import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Title, Button, Input, Select } from '@/shared/ui';
import { useCreateUser } from '@/entities/user/hooks/useUsers';
import type { CreateUserDTO } from '@/entities/user/types';
import styles from './UsersPage.module.css';
import { AxiosError } from 'axios';

// Бэкенд принимает только эти роли для создания!
const ALLOWED_ROLES: Array<'Админ' | 'Менеджер'> = ['Админ', 'Менеджер'];

interface ValidationError {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

export function UsersPage() {
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserDTO>();

  const onCreateSubmit = async (data: CreateUserDTO) => {
    try {
      await createUser.mutateAsync(data);
      toast.success('Пользователь успешно создан!');
      reset();
    } catch (err) {
      const error = err as AxiosError<ValidationError>;
      const responseData = error.response?.data;
      
      if (error.response?.status === 400 || error.response?.status === 409) {
        const message = responseData?.message;
        
        if (Array.isArray(message)) {
          message.forEach((msg) => {
            const msgLower = msg.toLowerCase();
            if (msgLower.includes('phone')) {
              setError('phone', { type: 'manual', message: msg });
            } else if (msgLower.includes('login') || msgLower.includes('логин')) {
              setError('login', { type: 'manual', message: msg });
            } else if (msgLower.includes('fio') || msgLower.includes('фио')) {
              setError('fio', { type: 'manual', message: msg });
            } else if (msgLower.includes('password') || msgLower.includes('пароль')) {
              setError('password', { type: 'manual', message: msg });
            } else if (msgLower.includes('role') || msgLower.includes('роль')) {
              setError('roleName', { type: 'manual', message: msg });
            } else {
              toast.error(msg);
            }
          });
        } else if (typeof message === 'string') {
          const msgLower = message.toLowerCase();
          if (msgLower.includes('phone')) {
            setError('phone', { type: 'manual', message });
          } else if (msgLower.includes('login') || msgLower.includes('логин') || msgLower.includes('существует')) {
            setError('login', { type: 'manual', message });
          } else {
            toast.error(message);
          }
        } else {
          toast.error('Ошибка валидации данных');
        }
      } else {
        toast.error('Ошибка создания пользователя');
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Title>Создание пользователя</Title>
      </div>

      <div className={styles.formCard}>
        <form className={styles.formGrid} onSubmit={handleSubmit(onCreateSubmit)}>
          <Input
            label='ФИО'
            placeholder='Иванов Иван Иванович'
            error={errors.fio?.message}
            {...register('fio', { required: 'ФИО обязательно' })}
          />

          <div className={styles.formRow}>
            <Input
              label='Телефон'
              placeholder='+79991234567'
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Телефон обязателен',
              })}
            />

            <Select
              label='Роль'
              error={errors.roleName?.message}
              {...register('roleName', { required: 'Выберите роль' })}
            >
              <option value=''>Выберите роль</option>
              {ALLOWED_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </div>

          <div className={styles.formRow}>
            <Input
              label='Логин'
              placeholder='login'
              error={errors.login?.message}
              {...register('login', {
                required: 'Логин обязателен',
                minLength: { value: 3, message: 'Минимум 3 символа' },
              })}
            />

            <Input
              label='Пароль'
              type='password'
              placeholder='••••••••'
              error={errors.password?.message}
              {...register('password', {
                required: 'Пароль обязателен',
                minLength: { value: 4, message: 'Минимум 4 символа' },
              })}
            />
          </div>

          <div className={styles.formActions}>
            <Button type='button' appearance='default' onClick={() => reset()}>
              Очистить
            </Button>
            <Button type='submit' appearance='primary' disabled={isSubmitting}>
              {isSubmitting ? 'Создание...' : 'Создать пользователя'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
