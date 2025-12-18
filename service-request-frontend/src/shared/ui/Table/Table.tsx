import { type ReactNode } from 'react';
import cn from 'classnames';
import styles from './Table.module.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  keyField?: keyof T;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'Нет данных',
  keyField = 'id' as keyof T,
}: TableProps<T>) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={String(item[keyField])}
                className={cn(styles.tr, { [styles.clickable]: !!onRowClick })}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Компонент для отображения статуса
interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusClass = (statusName: string) => {
    const normalized = statusName.toLowerCase();
    if (normalized.includes('нов') || normalized.includes('открыт')) return styles.statusNew;
    if (normalized.includes('работ') || normalized.includes('процесс')) return styles.statusInProgress;
    if (normalized.includes('выполн') || normalized.includes('заверш')) return styles.statusCompleted;
    if (normalized.includes('отмен') || normalized.includes('закрыт')) return styles.statusCancelled;
    return styles.statusNew;
  };

  return <span className={cn(styles.status, getStatusClass(status))}>{status}</span>;
}

// Компонент пагинации
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  return (
    <div className={styles.pagination}>
      {totalItems && itemsPerPage ? (
        <span className={styles.paginationInfo}>
          Показано {startItem}-{endItem} из {totalItems}
        </span>
      ) : (
        <span />
      )}
      <div className={styles.paginationButtons}>
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ←
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={cn(styles.pageButton, { [styles.pageButtonActive]: page === currentPage })}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          →
        </button>
      </div>
    </div>
  );
}

