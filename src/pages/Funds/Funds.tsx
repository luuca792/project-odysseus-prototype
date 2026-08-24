import { useAuth } from '../../context/AuthContext';
import { getFundEntry } from '../../mock-data/funds';
import { Card } from '../../components/Card/Card';
import { DataTable, type Column } from '../../components/DataTable/DataTable';
import styles from './Funds.module.css';

function formatCurrency(n: number) {
  return n.toLocaleString('vi-VN') + ' đ';
}

interface ExpenseRow {
  label: string;
  amount: number;
  date: string;
}

export function Funds() {
  const { activeSubAssociationId } = useAuth();
  if (!activeSubAssociationId) return null;

  const fund = getFundEntry(activeSubAssociationId);
  if (!fund) return <p>Chưa có dữ liệu quỹ cho chi hội này.</p>;

  const spent = fund.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = fund.startingBalance - spent;

  const columns: Column<ExpenseRow>[] = [
    { key: 'label', header: 'Khoản chi', render: (r) => r.label },
    { key: 'date', header: 'Ngày', render: (r) => new Date(r.date).toLocaleDateString('vi-VN'), sortValue: (r) => r.date },
    {
      key: 'amount',
      header: 'Số tiền',
      align: 'right',
      sortValue: (r) => r.amount,
      render: (r) => formatCurrency(r.amount),
    },
  ];

  return (
    <div>
      <h1>Quỹ chi hội</h1>
      <p className={styles.pageDescription}>Theo dõi thu chi của chi hội trong nhiệm kỳ {fund.termOfOffice}.</p>

      <div className={styles.summaryGrid}>
        <Card className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Quỹ đầu nhiệm kỳ</span>
          <span className={styles.summaryValue}>{formatCurrency(fund.startingBalance)}</span>
        </Card>
        <Card className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Đã chi</span>
          <span className={styles.summaryValue} style={{ color: 'var(--color-error)' }}>
            -{formatCurrency(spent)}
          </span>
        </Card>
        <Card className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Còn lại</span>
          <span className={styles.summaryValue} style={{ color: 'var(--color-success)' }}>
            {formatCurrency(remaining)}
          </span>
        </Card>
      </div>

      <h2 className={styles.sectionTitle}>Chi tiết theo hoạt động</h2>
      <DataTable columns={columns} rows={fund.expenses} rowKey={(r) => r.label + r.date} />
    </div>
  );
}
