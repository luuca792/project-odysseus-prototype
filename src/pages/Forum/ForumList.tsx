import { Link } from 'react-router-dom';
import { Plus, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { usePermission } from '../../context/usePermission';
import { useNotifications } from '../../context/NotificationContext';
import { getUserById } from '../../mock-data/users';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge/Badge';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { NotificationDot } from '../../components/NotificationDot/NotificationDot';
import styles from './Forum.module.css';

export function ForumList() {
  const { currentUser, activeSubAssociationId } = useAuth();
  const { posts } = useAppData();
  const canModerate = usePermission('moderate-posts');
  const { isPostUnread } = useNotifications();
  if (!currentUser) return null;

  const visiblePosts = posts.filter(
    (p) =>
      p.postType === 'forum' &&
      p.subAssociationId === activeSubAssociationId &&
      (canModerate || p.status === 'published'),
  );

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1>Diễn đàn</h1>
          <p className={styles.pageDescription}>Trao đổi về hoạt động chi hội, hoạt động trường, đời sống sinh viên.</p>
        </div>
        <Link to="/forum/new">
          <Button>
            <Plus size={16} /> Tạo bài viết
          </Button>
        </Link>
      </div>

      {visiblePosts.length === 0 ? (
        <EmptyState title="Chưa có bài viết nào" />
      ) : (
        <div className={styles.list}>
          {visiblePosts.map((p) => {
            const author = getUserById(p.authorId);
            return (
              <Link key={p.id} to={`/forum/${p.id}`} className={styles.postLink}>
                <Card interactive className={styles.postCard}>
                  <div className={styles.postHeader}>
                    <Badge tone="info">{p.topic}</Badge>
                    {p.status === 'hidden' && <Badge tone="warning">Đã ẩn</Badge>}
                  </div>
                  <h3 className={styles.postTitle}>
                    {isPostUnread(p.id) && <NotificationDot className={styles.postDot} />}
                    {p.title}
                  </h3>
                  <p className={styles.postExcerpt}>{p.content}</p>
                  <div className={styles.postFooter}>
                    <span>{author?.name ?? 'Ẩn danh'}</span>
                    <span className={styles.commentCount}>
                      <MessageCircle size={14} /> {p.comments.length}
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
