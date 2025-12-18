import { useState } from 'react';
import { Title, Loading, DateRangePicker, Button } from '@/shared/ui';
import { useReports } from '@/entities/report/hooks/useReports';
import styles from './ReportsPage.module.css';

export function ReportsPage() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { completed, avgTime, byProblem, isLoading } = useReports(
    fromDate || undefined,
    toDate || undefined
  );

  const handleReset = () => {
    setFromDate('');
    setToDate('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Title>Статистика</Title>
      </div>

      {/* Фильтры по периоду */}
      <div className={styles.filters}>
        <DateRangePicker
          fromValue={fromDate}
          toValue={toDate}
          onFromChange={setFromDate}
          onToChange={setToDate}
          fromLabel='Период от'
          toLabel='До'
        />
        <Button appearance='default' size='sm' onClick={handleReset}>
          Сбросить
        </Button>
      </div>

      {/* Карточки статистики */}
      <div className={styles.statsGrid}>
        {/* Выполненные заявки */}
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>📋</div>
          <span className={styles.statLabel}>Выполненных заявок</span>
          {completed.isLoading ? (
            <div className={styles.loadingCard}>
              <Loading size='small' text='' />
            </div>
          ) : completed.error ? (
            <span className={styles.statValue}>—</span>
          ) : (
            <span className={styles.statValue}>
              {completed.data?.count ?? 0}
              <span className={styles.statUnit}>шт.</span>
            </span>
          )}
        </div>

        {/* Среднее время выполнения */}
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>⏱️</div>
          <span className={styles.statLabel}>Среднее время выполнения</span>
          {avgTime.isLoading ? (
            <div className={styles.loadingCard}>
              <Loading size='small' text='' />
            </div>
          ) : avgTime.error ? (
            <span className={styles.statValue}>—</span>
          ) : (
            <span className={styles.statValue}>
              {avgTime.data?.avgHours?.toFixed(1) ?? 0}
              <span className={styles.statUnit}>ч.</span>
            </span>
          )}
        </div>

        {/* Всего типов проблем */}
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconOrange}`}>🔧</div>
          <span className={styles.statLabel}>Типов неисправностей</span>
          {byProblem.isLoading ? (
            <div className={styles.loadingCard}>
              <Loading size='small' text='' />
            </div>
          ) : byProblem.error ? (
            <span className={styles.statValue}>—</span>
          ) : (
            <span className={styles.statValue}>
              {byProblem.data?.length ?? 0}
              <span className={styles.statUnit}>шт.</span>
            </span>
          )}
        </div>
      </div>

      {/* Таблица по проблемам */}
      <div className={styles.problemsSection}>
        <div className={styles.problemsHeader}>
          <h2 className={styles.problemsTitle}>Статистика по типам неисправностей</h2>
        </div>
        <div className={styles.problemsContent}>
          {byProblem.isLoading ? (
            <Loading text='Загрузка статистики...' />
          ) : byProblem.error ? (
            <div className={styles.emptyState}>Ошибка загрузки данных</div>
          ) : byProblem.data && byProblem.data.length > 0 ? (
            byProblem.data
              .sort((a, b) => b.count - a.count)
              .map((item, index) => (
                <div key={index} className={styles.problemRow}>
                  <span className={styles.problemDescription}>{item.problemDescription}</span>
                  <span className={styles.problemCount}>{item.count}</span>
                </div>
              ))
          ) : (
            <div className={styles.emptyState}>Нет данных</div>
          )}
        </div>
      </div>
    </div>
  );
}

