import { useState, type FormEvent } from 'react';
import { Plus, Award, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal/Modal';
import { TextField, TextAreaField } from '../../components/FormField/FormField';
import { useToast } from '../../components/Toast/ToastContext';
import styles from './Badges.module.css';

const COLOR_CHOICES = ['#1f5ca9', '#00afef', '#1f9d55', '#d97706', '#dc2626', '#8892a0'];

export function Badges() {
  const { currentUser, activeSubAssociationId } = useAuth();
  const { badges, users, addBadge, deleteBadge } = useAppData();
  const { showToast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [holdersModalBadgeId, setHoldersModalBadgeId] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLOR_CHOICES[0]);

  if (!currentUser) return null;

  const scopedBadges = badges.filter((b) => b.subAssociationId === activeSubAssociationId);
  const holdersModalBadge = scopedBadges.find((b) => b.id === holdersModalBadgeId);
  const holders = holdersModalBadge ? users.filter((u) => u.badgeIds.includes(holdersModalBadge.id)) : [];

  function closeHoldersModal() {
    setHoldersModalBadgeId(null);
    setConfirmingDelete(false);
  }

  function handleDeleteBadge() {
    if (!holdersModalBadge) return;
    deleteBadge(holdersModalBadge.id);
    showToast(`Đã xóa huy hiệu "${holdersModalBadge.name}".`);
    closeHoldersModal();
  }

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!activeSubAssociationId) return;
    addBadge({
      id: `b-${Date.now()}`,
      subAssociationId: activeSubAssociationId,
      name,
      description,
      color,
      icon: 'star',
    });
    showToast('Đã tạo huy hiệu mới.');
    setCreateOpen(false);
    setName('');
    setDescription('');
    setColor(COLOR_CHOICES[0]);
  }

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1>Huy hiệu</h1>
          <p className={styles.pageDescription}>Quản lý các loại huy hiệu ghi nhận đóng góp của hội viên.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} /> Tạo huy hiệu
        </Button>
      </div>

      <div className={styles.grid}>
        {scopedBadges.map((b) => {
          const holderCount = users.filter((u) => u.badgeIds.includes(b.id)).length;
          return (
            <Card key={b.id} interactive onClick={() => setHoldersModalBadgeId(b.id)}>
              <div className={styles.badgeIconLg} style={{ background: b.color }}>
                <Award size={24} color="white" />
              </div>
              <h3 className={styles.badgeName}>{b.name}</h3>
              <p className={styles.badgeDesc}>{b.description}</p>
              <p className={styles.holderCount}>{holderCount} hội viên đang giữ</p>
            </Card>
          );
        })}
      </div>

      {createOpen && (
        <Modal
          title="Tạo huy hiệu mới"
          onClose={() => setCreateOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreate} disabled={!name.trim()}>
                Tạo huy hiệu
              </Button>
            </>
          }
        >
          <form onSubmit={handleCreate}>
            <TextField
              label="Tên huy hiệu"
              placeholder='Ví dụ: "Hội viên tiêu biểu T10"'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextAreaField
              label="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label className={styles.colorLabel}>Màu huy hiệu</label>
            <div className={styles.colorRow}>
              {COLOR_CHOICES.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`${styles.colorSwatch} ${color === c ? styles.colorSwatchActive : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Chọn màu ${c}`}
                />
              ))}
            </div>
          </form>
        </Modal>
      )}

      {holdersModalBadge && (
        <Modal
          title={`Hội viên giữ huy hiệu: ${holdersModalBadge.name}`}
          onClose={closeHoldersModal}
          footer={
            confirmingDelete ? (
              <>
                <span className={styles.confirmText}>Xóa huy hiệu này khỏi tất cả hội viên?</span>
                <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(false)}>
                  Hủy
                </Button>
                <Button variant="danger" size="sm" onClick={handleDeleteBadge}>
                  Xác nhận xóa
                </Button>
              </>
            ) : (
              <Button variant="danger" size="sm" onClick={() => setConfirmingDelete(true)}>
                <Trash2 size={14} /> Xóa huy hiệu
              </Button>
            )
          }
        >
          {holders.length === 0 ? (
            <p className={styles.badgeDesc}>Chưa có hội viên nào giữ huy hiệu này.</p>
          ) : (
            <ul className={styles.holderList}>
              {holders.map((h) => (
                <li key={h.id} className={styles.holderItem}>
                  <span className={styles.holderAvatar}>{h.avatarInitials}</span>
                  {h.name}
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </div>
  );
}
