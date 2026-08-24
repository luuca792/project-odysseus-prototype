import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Award } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { getUserRoleLabel } from '../../mock-data/roleLabels';
import { ActivityTypeTag } from '../../components/ActivityTypeTag/ActivityTypeTag';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge/Badge';
import { Modal } from '../../components/Modal/Modal';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { useToast } from '../../components/Toast/ToastContext';
import styles from './Members.module.css';

export function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const { users, activities, badges, toggleCoreMember, assignBadge, removeBadge } = useAppData();
  const { showToast } = useToast();
  const [awardModalOpen, setAwardModalOpen] = useState(false);

  const member = users.find((u) => u.id === id);
  if (!member) return <p>Không tìm thấy hội viên.</p>;

  const participated = activities.filter((a) => a.participantIds.includes(member.id));
  const availableBadges = badges.filter((b) => member.subAssociationIds.includes(b.subAssociationId));
  const memberBadges = availableBadges.filter((b) => member.badgeIds.includes(b.id));

  function handleToggleCore() {
    toggleCoreMember(member!.id);
    showToast(member!.isCoreMember ? 'Đã bỏ đánh dấu hội viên nòng cốt.' : 'Đã đánh dấu là hội viên nòng cốt.');
  }

  function handleAssign(badgeId: string) {
    assignBadge(member!.id, badgeId);
    showToast('Đã trao huy hiệu cho hội viên.');
  }

  function handleRemove(badgeId: string) {
    removeBadge(member!.id, badgeId);
    showToast('Đã gỡ huy hiệu khỏi hội viên.');
  }

  return (
    <div>
      <div className={styles.detailHeader}>
        <span className={styles.avatarLg}>{member.avatarInitials}</span>
        <div className={styles.detailHeaderInfo}>
          <h1 style={{ margin: 0 }}>{member.name}</h1>
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
            {member.email}
            {member.studentId ? ` · MSSV: ${member.studentId}` : ''}
            {member.major ? ` · ${member.major}` : ''}
          </p>
          <Badge tone={member.role === 'bch' ? 'primary' : 'neutral'}>{getUserRoleLabel(member)}</Badge>
        </div>
        <div className={styles.detailActions}>
          <Button variant={member.isCoreMember ? 'secondary' : 'ghost'} size="sm" onClick={handleToggleCore}>
            <Star size={14} /> {member.isCoreMember ? 'Hội viên nòng cốt' : 'Đánh dấu nòng cốt'}
          </Button>
          <Button size="sm" onClick={() => setAwardModalOpen(true)}>
            <Award size={14} /> Trao huy hiệu
          </Button>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Lịch sử hoạt động ({participated.length})</h2>
        {participated.length === 0 ? (
          <EmptyState title="Chưa tham gia hoạt động nào" />
        ) : (
          <ul className={styles.list}>
            {participated.map((a) => (
              <li key={a.id}>
                <Card className={styles.listRow}>
                  <span>{a.title}</span>
                  <ActivityTypeTag type={a.type} />
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Huy hiệu đang giữ ({memberBadges.length})</h2>
        {memberBadges.length === 0 ? (
          <EmptyState title="Chưa có huy hiệu nào" />
        ) : (
          <ul className={styles.list}>
            {memberBadges.map((b) => (
              <li key={b.id}>
                <Card className={styles.badgeRow}>
                  <div className={styles.badgeIcon} style={{ background: b.color }}>
                    <Award size={16} color="white" />
                  </div>
                  <span style={{ flex: 1 }}>{b.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleRemove(b.id)}>
                    Gỡ huy hiệu
                  </Button>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {awardModalOpen && (
        <Modal title="Trao huy hiệu" onClose={() => setAwardModalOpen(false)}>
          <ul className={styles.list}>
            {availableBadges.map((b) => {
              const alreadyHas = member.badgeIds.includes(b.id);
              return (
                <li key={b.id}>
                  <Card className={styles.badgeRow}>
                    <div className={styles.badgeIcon} style={{ background: b.color }}>
                    <Award size={16} color="white" />
                  </div>
                    <span style={{ flex: 1 }}>{b.name}</span>
                    <Button
                      variant={alreadyHas ? 'ghost' : 'secondary'}
                      size="sm"
                      disabled={alreadyHas}
                      onClick={() => handleAssign(b.id)}
                    >
                      {alreadyHas ? 'Đã có' : 'Trao'}
                    </Button>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Modal>
      )}
    </div>
  );
}
