import { useState, type ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => number | string;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  defaultSortKey,
  defaultSortDirection = 'desc',
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [direction, setDirection] = useState<'asc' | 'desc'>(defaultSortDirection);

  const sortColumn = columns.find((c) => c.key === sortKey);
  const sortedRows = sortColumn?.sortValue
    ? [...rows].sort((a, b) => {
        const av = sortColumn.sortValue!(a);
        const bv = sortColumn.sortValue!(b);
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return direction === 'asc' ? cmp : -cmp;
      })
    : rows;

  function handleHeaderClick(col: Column<T>) {
    if (!col.sortValue) return;
    if (sortKey === col.key) {
      setDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setDirection('desc');
    }
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${styles.th} ${col.sortValue ? styles.sortable : ''}`}
                style={{ textAlign: col.align ?? 'left' }}
                onClick={() => handleHeaderClick(col)}
              >
                <span className={styles.thContent}>
                  {col.header}
                  {col.sortValue && sortKey === col.key && (direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr key={rowKey(row)} className={onRowClick ? styles.clickableRow : ''} onClick={() => onRowClick?.(row)}>
              {columns.map((col) => (
                <td key={col.key} className={styles.td} style={{ textAlign: col.align ?? 'left' }}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
