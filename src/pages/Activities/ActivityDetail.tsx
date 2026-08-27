import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  Users as UsersIcon,
  Pencil,
  Trash2,
  Lock,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  UserPlus,
  UserMinus,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { usePermission } from '../../context/usePermission';
import { useNotifications } from '../../context/NotificationContext';
import { getMediaById } from '../../mock-data/media';
import type { User } from '../../mock-data/types';
import { ActivityImage } from '../../components/ActivityImage/ActivityImage';
import { ActivityTypeTag } from '../../components/ActivityTypeTag/ActivityTypeTag';
import { ActivityStatusTag } from '../../components/ActivityStatusTag/ActivityStatusTag';
import { DataTable, type Column } from '../../components/DataTable/DataTable';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal/Modal';
import { useToast } from '../../components/Toast/ToastContext';
import { useChatWidget } from '../../context/ChatWidgetContext';
import styles from './Activities.module.css';

export function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { activities, users, deleteActivity, addParticipant, removeParticipant } = useAppData();
  const canManage = usePermission('manage-activities');
  const { markActivityRead } = useNotifications();
  const { showToast } = useToast();
  const { openChat } = useChatWidget();
  const navigate = useNavigate();

  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [addPickerOpen, setAddPickerOpen] = useState(false);

  useEffect(() => {
    if (id) markActivityRead(id);
  }, [id, markActivityRead]);

  const activity = activities.find((a) => a.id === id);
  if (!currentUser || !activity) return <p>Không tìm thấy hoạt động.</p>;
  const activityId = activity.id;
  const currentUserId = currentUser.id;

  const participants = users.filter((u) => activity.participantIds.includes(u.id));
  const documents = activity.documentIds.map((id) => getMediaById(id)).filter((m) => m !== undefined);
  const isRegistered = activity.participantIds.includes(currentUser.id);
  const canSelfRegister = activity.status === 'upcoming';
  const addableUsers = users.filter((u) => u.role !== 'admin' && !activity.participantIds.includes(u.id));

  function handleDelete() {
    if (!activity) return;
    deleteActivity(activity.id);
    showToast('Đã xóa hoạt động.');
    navigate('/activities');
  }

  function handleRegister() {
    addParticipant(activityId, currentUserId);
    showToast('Đã đăng ký tham dự.');
  }

  function handleUnregister() {
    removeParticipant(activityId, currentUserId);
    showToast('Đã hủy đăng ký.');
  }

  function handleRemoveParticipant(userId: string) {
    removeParticipant(activityId, userId);
    showToast('Đã xóa khỏi danh sách tham dự.');
  }

  function handleAddParticipant(user: User) {
    addParticipant(activityId, user.id);
    showToast(`Đã thêm ${user.name} vào danh sách tham dự.`);
  }

  const participantColumns: Column<User>[] = [
    {
      key: 'stt',
      header: 'STT',
      align: 'center',
      render: (u) => participants.findIndex((p) => p.id === u.id) + 1,
    },
    { key: 'name', header: 'Họ và tên', sortValue: (u) => u.name, render: (u) => u.name },
    { key: 'studentId', header: 'MSSV', sortValue: (u) => u.studentId ?? '', render: (u) => u.studentId ?? '—' },
    { key: 'major', header: 'Ngành học', sortValue: (u) => u.major ?? '', render: (u) => u.major ?? '—' },
    ...(canManage
      ? [
          {
            key: 'actions',
            header: '',
            align: 'right' as const,
            render: (u: User) => (
              <Button variant="ghost" size="sm" onClick={() => handleRemoveParticipant(u.id)}>
                <UserMinus size={14} /> Xóa
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <div className={styles.cardTags}>
            <ActivityTypeTag type={activity.type} />
            <ActivityStatusTag status={activity.status} />
          </div>
          <h1>{activity.title}</h1>
        </div>
        {canManage && (
          <div className={styles.formActions}>
            <Link to={`/activities/${activity.id}/edit`}>
              <Button variant="secondary" size="sm">
                <Pencil size={14} /> Sửa
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              <Trash2 size={14} /> Xóa
            </Button>
          </div>
        )}
      </div>

      <ActivityImage
        imageId={activity.mediaIds[0] ?? 'placeholder-1'}
        alt={activity.title}
        className={styles.detailHero}
      />
      {activity.mediaIds.length > 1 && (
        <div className={styles.detailImageStrip}>
          {activity.mediaIds.slice(1).map((mediaId) => (
            <ActivityImage key={mediaId} imageId={mediaId} alt={activity.title} className={styles.detailImageTile} />
          ))}
        </div>
      )}

      <div className={styles.highlightBlock}>
        <div className={styles.highlightMetaRow}>
          <span className={styles.detailMetaItem}>
            <CalendarDays size={16} /> {new Date(activity.date).toLocaleDateString('vi-VN')}
          </span>
          <span className={styles.detailMetaItem}>
            <MapPin size={16} /> {activity.location}
          </span>
        </div>
      </div>

      <hr className={styles.divider} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Mô tả</h2>
        <p>{activity.description}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Sparkles size={16} style={{ verticalAlign: -2, marginRight: 6 }} />
          Lợi ích khi tham gia
        </h2>
        <div className={styles.highlightBlock}>
          {activity.benefits.length === 0 ? (
            <p className={styles.cardMeta}>Chưa có thông tin lợi ích tham gia.</p>
          ) : (
            <ul className={styles.benefitList}>
              {activity.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <button
            type="button"
            className={styles.participantToggle}
            onClick={() => setParticipantsOpen((o) => !o)}
            aria-expanded={participantsOpen}
          >
            <UsersIcon size={16} />
            Hội viên tham dự ({participants.length})
            {participantsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {canSelfRegister &&
            (isRegistered ? (
              <Button variant="secondary" size="sm" onClick={handleUnregister}>
                <UserMinus size={14} /> Hủy đăng ký
              </Button>
            ) : (
              <Button size="sm" onClick={handleRegister}>
                <UserPlus size={14} /> Đăng ký tham dự
              </Button>
            ))}

          {canManage && (
            <Button variant="ghost" size="sm" onClick={() => setAddPickerOpen(true)}>
              <UserPlus size={14} /> Thêm hội viên
            </Button>
          )}
        </h2>

        {participantsOpen &&
          (participants.length === 0 ? (
            <p className={styles.cardMeta}>Chưa có hội viên đăng ký tham dự.</p>
          ) : (
            <DataTable columns={participantColumns} rows={participants} rowKey={(u) => u.id} />
          ))}
      </section>

      {canManage && addPickerOpen && (
        <Modal title="Thêm hội viên tham dự" onClose={() => setAddPickerOpen(false)}>
          {addableUsers.length === 0 ? (
            <p className={styles.cardMeta}>Tất cả hội viên đã có trong danh sách tham dự.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {addableUsers.map((u) => (
                <li key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ flex: 1, fontSize: 'var(--font-size-sm)' }}>
                    {u.name} {u.studentId ? `· ${u.studentId}` : ''}
                  </span>
                  <Button variant="secondary" size="sm" onClick={() => handleAddParticipant(u)}>
                    <UserPlus size={14} /> Thêm
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}

      {canManage && (
        <section className={styles.section}>
          <div className={styles.bchOnlyBanner}>
            <Lock size={12} /> Chỉ BCH mới xem được mục này
          </div>
          <Card>
            {documents.length === 0 ? (
              <p className={styles.cardMeta}>Chưa có tài liệu tổ chức nào được đính kèm.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {documents.map((doc) => (
                  <li key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--font-size-sm)' }}>
                    <FileText size={16} />
                    <span style={{ flex: 1 }}>{doc.filename}</span>
                    <span className={styles.cardMeta}>{doc.size}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      )}

      {canManage && (
        <section className={styles.section}>
          <div className={styles.bchOnlyBanner}>
            <Lock size={12} /> Chỉ BCH mới xem được mục này
          </div>
          <Card>
            <div className={styles.chatPromptRow}>
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>Thảo luận nội bộ BCH</p>
                <p className={styles.cardMeta} style={{ marginTop: 4 }}>
                  Trao đổi nhanh giữa BCH về hoạt động này.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => openChat(activity.id)}>
                <MessageCircle size={14} /> Mở đoạn chat
              </Button>
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}
