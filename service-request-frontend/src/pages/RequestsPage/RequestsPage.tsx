import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  Title,
  Button,
  Select,
  Input,
  Table,
  StatusBadge,
  Pagination,
  Loading,
  Modal,
  Textarea,
  DateRangePicker,
} from '@/shared/ui';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useRequests, useCreateRequest } from '@/entities/request/hooks/useRequests';
import { UsersHandler } from '@/entities/user/handler';
import type { ServiceRequest, CreateRequestDTO, RequestFilters } from '@/entities/request/types';
import type { User } from '@/entities/user/types';
import type { Column } from '@/shared/ui';
import { useQuery } from '@tanstack/react-query';
import styles from './RequestsPage.module.css';

const ITEMS_PER_PAGE = 10;

export function RequestsPage() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [filters, setFilters] = useState<RequestFilters>({});
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: requests = [], isLoading } = useRequests();
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => UsersHandler.getClients(),
  });
  const { data: allUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => UsersHandler.getAllUsers(),
  });

  // Специалисты (мастера)
  const specialists = useMemo(
    () => allUsers.filter((u) => u.role.name === 'Специалист'),
    [allUsers]
  );

  const createRequest = useCreateRequest();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRequestDTO>();

  // Фильтрация на клиенте
  const filteredRequests = useMemo(() => {
    let result = requests;

    // Для специалиста показываем только его заявки
    if (hasRole(['Специалист'])) {
      result = result.filter((r) => r.masterId === user?.id);
    }

    // Для заказчика показываем только его заявки
    if (hasRole(['Заказчик'])) {
      result = result.filter((r) => r.clientId === user?.id);
    }

    // Фильтр по статусу
    if (filters.status) {
      result = result.filter((r) => r.status?.name === filters.status);
    }

    // Фильтр по мастеру
    if (filters.masterId) {
      result = result.filter((r) => r.masterId === filters.masterId);
    }

    // Фильтр по дате
    if (filters.from) {
      const fromDate = new Date(filters.from);
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter((r) => new Date(r.startDate) >= fromDate);
    }

    if (filters.to) {
      const toDate = new Date(filters.to);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((r) => new Date(r.startDate) <= toDate);
    }

    return result;
  }, [requests, filters, user?.id, hasRole]);

  // Уникальные статусы из заявок
  const statuses = useMemo(() => {
    const statusSet = new Set(requests.map((r) => r.status?.name).filter(Boolean));
    return Array.from(statusSet);
  }, [requests]);

  // Пагинация
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = filteredRequests.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const columns: Column<ServiceRequest>[] = [
    {
      key: 'number',
      header: '№',
      width: '80px',
    },
    {
      key: 'startDate',
      header: 'Дата',
      render: (item) => new Date(item.startDate).toLocaleDateString('ru-RU'),
    },
    {
      key: 'client',
      header: 'Клиент',
      render: (item) => (
        <div className={styles.clientCell}>
          <span className={styles.clientName}>{item.client?.fio}</span>
          <span className={styles.clientPhone}>{item.client?.phone}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      render: (item) => <StatusBadge status={item.status?.name || 'Новая'} />,
    },
    {
      key: 'master',
      header: 'Мастер',
      render: (item) =>
        item.master ? (
          <div className={styles.masterCell}>{item.master.fio}</div>
        ) : (
          <span className={styles.noMaster}>Не назначен</span>
        ),
    },
    {
      key: 'problemDescription',
      header: 'Описание',
      render: (item) =>
        item.problemDescription.length > 50
          ? `${item.problemDescription.slice(0, 50)}...`
          : item.problemDescription,
    },
    {
      key: 'actions',
      header: '',
      width: '120px',
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
        </div>
      ),
    },
  ];

  const handleFilterChange = (key: keyof RequestFilters, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
  };

  const onCreateSubmit = async (data: CreateRequestDTO) => {
    try {
      await createRequest.mutateAsync(data);
      toast.success('Заявка создана');
      setIsCreateModalOpen(false);
      reset();
    } catch {
      toast.error('Ошибка создания заявки');
    }
  };

  const canCreateRequest = hasRole(['Менеджер', 'Оператор']);

  if (isLoading) {
    return <Loading fullPage text='Загрузка заявок...' />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Title>
          {hasRole(['Специалист', 'Заказчик']) ? 'Мои заявки' : 'Заявки'}
        </Title>
        {canCreateRequest && (
          <Button appearance='primary' onClick={() => setIsCreateModalOpen(true)}>
            Создать заявку
          </Button>
        )}
      </div>

      {/* Фильтры */}
      <div className={styles.filters}>
        <div className={styles.filterItem}>
          <Select
            label='Статус'
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
          >
            <option value=''>Все статусы</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        <DateRangePicker
          fromValue={filters.from || ''}
          toValue={filters.to || ''}
          onFromChange={(v) => handleFilterChange('from', v)}
          onToChange={(v) => handleFilterChange('to', v)}
        />

        {hasRole(['Менеджер', 'Оператор']) && (
          <div className={styles.filterItem}>
            <Select
              label='Мастер'
              value={filters.masterId?.toString() || ''}
              onChange={(e) =>
                handleFilterChange('masterId', e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value=''>Все мастера</option>
              {specialists.map((s: User) => (
                <option key={s.id} value={s.id}>
                  {s.fio}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className={styles.filterActions}>
          <Button appearance='default' size='sm' onClick={handleResetFilters}>
            Сбросить
          </Button>
        </div>
      </div>

      {/* Таблица */}
      <div className={styles.tableWrapper}>
        <Table
          columns={columns}
          data={paginatedRequests}
          onRowClick={(item) => navigate(`/requests/${item.id}`)}
          emptyMessage='Заявки не найдены'
        />
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filteredRequests.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}

      {/* Модальное окно создания заявки */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title='Создать заявку'
        footer={
          <>
            <Button appearance='default' onClick={() => setIsCreateModalOpen(false)}>
              Отмена
            </Button>
            <Button
              appearance='primary'
              onClick={handleSubmit(onCreateSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Создание...' : 'Создать'}
            </Button>
          </>
        }
      >
        <form className={styles.formGrid}>
          <Select
            label='Клиент'
            error={errors.clientId?.message}
            {...register('clientId', { required: 'Выберите клиента', valueAsNumber: true })}
          >
            <option value=''>Выберите клиента</option>
            {clients.map((c: User) => (
              <option key={c.id} value={c.id}>
                {c.fio} ({c.phone})
              </option>
            ))}
          </Select>

          <div className={styles.formRow}>
            <Input
              label='Тип оборудования'
              placeholder='Кондиционер'
              error={errors.climateTechType?.message}
              {...register('climateTechType', { required: 'Введите тип оборудования' })}
            />
            <Input
              label='Модель оборудования'
              placeholder='Samsung AR09'
              error={errors.climateTechModel?.message}
              {...register('climateTechModel', { required: 'Введите модель оборудования' })}
            />
          </div>

          <Textarea
            label='Описание проблемы'
            placeholder='Опишите проблему...'
            error={errors.problemDescription?.message}
            {...register('problemDescription', { required: 'Введите описание проблемы' })}
          />

          <Select
            label='Мастер (опционально)'
            {...register('masterId', { valueAsNumber: true })}
          >
            <option value=''>Не назначать</option>
            {specialists.map((s: User) => (
              <option key={s.id} value={s.id}>
                {s.fio}
              </option>
            ))}
          </Select>
        </form>
      </Modal>
    </div>
  );
}
