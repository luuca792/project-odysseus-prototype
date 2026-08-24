import { useState, type FormEvent } from 'react';
import { Building2, Plus, ShieldCheck, ChevronLeft, ChevronRight, KeyRound, UserPlus } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import type { Role } from '../../mock-data/types';
import { ROLE_LABELS, getUserRoleLabel } from '../../mock-data/roleLabels';
import { ALL_PERMISSIONS, PERMISSION_LABELS } from '../../mock-data/permissions';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal/Modal';
import { TextField, TextAreaField, SelectField } from '../../components/FormField/FormField';
import { useToast } from '../../components/Toast/ToastContext';
import styles from './Admin.module.css';

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'member', label: ROLE_LABELS.member },
  { value: 'bch', label: ROLE_LABELS.bch },
  { value: 'admin', label: ROLE_LABELS.admin },
];

const EDITABLE_ROLES: Role[] = ['bch', 'member'];

const USERS_PER_PAGE = 10;

const PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

function generateTempPassword(length = 10) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)];
  }
  return result;
}

function deriveInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '??';
  const first = parts[0][0] ?? '';
  const last = parts[parts.length - 1][0] ?? '';
  return (parts.length === 1 ? first : first + last).toUpperCase();
}

const TABS = [
  { key: 'sub-associations', label: 'Quản lý chi hội' },
  { key: 'users', label: 'Quản lý người dùng' },
  { key: 'permissions', label: 'Phân quyền' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export function Admin() {
  const { activities, users, subAssociations, rolePermissions, addSubAssociation, addUser, setUserRole, togglePermission } =
    useAppData();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>('sub-associations');
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [userPage, setUserPage] = useState(0);

  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('member');
  const [newUserSubAssociationId, setNewUserSubAssociationId] = useState(subAssociations[0]?.id ?? '');
  const [tempPasswordUserId, setTempPasswordUserId] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState('');

  function handleCreateSubAssociation(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addSubAssociation({
      id: `sa-${Date.now()}`,
      name: name.trim(),
      slogan: slogan.trim(),
      introduction: introduction.trim(),
      contactEmail: '',
      facebookUrl: '',
      zaloUrl: '',
      termOfOffice: '2025–2026',
    });
    showToast('Đã tạo chi hội mới.');
    setCreateOpen(false);
    setName('');
    setSlogan('');
    setIntroduction('');
  }

  function handleAddUser(e: FormEvent) {
    e.preventDefault();
    if (!newUserName.trim() || !newUserSubAssociationId) return;
    addUser({
      id: `u-${Date.now()}`,
      name: newUserName.trim(),
      role: newUserRole,
      subAssociationIds: [newUserSubAssociationId],
      email: newUserEmail.trim(),
      avatarInitials: deriveInitials(newUserName),
      bio: '',
      isCoreMember: false,
      badgeIds: [],
    });
    showToast(`Đã thêm hội viên "${newUserName.trim()}". Hội viên có thể tự cập nhật thông tin còn lại sau khi đăng nhập.`);
    setAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('member');
    setNewUserSubAssociationId(subAssociations[0]?.id ?? '');
  }

  function handleResetPassword(userId: string, userName: string) {
    setTempPassword(generateTempPassword());
    setTempPasswordUserId(userId);
    showToast(`Đã tạo mật khẩu tạm thời cho ${userName}.`);
  }

  const assignableUsers = users.filter((u) => u.role !== 'admin');
  const userPageCount = Math.max(1, Math.ceil(assignableUsers.length / USERS_PER_PAGE));
  const pagedUsers = assignableUsers.slice(userPage * USERS_PER_PAGE, userPage * USERS_PER_PAGE + USERS_PER_PAGE);

  function goToUserPage(page: number) {
    setUserPage(Math.min(Math.max(page, 0), userPageCount - 1));
  }

  return (
    <div>
      <h1>Quản trị hệ thống</h1>
      <p className={styles.assumptionNote}>
        ⚠ Yêu cầu gốc không mô tả chi tiết chức năng dành riêng cho vai trò Quản trị hệ thống. Theo bản cập nhật đặc tả
        (Cách vận hành), quản trị có thể tạo chi hội, gán vai trò cho người dùng đã có tài khoản (không hỗ trợ tạo tài
        khoản mới trong bản dựng thử), và điều chỉnh quyền của từng vai trò bất cứ lúc nào. Danh sách quyền bên dưới là
        khái niệm hệ thống cố định — quản trị chỉ bật/tắt, không tạo quyền mới.
      </p>

      <div className={styles.tabRow}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tabButton} ${activeTab === tab.key ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'sub-associations' && (
        <div>
          <div className={styles.headerRow}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
              Danh sách chi hội
            </h2>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus size={14} /> Tạo chi hội
            </Button>
          </div>
          <div className={styles.grid}>
            {subAssociations.map((sa) => {
              const saActivities = activities.filter((a) => a.subAssociationId === sa.id);
              const saMembers = users.filter((u) => u.subAssociationIds.includes(sa.id));
              return (
                <Card key={sa.id}>
                  <div className={styles.cardHeader}>
                    <Building2 size={20} color="var(--color-primary)" />
                    <h3 style={{ margin: 0 }}>{sa.name}</h3>
                  </div>
                  <p className={styles.line}>{saMembers.length} hội viên</p>
                  <p className={styles.line}>{saActivities.length} hoạt động</p>
                  <p className={styles.line}>Nhiệm kỳ: {sa.termOfOffice}</p>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <div className={styles.headerRow}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
              Gán vai trò người dùng
            </h2>
            <Button size="sm" onClick={() => setAddUserOpen(true)}>
              <UserPlus size={14} /> Thêm hội viên
            </Button>
          </div>
          <div className={styles.userTableWrap}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Họ và tên</th>
                  <th>Chi hội</th>
                  <th>Vai trò</th>
                  <th>Mật khẩu</th>
                </tr>
              </thead>
              <tbody>
                {pagedUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <span className={styles.userInfo}>
                        <span className={styles.avatar}>{u.avatarInitials}</span>
                        <span>
                          <p className={styles.userName}>{u.name}</p>
                          <p className={styles.line}>{getUserRoleLabel(u)}</p>
                        </span>
                      </span>
                    </td>
                    <td>
                      {u.subAssociationIds
                        .map((id) => subAssociations.find((sa) => sa.id === id)?.name)
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </td>
                    <td>
                      <SelectField
                        label=""
                        id={`role-select-${u.id}`}
                        aria-label={`Vai trò của ${u.name}`}
                        options={ROLE_OPTIONS}
                        value={u.role}
                        onChange={(e) => {
                          setUserRole(u.id, e.target.value as Role);
                          showToast(`Đã cập nhật vai trò của ${u.name}.`);
                        }}
                      />
                    </td>
                    <td>
                      <Button variant="ghost" size="sm" onClick={() => handleResetPassword(u.id, u.name)}>
                        <KeyRound size={14} /> Cấp lại mật khẩu
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.pagination}>
            <Button variant="ghost" size="sm" onClick={() => goToUserPage(userPage - 1)} disabled={userPage === 0}>
              <ChevronLeft size={16} /> Trước
            </Button>
            <span className={styles.pageInfo}>
              Trang {userPage + 1} / {userPageCount}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToUserPage(userPage + 1)}
              disabled={userPage >= userPageCount - 1}
            >
              Sau <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div>
          <h2 className={styles.sectionTitle}>
            <ShieldCheck size={16} style={{ verticalAlign: -2, marginRight: 6 }} />
            Phân quyền theo vai trò
          </h2>
          <div className={styles.permissionTableWrap}>
            <table className={styles.permissionTable}>
              <thead>
                <tr>
                  <th>Quyền</th>
                  {EDITABLE_ROLES.map((role) => (
                    <th key={role} style={{ textAlign: 'center' }}>
                      {ROLE_LABELS[role]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_PERMISSIONS.map((perm) => (
                  <tr key={perm}>
                    <td>{PERMISSION_LABELS[perm]}</td>
                    {EDITABLE_ROLES.map((role) => (
                      <td key={role} style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          className={styles.permissionCheckbox}
                          checked={rolePermissions[role].includes(perm)}
                          onChange={() => togglePermission(role, perm)}
                          aria-label={`${PERMISSION_LABELS[perm]} - ${ROLE_LABELS[role]}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {createOpen && (
        <Modal
          title="Tạo chi hội mới"
          onClose={() => setCreateOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateSubAssociation} disabled={!name.trim()}>
                Tạo chi hội
              </Button>
            </>
          }
        >
          <form onSubmit={handleCreateSubAssociation}>
            <TextField label="Tên chi hội" value={name} onChange={(e) => setName(e.target.value)} required />
            <TextField label="Slogan" value={slogan} onChange={(e) => setSlogan(e.target.value)} />
            <TextAreaField label="Giới thiệu" value={introduction} onChange={(e) => setIntroduction(e.target.value)} />
          </form>
        </Modal>
      )}

      {addUserOpen && (
        <Modal
          title="Thêm hội viên mới"
          onClose={() => setAddUserOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setAddUserOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddUser} disabled={!newUserName.trim() || !newUserSubAssociationId}>
                Thêm hội viên
              </Button>
            </>
          }
        >
          <p className={styles.modalHint}>
            Quản trị chỉ cần cung cấp thông tin cơ bản. Hội viên sẽ tự cập nhật MSSV, ngành học, tiểu sử,... sau khi
            đăng nhập lần đầu.
          </p>
          <form onSubmit={handleAddUser}>
            <TextField label="Họ và tên" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required />
            <TextField
              label="Email"
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
            <SelectField
              label="Chi hội"
              id="new-user-sub-association"
              options={subAssociations.map((sa) => ({ value: sa.id, label: sa.name }))}
              value={newUserSubAssociationId}
              onChange={(e) => setNewUserSubAssociationId(e.target.value)}
              required
            />
            <SelectField
              label="Vai trò"
              id="new-user-role"
              options={ROLE_OPTIONS}
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as Role)}
            />
          </form>
        </Modal>
      )}

      {tempPasswordUserId && (
        <Modal title="Mật khẩu tạm thời" onClose={() => setTempPasswordUserId(null)} footer={<Button onClick={() => setTempPasswordUserId(null)}>Đóng</Button>}>
          <p className={styles.modalHint}>
            Cung cấp mật khẩu này cho hội viên để đăng nhập lần đầu hoặc khôi phục tài khoản. Hội viên nên đổi mật khẩu
            ngay sau khi đăng nhập.
          </p>
          <p className={styles.tempPassword}>{tempPassword}</p>
          <p className={styles.modalHint}>
            ⚠ Bản dựng thử: mật khẩu này chỉ mang tính minh họa giao diện, không được lưu trữ hay áp dụng thật — đăng
            nhập vẫn dùng cách chọn tài khoản demo như hiện tại.
          </p>
        </Modal>
      )}
    </div>
  );
}
