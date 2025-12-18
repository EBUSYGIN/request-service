import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import {
  Title,
  Button,
  Select,
  Input,
  Loading,
  StatusBadge,
  Textarea,
} from '@/shared/ui';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  useRequest,
  useUpdateStatus,
  useAssignMaster,
  useAddComment,
} from '@/entities/request/hooks/useRequests';
import { UsersHandler } from '@/entities/user/handler';
import type { User } from '@/entities/user/types';
import styles from './RequestDetailPage.module.css';

// Список возможных статусов
const STATUSES = [
  'Новая заявка',
  'В работе',
  'Ожидает запчасти',
  'Готова к выдаче',
  'Выполнена',
];

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole, user } = useAuth();
  const requestId = Number(id);

  const { data: request, isLoading } = useRequest(requestId);
  const { data: allUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => UsersHandler.getAllUsers(),
  });

  // Специалисты (мастера)
  const specialists = allUsers.filter((u) => u.role.name === 'Специалист');

  const updateStatus = useUpdateStatus();
  const assignMaster = useAssignMaster();
  const addComment = useAddComment();

  const [newStatus, setNewStatus] = useState('');
  const [newMasterId, setNewMasterId] = useState('');

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{ message: string }>();

  const handleStatusChange = async () => {
    if (!newStatus) return;
    try {
      await updateStatus.mutateAsync({ id: requestId, data: { statusName: newStatus } });
      toast.success('Статус обновлён');
      setNewStatus('');
    } catch {
      toast.error('Ошибка обновления статуса');
    }
  };

  const handleMasterChange = async () => {
    if (!newMasterId) return;
    try {
      await assignMaster.mutateAsync({ id: requestId, data: { masterId: Number(newMasterId) } });
      toast.success('Мастер назначен');
      setNewMasterId('');
    } catch {
      toast.error('Ошибка назначения мастера');
    }
  };

  const onCommentSubmit = async (data: { message: string }) => {
    try {
      await addComment.mutateAsync({ requestId, data });
      toast.success('Комментарий добавлен');
      reset();
    } catch {
      toast.error('Ошибка добавления комментария');
    }
  };

  const canEditStatus = hasRole(['Менеджер', 'Специалист']);
  const canAssignMaster = hasRole(['Менеджер']);
  const canComment = hasRole(['Менеджер', 'Специалист']);

  // Специалист может видеть только свои заявки
  const isOwnRequest = request?.masterId === user?.id || request?.clientId === user?.id;
  const canViewRequest = hasRole(['Менеджер', 'Оператор']) || isOwnRequest;

  if (isLoading) {
    return <Loading fullPage text='Загрузка заявки...' />;
  }

  if (!request) {
    return (
      <div className={styles.page}>
        <Title>Заявка не найдена</Title>
        <Button onClick={() => navigate('/requests')}>Назад к списку</Button>
      </div>
    );
  }

  if (!canViewRequest) {
    return (
      <div className={styles.page}>
        <Title>Нет доступа</Title>
        <Button onClick={() => navigate('/requests')}>Назад к списку</Button>
      </div>
    );
  }

  const isCompleted = request.completionDate !== null;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button
          appearance='default'
          size='sm'
          className={styles.backButton}
          onClick={() => navigate('/requests')}
        >
          ← Назад
        </Button>
        <h1 className={styles.title}>Заявка №{request.number}</h1>
      </div>

      <div className={styles.content}>
        {/* Основная информация */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Информация о заявке</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Номер</span>
                <span className={styles.infoValueLarge}>{request.number}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Статус</span>
                <StatusBadge status={request.status?.name || 'Новая'} />
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Дата создания</span>
                <span className={styles.infoValue}>
                  {new Date(request.startDate).toLocaleString('ru-RU')}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Дата завершения</span>
                <span className={styles.infoValue}>
                  {request.completionDate
                    ? new Date(request.completionDate).toLocaleString('ru-RU')
                    : '—'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Клиент</span>
                <span className={styles.infoValue}>
                  {request.client?.fio}
                  <br />
                  <small style={{ color: 'var(--ghost)' }}>{request.client?.phone}</small>
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Мастер</span>
                <span className={styles.infoValue}>
                  {request.master?.fio || <em style={{ color: 'var(--ghost)' }}>Не назначен</em>}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Оборудование</span>
                <span className={styles.infoValue}>
                  {request.equipment?.model?.equipmentType?.name || '—'} -{' '}
                  {request.equipment?.model?.name || '—'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Запчасти</span>
                <span className={styles.infoValue}>
                  {request.repairParts || <em style={{ color: 'var(--ghost)' }}>—</em>}
                </span>
              </div>

              <div className={`${styles.infoItem} ${styles.description}`}>
                <span className={styles.infoLabel}>Описание проблемы</span>
                <p className={styles.descriptionText}>{request.problemDescription}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Боковая панель с действиями */}
        <div>
          {/* Действия */}
          {(canEditStatus || canAssignMaster) && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Действия</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.actions}>
                  {canEditStatus && (
                    <div className={styles.actionItem}>
                      <Select
                        label='Изменить статус'
                        value={newStatus || request.status?.name || ''}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Select>
                      <Button
                        size='sm'
                        appearance='primary'
                        onClick={handleStatusChange}
                        disabled={!newStatus || newStatus === request.status?.name || updateStatus.isPending}
                      >
                        Сохранить
                      </Button>
                    </div>
                  )}

                  {canAssignMaster && (
                    <div className={styles.actionItem}>
                      <Select
                        label='Назначить мастера'
                        value={newMasterId || request.masterId?.toString() || ''}
                        onChange={(e) => setNewMasterId(e.target.value)}
                      >
                        <option value=''>Выберите мастера</option>
                        {specialists.map((s: User) => (
                          <option key={s.id} value={s.id}>
                            {s.fio}
                          </option>
                        ))}
                      </Select>
                      <Button
                        size='sm'
                        appearance='primary'
                        onClick={handleMasterChange}
                        disabled={!newMasterId || Number(newMasterId) === request.masterId || assignMaster.isPending}
                      >
                        Назначить
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* QR для оценки (если завершена) */}
          {isCompleted && (
            <div className={styles.card} style={{ marginTop: 24 }}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Оценка качества</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.qrSection}>
                  <span className={styles.qrTitle}>Заявка завершена</span>
                  <Button appearance='primary' size='sm'>
                    Оценить качество
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Комментарии */}
      <div className={`${styles.card} ${styles.commentsSection}`}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Комментарии</h2>
        </div>
        <div className={styles.cardContent}>
          {!request.comments || request.comments.length === 0 ? (
            <p className={styles.emptyComments}>Комментариев пока нет</p>
          ) : (
            <div className={styles.commentsList}>
              {request.comments.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>
                      {comment.author?.fio || 'Пользователь'}
                    </span>
                    <span className={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <p className={styles.commentText}>{comment.message}</p>
                </div>
              ))}
            </div>
          )}

          {canComment && (
            <form className={styles.commentForm} onSubmit={handleSubmit(onCommentSubmit)}>
              <Textarea
                placeholder='Напишите комментарий...'
                {...register('message', { required: true })}
              />
              <div className={styles.commentFormActions}>
                <Button type='submit' appearance='primary' size='sm' disabled={isSubmitting}>
                  {isSubmitting ? 'Отправка...' : 'Отправить'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
