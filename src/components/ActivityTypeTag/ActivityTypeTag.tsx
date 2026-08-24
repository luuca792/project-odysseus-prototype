import type { ActivityType } from '../../mock-data/types';
import styles from './ActivityTypeTag.module.css';

const LABELS: Record<ActivityType, string> = {
  volunteer: 'Tình nguyện',
  meeting: 'Họp lệ',
  organizational: 'Tổ chức',
  sports: 'Thể thao',
  labor: 'Lao động',
};

export function ActivityTypeTag({ type }: { type: ActivityType }) {
  return <span className={`${styles.tag} ${styles[type]}`}>{LABELS[type]}</span>;
}

export const ACTIVITY_TYPE_LABELS = LABELS;
