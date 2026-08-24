import { Mail, Link2, MessageCircle, Users as UsersIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getUserRoleLabel } from '../../mock-data/roleLabels';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import bchPhoto from '../../assets/executives/bch-2025-2026.jpg';
import styles from './SubAssociationInfo.module.css';

export function SubAssociationInfo() {
  const { currentUser, activeSubAssociationId } = useAuth();
  const { users, activities, subAssociations } = useAppData();
  if (!currentUser) return null;

  const sa = subAssociations.find((s) => s.id === activeSubAssociationId);
  if (!sa) return <p>Không tìm thấy thông tin chi hội.</p>;

  const members = users.filter((u) => u.subAssociationIds.includes(sa.id));
  const BCH_TITLE_ORDER = { 'chi-hoi-truong': 0, 'chi-hoi-pho': 1, 'uy-vien-bch': 2 } as const;
  const bch = members
    .filter((u) => u.role === 'bch')
    .sort((a, b) => (BCH_TITLE_ORDER[a.bchTitle ?? 'uy-vien-bch'] ?? 3) - (BCH_TITLE_ORDER[b.bchTitle ?? 'uy-vien-bch'] ?? 3));
  const recurringActivities = activities.filter((a) => a.subAssociationId === sa.id).slice(0, 4);

  return (
    <div>
      <h1>{sa.name}</h1>
      <p className={styles.slogan}>&ldquo;{sa.slogan}&rdquo;</p>

      <Card className={styles.section}>
        <h2 className={styles.sectionTitle}>Giới thiệu</h2>
        <p className={styles.text}>{sa.introduction}</p>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <UsersIcon size={16} /> {members.length} hội viên
          </span>
          <Badge tone="primary">Nhiệm kỳ {sa.termOfOffice}</Badge>
        </div>
      </Card>

      <Card className={styles.section}>
        <h2 className={styles.sectionTitle}>Ban Chấp Hành đương nhiệm</h2>
        <img src={bchPhoto} alt="Ban Chấp Hành Chi hội sinh viên Trà Vinh" className={styles.bchPhoto} />
        <ul className={styles.bchList}>
          {bch.map((b) => (
            <li key={b.id} className={styles.bchItem}>
              <span className={styles.avatar}>{b.avatarInitials}</span>
              <span className={styles.bchItemInfo}>
                <span className={styles.bchItemName}>{b.name}</span>
                <span className={styles.bchItemTitle}>{getUserRoleLabel(b)}</span>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className={styles.section}>
        <h2 className={styles.sectionTitle}>Hoạt động tiêu biểu</h2>
        <ul className={styles.activityList}>
          {recurringActivities.map((a) => (
            <li key={a.id} className={styles.activityItem}>
              {a.title}
            </li>
          ))}
        </ul>
      </Card>

      <Card className={styles.section}>
        <h2 className={styles.sectionTitle}>Thông tin liên hệ</h2>
        <p className={styles.contactLine}>
          <Mail size={16} /> {sa.contactEmail}
        </p>
        <div className={styles.contactLine}>
          <span className={styles.contactLabel}>Mạng xã hội</span>
          <a
            href={sa.facebookUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.contactIconLink}
            title="Facebook"
            aria-label="Facebook"
          >
            <Link2 size={16} />
          </a>
          <a
            href={sa.zaloUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.contactIconLink}
            title="Zalo"
            aria-label="Zalo"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </Card>
    </div>
  );
}
