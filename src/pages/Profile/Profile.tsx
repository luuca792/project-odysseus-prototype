import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getBadgeById } from '../../mock-data/badges';
import { getUserRoleLabel } from '../../mock-data/roleLabels';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button';
import { TextAreaField, TextField } from '../../components/FormField/FormField';
import { Badge } from '../../components/Badge/Badge';
import { ActivityTypeTag } from '../../components/ActivityTypeTag/ActivityTypeTag';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { useToast } from '../../components/Toast/ToastContext';
import styles from './Profile.module.css';

export function Profile() {
  const { currentUser } = useAuth();
  const { activities, posts, subAssociations } = useAppData();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name ?? '');
  const [bio, setBio] = useState(currentUser?.bio ?? '');
  const [studentId, setStudentId] = useState(currentUser?.studentId ?? '');
  const [major, setMajor] = useState(currentUser?.major ?? '');

  if (!currentUser) return null;

  const memberSubAssociations = subAssociations.filter((s) => currentUser.subAssociationIds.includes(s.id));
  const participated = activities.filter((a) => a.participantIds.includes(currentUser.id));
  const myPosts = posts.filter((p) => p.postType === 'forum' && p.authorId === currentUser.id);

  function handleSave() {
    setEditing(false);
    showToast('Đã cập nhật thông tin cá nhân (chỉ trong phiên làm việc này).');
  }

  return (
    <div>
      <h1>Thông tin cá nhân</h1>

      <Card className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <span className={styles.avatarLg}>{currentUser.avatarInitials}</span>
          <div className={styles.profileHeaderInfo}>
            {editing ? (
              <TextField label="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} />
            ) : (
              <h2 className={styles.name}>{name}</h2>
            )}
            {editing ? (
              <div className={styles.editRow}>
                <TextField label="MSSV" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                <TextField label="Ngành học" value={major} onChange={(e) => setMajor(e.target.value)} />
              </div>
            ) : (
              <p className={styles.meta}>
                {currentUser.email} ·{' '}
                {memberSubAssociations.length > 0
                  ? memberSubAssociations.map((s) => s.name).join(', ')
                  : 'Không thuộc chi hội nào'}
                {studentId ? ` · MSSV: ${studentId}` : ''}
                {major ? ` · ${major}` : ''}
              </p>
            )}
            <div className={styles.badgeRow}>
              <Badge tone={currentUser.role === 'bch' ? 'primary' : 'neutral'}>{getUserRoleLabel(currentUser)}</Badge>
              {currentUser.isCoreMember && <Badge tone="primary">Hội viên nòng cốt</Badge>}
            </div>
          </div>
          <Button variant={editing ? 'primary' : 'secondary'} size="sm" onClick={editing ? handleSave : () => setEditing(true)}>
            {editing ? (
              <>
                <Save size={14} /> Lưu
              </>
            ) : (
              <>
                <Pencil size={14} /> Chỉnh sửa
              </>
            )}
          </Button>
        </div>

        {editing ? (
          <TextAreaField label="Giới thiệu bản thân" value={bio} onChange={(e) => setBio(e.target.value)} />
        ) : (
          <p className={styles.bio}>{bio}</p>
        )}
      </Card>

      <div className={styles.grid}>
        <section>
          <h2 className={styles.sectionTitle}>Hoạt động đã tham gia ({participated.length})</h2>
          {participated.length === 0 ? (
            <EmptyState title="Chưa tham gia hoạt động nào" />
          ) : (
            <ul className={styles.list}>
              {participated.map((a) => (
                <li key={a.id}>
                  <Card className={styles.listRow}>
                    <Link to={`/activities/${a.id}`} className={styles.listTitle}>
                      {a.title}
                    </Link>
                    <ActivityTypeTag type={a.type} />
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Bài viết đã tạo ({myPosts.length})</h2>
          {myPosts.length === 0 ? (
            <EmptyState title="Chưa tạo bài viết nào" />
          ) : (
            <ul className={styles.list}>
              {myPosts.map((p) => (
                <li key={p.id}>
                  <Card className={styles.listRow}>
                    <Link to={`/forum/${p.id}`} className={styles.listTitle}>
                      {p.title}
                    </Link>
                    <Badge tone={p.status === 'published' ? 'success' : 'warning'}>
                      {p.status === 'published' ? 'Đã đăng' : 'Đã ẩn'}
                    </Badge>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Huy hiệu đạt được ({currentUser.badgeIds.length})</h2>
          {currentUser.badgeIds.length === 0 ? (
            <EmptyState title="Chưa có huy hiệu nào" />
          ) : (
            <div className={styles.badgeGrid}>
              {currentUser.badgeIds.map((badgeId) => {
                const badge = getBadgeById(badgeId);
                if (!badge) return null;
                return (
                  <Card key={badge.id} className={styles.badgeCard}>
                    <div className={styles.badgeIcon} style={{ background: badge.color }} />
                    <div>
                      <p className={styles.badgeName}>{badge.name}</p>
                      <p className={styles.badgeDesc}>{badge.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
