import { useState, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { usePermission } from '../../context/usePermission';
import { getUserById } from '../../mock-data/users';
import type { FeedbackStatus } from '../../mock-data/types';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge/Badge';
import { TextAreaField, SelectField } from '../../components/FormField/FormField';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { useToast } from '../../components/Toast/ToastContext';
import styles from './Feedback.module.css';

const TOPIC_OPTIONS = [
  { value: 'Hoạt động', label: 'Hoạt động' },
  { value: 'Truyền thông', label: 'Truyền thông' },
  { value: 'Tài chính', label: 'Tài chính' },
  { value: 'Khác', label: 'Khác' },
];

export function Feedback() {
  const { currentUser, activeSubAssociationId } = useAuth();
  const { posts, addPost, setFeedbackStatus } = useAppData();
  const canViewAll = usePermission('view-all-feedback');
  const canRespond = usePermission('respond-feedback');
  const { showToast } = useToast();
  const [topic, setTopic] = useState(TOPIC_OPTIONS[0].value);
  const [content, setContent] = useState('');

  if (!currentUser) return null;

  const feedbackPosts = posts.filter((p) => p.postType === 'feedback' && p.subAssociationId === activeSubAssociationId);
  const scoped = canViewAll ? feedbackPosts : feedbackPosts.filter((f) => f.authorId === currentUser.id);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!currentUser || !activeSubAssociationId || !content.trim()) return;
    addPost({
      id: `fb-${Date.now()}`,
      subAssociationId: activeSubAssociationId,
      authorId: currentUser.id,
      postType: 'feedback',
      title: topic,
      topic,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      status: 'new',
      comments: [],
    });
    showToast('Đã gửi góp ý của bạn.');
    setContent('');
  }

  return (
    <div>
      <h1>Góp ý & Phản hồi</h1>
      <p className={styles.pageDescription}>
        Gửi ý kiến đóng góp hoặc phản hồi cho Ban Chấp Hành.{' '}
        <span className={styles.assumptionNote}>
          ⚠ Quy trình xử lý góp ý (ai duyệt, phản hồi thế nào) chưa được nêu rõ trong yêu cầu gốc — bản dựng thử tạm dùng trạng thái
          "Mới" / "Đã xem xét" do BCH cập nhật thủ công.
        </span>
      </p>

      <Card className={styles.formCard}>
        <h2 className={styles.formTitle}>Tạo góp ý mới</h2>
        <form onSubmit={handleSubmit}>
          <SelectField label="Chủ đề" options={TOPIC_OPTIONS} value={topic} onChange={(e) => setTopic(e.target.value)} />
          <TextAreaField
            label="Nội dung"
            placeholder="Nhập nội dung góp ý hoặc phản hồi..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Button type="submit" disabled={!content.trim()}>
            Gửi góp ý
          </Button>
        </form>
      </Card>

      <h2 className={styles.sectionTitle}>{canViewAll ? 'Danh sách góp ý' : 'Góp ý của tôi'}</h2>
      {scoped.length === 0 ? (
        <EmptyState title="Chưa có góp ý nào" />
      ) : (
        <div className={styles.list}>
          {scoped.map((f) => {
            const author = getUserById(f.authorId);
            const status = f.status as FeedbackStatus;
            return (
              <Card key={f.id} className={styles.feedbackCard}>
                <div className={styles.feedbackHeader}>
                  <div>
                    <span className={styles.feedbackTopic}>{f.topic}</span>
                    <span className={styles.feedbackAuthor}> · {author?.name ?? 'Ẩn danh'}</span>
                  </div>
                  <Badge tone={status === 'new' ? 'warning' : 'success'}>
                    {status === 'new' ? 'Mới' : 'Đã xem xét'}
                  </Badge>
                </div>
                <p className={styles.feedbackContent}>{f.content}</p>
                {canRespond && status === 'new' && (
                  <Button variant="secondary" size="sm" onClick={() => setFeedbackStatus(f.id, 'reviewed')}>
                    Đánh dấu đã xem xét
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
