import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import type { User } from '../../mock-data/types';
import { getUserRoleLabel } from '../../mock-data/roleLabels';
import { DataTable, type Column } from '../../components/DataTable/DataTable';
import { Badge } from '../../components/Badge/Badge';
import styles from './Members.module.css';

export function MembersList() {
  const { currentUser, activeSubAssociationId } = useAuth();
  const { users, activities } = useAppData();
  const navigate = useNavigate();
  if (!currentUser || !activeSubAssociationId) return null;

  const members = users.filter((u) => u.subAssociationIds.includes(activeSubAssociationId) && u.role !== 'admin');

  function activityCount(user: User) {
    return activities.filter((a) => a.subAssociationId === activeSubAssociationId && a.participantIds.includes(user.id))
      .length;
  }

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Họ và tên',
      sortValue: (u) => u.name,
      render: (u) => (
        <span className={styles.nameCell}>
          <span className={styles.avatar}>{u.avatarInitials}</span>
          {u.name}
          {u.isCoreMember && <Star size={14} color="var(--color-warning)" fill="var(--color-warning)" />}
        </span>
      ),
    },
    {
      key: 'studentId',
      header: 'MSSV',
      sortValue: (u) => u.studentId ?? '',
      render: (u) => u.studentId ?? '—',
    },
    {
      key: 'major',
      header: 'Ngành học',
      sortValue: (u) => u.major ?? '',
      render: (u) => u.major ?? '—',
    },
    {
      key: 'role',
      header: 'Vai trò',
      render: (u) => <Badge tone={u.role === 'bch' ? 'primary' : 'neutral'}>{getUserRoleLabel(u)}</Badge>,
    },
    {
      key: 'activityCount',
      header: 'Số hoạt động tham gia',
      align: 'right',
      sortValue: (u) => activityCount(u),
      render: (u) => activityCount(u),
    },
    {
      key: 'badges',
      header: 'Huy hiệu',
      align: 'right',
      sortValue: (u) => u.badgeIds.length,
      render: (u) => u.badgeIds.length,
    },
  ];

  return (
    <div>
      <h1>Hội viên</h1>
      <p className={styles.pageDescription}>
        Danh sách hội viên trong chi hội — mặc định sắp xếp theo số hoạt động tham gia (giảm dần).
      </p>
      <DataTable
        columns={columns}
        rows={members}
        rowKey={(u) => u.id}
        defaultSortKey="activityCount"
        defaultSortDirection="desc"
        onRowClick={(u) => navigate(`/members/${u.id}`)}
      />
    </div>
  );
}
