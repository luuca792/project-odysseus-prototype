import type { ActivityStatus } from '../../mock-data/types';
import styles from './ActivityStatusTag.module.css';

const LABELS: Record<ActivityStatus, string> = {
  upcoming: 'Sắp diễn ra',
  ongoing: 'Đang diễn ra',
  ended: 'Đã kết thúc',
};

// Fixed display order for the status-grouped sections on the overview page.
export const ACTIVITY_STATUS_ORDER: ActivityStatus[] = ['upcoming', 'ongoing', 'ended'];

export function ActivityStatusTag({ status }: { status: ActivityStatus }) {
  return <span className={`${styles.tag} ${styles[status]}`}>{LABELS[status]}</span>;
}

export const ACTIVITY_STATUS_LABELS = LABELS;
