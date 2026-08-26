import { useState, type FormEvent } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSoftwareFeedback } from '../../context/useSoftwareFeedback';
import {
  SOFTWARE_FEEDBACK_CATEGORIES,
  SOFTWARE_FEEDBACK_TYPES,
  type SoftwareFeedbackCategory,
  type SoftwareFeedbackType,
} from '../../mock-data/softwareFeedback';
import { getStatusDisplay } from '../../mock-data/softwareFeedbackStatusLabels';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge/Badge';
import { Modal } from '../../components/Modal/Modal';
import { TextAreaField, SelectField } from '../../components/FormField/FormField';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { useToast } from '../../components/Toast/ToastContext';
import styles from './SoftwareFeedback.module.css';

const CATEGORY_OPTIONS = SOFTWARE_FEEDBACK_CATEGORIES.map((c) => ({ value: c, label: c }));
const TYPE_OPTIONS = SOFTWARE_FEEDBACK_TYPES.map((t) => ({ value: t, label: t }));

export function SoftwareFeedback() {
  const { currentUser } = useAuth();
  const { tickets, loading, error, refresh, addTicket, deleteTicket } = useSoftwareFeedback();
  const { showToast } = useToast();

  const [category, setCategory] = useState<SoftwareFeedbackCategory>(SOFTWARE_FEEDBACK_CATEGORIES[0]);
  const [type, setType] = useState<SoftwareFeedbackType>(SOFTWARE_FEEDBACK_TYPES[0]);
  const [content, setContent] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) return null;

  function resetForm() {
    setCategory(SOFTWARE_FEEDBACK_CATEGORIES[0]);
    setType(SOFTWARE_FEEDBACK_TYPES[0]);
    setContent('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await addTicket({ category, type, content: content.trim() });
      showToast('Đã gửi đóng góp của bạn.');
      resetForm();
      setIsCreateOpen(false);
    } catch {
      showToast('Không thể gửi đóng góp. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTicket(id);
      showToast('Đã xóa đóng góp.');
    } catch {
      showToast('Không thể xóa đóng góp. Vui lòng thử lại.');
    } finally {
      setConfirmingDeleteId(null);
    }
  }

  const sorted = [...tickets].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Đóng góp phần mềm</h1>
          <p className={styles.pageDescription}>
            Chia sẻ ý kiến, đề xuất hoặc phản ánh của bạn về prototype này để nhóm phát triển ghi nhận và xử lý.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} /> Tạo đóng góp mới
        </Button>
      </div>

      {isCreateOpen && (
        <Modal title="Tạo đóng góp mới" onClose={() => setIsCreateOpen(false)}>
          <form onSubmit={handleSubmit}>
            <SelectField
              label="Nhóm"
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={(e) => setCategory(e.target.value as SoftwareFeedbackCategory)}
            />
            <SelectField
              label="Loại"
              options={TYPE_OPTIONS}
              value={type}
              onChange={(e) => setType(e.target.value as SoftwareFeedbackType)}
            />
            <TextAreaField
              label="Nội dung"
              placeholder="Nhập ý kiến, đề xuất hoặc phản ánh của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <Button type="submit" disabled={!content.trim() || submitting}>
              Gửi đóng góp
            </Button>
          </form>
        </Modal>
      )}

      <h2 className={styles.sectionTitle}>Danh sách đóng góp</h2>

      {loading && <p className={styles.pageDescription}>Đang tải danh sách đóng góp...</p>}

      {!loading && error && (
        <EmptyState
          title="Không thể tải danh sách"
          description={error}
          action={
            <Button variant="secondary" size="sm" onClick={() => refresh()}>
              Thử lại
            </Button>
          }
        />
      )}

      {!loading && !error && sorted.length === 0 && <EmptyState title="Chưa có đóng góp nào" />}

      {!loading && !error && sorted.length > 0 && (
        <div className={styles.list}>
          {sorted.map((t) => {
            const status = getStatusDisplay(t.status);
            const isOwner = t.authorId === currentUser.id;
            const isExpanded = expandedId === t.id;
            const canDelete = isOwner && !t.status;
            const hasDetails = Boolean(t.response) || canDelete;
            return (
              <Card key={t.id} className={styles.ticketCard} padded={false}>
                <div className={styles.idTabRow}>
                  <span className={styles.ticketId}>{t.id}</span>
                </div>
                <button
                  type="button"
                  className={styles.ticketRow}
                  aria-expanded={isExpanded}
                  onClick={() => setExpandedId(isExpanded ? null : t.id)}
                >
                  <div className={styles.ticketRowLine}>
                    <span className={styles.tagGroup}>
                      <span className={styles.categoryTag}>{t.category}</span>
                      <span className={styles.typeTag}>{t.type}</span>
                    </span>
                    {status && <Badge tone={status.tone}>{status.label}</Badge>}
                  </div>
                  <div className={styles.ticketRowLine}>
                    <span className={styles.ticketAuthor}>{t.authorName}</span>
                    <span className={styles.ticketDate}>
                      {new Date(t.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className={styles.ticketRowLine}>
                    <span className={`${styles.ticketTitle} ${isExpanded ? styles.ticketTitleExpanded : ''}`}>
                      {t.content}
                    </span>
                    <ChevronDown size={16} className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`} />
                  </div>
                </button>

                {isExpanded && hasDetails && (
                  <div className={styles.ticketDetails}>
                    {t.response && (
                      <div className={styles.responseBlock}>
                        <span className={styles.responseLabel}>Phản hồi từ nhóm phát triển</span>
                        <p className={styles.responseText}>{t.response}</p>
                      </div>
                    )}
                    {canDelete && (
                      <div className={styles.deleteRow}>
                        {confirmingDeleteId === t.id ? (
                          <>
                            <span className={styles.confirmText}>Xóa đóng góp này?</span>
                            <Button variant="ghost" size="sm" onClick={() => setConfirmingDeleteId(null)}>
                              Hủy
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(t.id)}>
                              Xác nhận xóa
                            </Button>
                          </>
                        ) : (
                          <Button variant="danger" size="sm" onClick={() => setConfirmingDeleteId(t.id)}>
                            <Trash2 size={14} /> Xóa
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
