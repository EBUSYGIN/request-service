import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  Title,
  Button,
  Table,
  StatusBadge,
  Loading,
  Modal,
  Textarea,
} from '@/shared/ui';
import { useOverdueRequests, useExtendDeadline } from '@/entities/quality/hooks/useQuality';
import type { OverdueRequest, ExtendDeadlineDTO } from '@/entities/quality/types';
import type { Column } from '@/shared/ui';
import styles from './QualityPage.module.css';

export function QualityPage() {
  const navigate = useNavigate();
  const { data: overdueRequests = [], isLoading } = useOverdueRequests();
  const extendDeadline = useExtendDeadline();

  const [selectedRequest, setSelectedRequest] = useState<OverdueRequest | null>(null);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExtendDeadlineDTO>();

  const columns: Column<OverdueRequest>[] = [
    {
      key: 'number',
      header: '№',
      width: '80px',
    },
    {
      key: 'startDate',
      header: 'Дата начала',
      render: (item) => new Date(item.startDate).toLocaleDateString('ru-RU'),
    },
    {
      key: 'plannedCompletionDate',
      header: 'План. завершение',
      render: (item) => (
        <span className={styles.overdueDate}>
          {item.plannedCompletionDate
            ? new Date(item.plannedCompletionDate).toLocaleDateString('ru-RU')
            : '—'}
        </span>
      ),
    },
    {
      key: 'client',
      header: 'Клиент',
      render: (item) => item.client?.fio || '—',
    },
    {
      key: 'master',
      header: 'Мастер',
      render: (item) => item.master?.fio || 'Не назначен',
    },
    {
      key: 'status',
      header: 'Статус',
      render: (item) => <StatusBadge status={item.status?.name || 'Новая'} />,
    },
    {
      key: 'problemDescription',
      header: 'Проблема',
      render: (item) =>
        item.problemDescription.length > 40
          ? `${item.problemDescription.slice(0, 40)}...`
          : item.problemDescription,
    },
    {
      key: 'actions',
      header: '',
      width: '200px',
      render: (item) => (
        <div className={styles.actionsCell}>
          <Button
            size='s'
            appearance='ghost-blue'
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/requests/${item.id}`);
            }}
          >
            Подробнее
          </Button>
          <Button
            size='s'
            appearance='primary'
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRequest(item);
              setIsExtendModalOpen(true);
            }}
          >
            Продлить
          </Button>
        </div>
      ),
    },
  ];

  const onExtendSubmit = async (data: ExtendDeadlineDTO) => {
    if (!selectedRequest) return;

    try {
      await extendDeadline.mutateAsync({
        id: selectedRequest.id,
        data: {
          plannedCompletionDate: new Date(data.plannedCompletionDate).toISOString(),
          reason: data.reason,
        },
      });
      toast.success('Срок продлён');
      setIsExtendModalOpen(false);
      setSelectedRequest(null);
      reset();
    } catch {
      toast.error('Ошибка продления срока');
    }
  };

  if (isLoading) {
    return <Loading fullPage text='Загрузка просроченных заявок...' />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Title>Контроль качества</Title>
        <p className={styles.subtitle}>
          Просроченные заявки, требующие внимания
        </p>
      </div>

      {/* Статистика */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚠️</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{overdueRequests.length}</span>
            <span className={styles.statLabel}>Просроченных заявок</span>
          </div>
        </div>
      </div>

      {/* Таблица */}
      <div className={styles.tableWrapper}>
        <Table
          columns={columns}
          data={overdueRequests}
          onRowClick={(item) => navigate(`/requests/${item.id}`)}
          emptyMessage='Просроченных заявок нет'
        />
      </div>

      {/* Модальное окно продления срока */}
      <Modal
        isOpen={isExtendModalOpen}
        onClose={() => {
          setIsExtendModalOpen(false);
          setSelectedRequest(null);
          reset();
        }}
        title={`Продлить срок заявки №${selectedRequest?.number}`}
        footer={
          <>
            <Button
              appearance='default'
              onClick={() => {
                setIsExtendModalOpen(false);
                setSelectedRequest(null);
                reset();
              }}
            >
              Отмена
            </Button>
            <Button
              appearance='primary'
              onClick={handleSubmit(onExtendSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : 'Продлить'}
            </Button>
          </>
        }
      >
        <form className={styles.formGrid}>
          <div>
            <label className={styles.inputLabel}>Новая дата завершения</label>
            <input
              type='datetime-local'
              className={styles.dateInput}
              {...register('plannedCompletionDate', {
                required: 'Выберите дату',
              })}
            />
            {errors.plannedCompletionDate && (
              <span style={{ color: 'var(--warning)', fontSize: 13 }}>
                {errors.plannedCompletionDate.message}
              </span>
            )}
          </div>

          <Textarea
            label='Причина продления'
            placeholder='Укажите причину продления срока...'
            {...register('reason')}
          />
        </form>
      </Modal>
    </div>
  );
}

