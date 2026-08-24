import styles from './ProgressStat.module.css';

interface ProgressStatProps {
  label: string;
  value: number;
  max: number;
  formatValue?: (value: number, max: number) => string;
  tone?: 'primary' | 'success' | 'warning';
}

export function ProgressStat({ label, value, max, formatValue, tone = 'primary' }: ProgressStatProps) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const display = formatValue ? formatValue(value, max) : `${value} / ${max}`;

  return (
    <div className={styles.wrap}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{display}</span>
      </div>
      <div className={styles.track}>
        <div className={`${styles.fill} ${styles[tone]}`} style={{ width: `${percent}%` }} />
      </div>
      <span className={styles.percent}>{percent}%</span>
    </div>
  );
}
