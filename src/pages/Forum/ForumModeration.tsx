import { Link } from 'react-router-dom';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getUserById } from '../../mock-data/users';
import type { ForumStatus } from '../../mock-data/types';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge/Badge';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { useToast } from '../../components/Toast/ToastContext';
import styles from './Forum.module.css';

export function ForumModeration() {
  const { currentUser, activeSubAssociationId } = useAuth();
  const { posts, setForumStatus, deletePost } = useAppData();
  const { showToast } = useToast();
  if (!currentUser) return null;

  const scoped = posts.filter((p) => p.postType === 'forum' && p.subAssociationId === activeSubAssociationId);

  function handleToggle(postId: string, currentStatus: ForumStatus) {
    const next = currentStatus === 'published' ? 'hidden' : 'published';
    setForumStatus(postId, next);
    showToast(next === 'hidden' ? 'Đã ẩn bài viết.' : 'Đã hiện lại bài viết.');
  }

  function handleDelete(postId: string) {
    deletePost(postId);
    showToast('Đã xóa bài viết.');
  }

  return (
    <div>
      <h1>Kiểm duyệt diễn đàn</h1>
      <p className={styles.pageDescription}>Duyệt, ẩn hoặc xóa bài viết trên diễn đàn của chi hội.</p>

      {scoped.length === 0 ? (
        <EmptyState title="Chưa có bài viết nào" />
      ) : (
        <div className={styles.list} style={{ maxWidth: 'none' }}>
          {scoped.map((p) => {
            const author = getUserById(p.authorId);
            const status = p.status as ForumStatus;
            return (
              <Card key={p.id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <Badge tone="info">{p.topic}</Badge>
                  <Badge tone={status === 'published' ? 'success' : 'warning'}>
                    {status === 'published' ? 'Đang hiển thị' : 'Đã ẩn'}
                  </Badge>
                </div>
                <Link to={`/forum/${p.id}`} className={styles.postTitle} style={{ display: 'block' }}>
                  {p.title}
                </Link>
                <p className={styles.postExcerpt}>{p.content}</p>
                <div className={styles.postFooter} style={{ marginBottom: 'var(--space-3)' }}>
                  <span>{author?.name ?? 'Ẩn danh'}</span>
                  <span>{p.comments.length} bình luận</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Button variant="secondary" size="sm" onClick={() => handleToggle(p.id, status)}>
                    {status === 'published' ? (
                      <>
                        <EyeOff size={14} /> Ẩn
                      </>
                    ) : (
                      <>
                        <Eye size={14} /> Hiện lại
                      </>
                    )}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>
                    <Trash2 size={14} /> Xóa
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
