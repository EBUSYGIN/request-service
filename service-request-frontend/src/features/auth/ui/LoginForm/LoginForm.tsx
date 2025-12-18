import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { Button, Input } from '@/shared/ui';
import { useAuth } from '../../context/AuthContext';
import { AuthHandler } from '../../handler';
import type { LoginFormData } from './LoginForm.types';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await AuthHandler.login(data);
      login(response.accessToken, response.user);
      toast.success('Успешный вход!');
      navigate(from, { replace: true });
    } catch {
      toast.error('Неверный логин или пароль');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Вход в систему</h1>
      <p className={styles.subtitle}>Введите данные для входа</p>

      <Input
        label='Логин'
        placeholder='Введите логин'
        error={errors.login?.message}
        {...register('login', { required: 'Логин обязателен' })}
      />

      <Input
        label='Пароль'
        type='password'
        placeholder='Введите пароль'
        error={errors.password?.message}
        {...register('password', { required: 'Пароль обязателен' })}
      />

      <Button
        type='submit'
        appearance='primary'
        size='m'
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Вход...' : 'Войти'}
      </Button>
    </form>
  );
}

