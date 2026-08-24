import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { usePermission } from '../../context/usePermission';
import { useNotifications } from '../../context/NotificationContext';
import type { Activity, ActivityType } from '../../mock-data/types';
import { ACTIVITY_TYPE_LABELS, ActivityTypeTag } from '../../components/ActivityTypeTag/ActivityTypeTag';
import { ACTIVITY_STATUS_LABELS, ACTIVITY_STATUS_ORDER, ActivityStatusTag } from '../../components/ActivityStatusTag/ActivityStatusTag';
import { ActivityImage } from '../../components/ActivityImage/ActivityImage';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { NotificationDot } from '../../components/NotificationDot/NotificationDot';
import styles from './Activities.module.css';

const TYPE_FILTERS: (ActivityType | 'all')[] = ['all', 'volunteer', 'meeting', 'organizational', 'sports', 'labor'];

export function ActivitiesList() {
  const { currentUser, activeSubAssociationId } = useAuth();
  const { activities } = useAppData();
  const canManage = usePermission('manage-activities');
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'all'>('all');
  if (!currentUser) return null;

  const scoped = activities.filter((a) => a.subAssociationId === activeSubAssociationId);
  const filtered = typeFilter === 'all' ? scoped : scoped.filter((a) => a.type === typeFilter);

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1>Hoạt động</h1>
          <p className={styles.pageDescription}>Danh sách các hoạt động của chi hội theo nhiệm kỳ.</p>
        </div>
        {canManage && (
          <Link to="/activities/new">
            <Button>
              <Plus size={16} /> Tạo hoạt động
            </Button>
          </Link>
        )}
      </div>

      <div className={styles.filterRow}>
        {TYPE_FILTERS.map((t) => (
          <button
            key={t}
            className={`${styles.filterChip} ${typeFilter === t ? styles.filterChipActive : ''}`}
            onClick={() => setTypeFilter(t)}
          >
            {t === 'all' ? 'Tất cả' : ACTIVITY_TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Không có hoạt động nào phù hợp" />
      ) : (
        ACTIVITY_STATUS_ORDER.map((status, i) => {
          const group = filtered.filter((a) => a.status === status);
          if (group.length === 0) return null;
          return (
            <section key={status} className={styles.statusSection} style={i > 0 ? { borderTop: '1px solid var(--color-border)' } : undefined}>
              <h2 className={styles.statusSectionTitle}>
                {ACTIVITY_STATUS_LABELS[status]} <span className={styles.statusSectionCount}>({group.length})</span>
              </h2>
              <div className={styles.grid}>
                {group.map((a) => (
                  <ActivityCard key={a.id} activity={a} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

function ActivityCard({ activity: a }: { activity: Activity }) {
  const { isActivityUnread } = useNotifications();
  const unread = isActivityUnread(a.id);

  return (
    <Link to={`/activities/${a.id}`} className={styles.cardLink}>
      <Card interactive className={styles.activityCard}>
        <ActivityImage imageId={a.mediaIds[0] ?? 'placeholder-1'} alt={a.title} className={styles.thumb} />
        <div className={styles.cardBody}>
          <div className={styles.cardTags}>
            <ActivityTypeTag type={a.type} />
            <ActivityStatusTag status={a.status} />
          </div>
          <h3 className={styles.cardTitle}>
            {unread && <NotificationDot className={styles.cardDot} />}
            {a.title}
          </h3>
          <p className={styles.cardMeta}>
            {new Date(a.date).toLocaleDateString('vi-VN')} · {a.location}
          </p>
          <p className={styles.cardMeta}>{a.participantIds.length} người tham gia</p>
        </div>
      </Card>
    </Link>
  );
}
