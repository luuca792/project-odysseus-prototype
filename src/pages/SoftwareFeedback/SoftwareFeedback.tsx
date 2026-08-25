import { useState, type FormEvent } from 'react';
import { Trash2 } from 'lucide-react';
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

  if (!currentUser) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await addTicket({ category, type, content: content.trim() });
      showToast('Đã gửi đóng góp của bạn.');
      setContent('');
    } catch {
      showToast('Không thể gửi đóng góp. Vui lòng thử lại.');
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
      <h1>Đóng góp phần mềm</h1>
      <p className={styles.pageDescription}>
        Chia sẻ ý kiến, đề xuất hoặc phản ánh của bạn về prototype này để nhóm phát triển ghi nhận và xử lý.
      </p>

      <Card className={styles.formCard}>
        <h2 className={styles.formTitle}>Tạo đóng góp mới</h2>
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
          <Button type="submit" disabled={!content.trim()}>
            Gửi đóng góp
          </Button>
        </form>
      </Card>

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
            return (
              <Card key={t.id} className={styles.ticketCard}>
                <div className={styles.ticketHeader}>
                  <div>
                    <span className={styles.ticketTag}>{t.category}</span>
                    <span className={styles.ticketTag}>{t.type}</span>
                    <span className={styles.ticketAuthor}>
                      {' '}
                      · {t.authorName} · {new Date(t.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  {status && <Badge tone={status.tone}>{status.label}</Badge>}
                </div>
                <p className={styles.ticketContent}>{t.content}</p>
                {t.response && (
                  <div className={styles.responseBlock}>
                    <span className={styles.responseLabel}>Phản hồi từ nhóm phát triển</span>
                    <p className={styles.responseText}>{t.response}</p>
                  </div>
                )}
                {isOwner && (
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
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
