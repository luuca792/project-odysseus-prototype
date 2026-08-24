import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { usePermission } from '../../context/usePermission';
import { useNotifications } from '../../context/NotificationContext';
import { getUserById } from '../../mock-data/users';
import type { ForumStatus } from '../../mock-data/types';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button';
import { CommentThread } from '../../components/CommentThread/CommentThread';
import { useToast } from '../../components/Toast/ToastContext';
import styles from './Forum.module.css';

export function ForumDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { posts, addComment, setForumStatus, deletePost } = useAppData();
  const canModerate = usePermission('moderate-posts');
  const { markPostRead } = useNotifications();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) markPostRead(id);
  }, [id, markPostRead]);

  const post = posts.find((p) => p.id === id && p.postType === 'forum');
  if (!currentUser || !post) return <p>Không tìm thấy bài viết.</p>;

  const author = getUserById(post.authorId);
  const status = post.status as ForumStatus;

  function handleAddComment(content: string) {
    if (!post) return;
    addComment(post.id, {
      id: `c-${Date.now()}`,
      authorId: currentUser!.id,
      content,
      createdAt: new Date().toISOString(),
    });
  }

  function handleToggleVisibility() {
    if (!post) return;
    const nextStatus = status === 'published' ? 'hidden' : 'published';
    setForumStatus(post.id, nextStatus);
    showToast(nextStatus === 'hidden' ? 'Đã ẩn bài viết.' : 'Đã hiện lại bài viết.');
  }

  function handleDelete() {
    if (!post) return;
    deletePost(post.id);
    showToast('Đã xóa bài viết.');
    navigate('/forum');
  }

  return (
    <div>
      <div className={styles.detailHeader}>
        <Badge tone="info">{post.topic}</Badge>
        {status === 'hidden' && <Badge tone="warning">Đã ẩn</Badge>}
        {canModerate && (
          <div className={styles.moderationActions}>
            <Button variant="secondary" size="sm" onClick={handleToggleVisibility}>
              {status === 'published' ? (
                <>
                  <EyeOff size={14} /> Ẩn bài viết
                </>
              ) : (
                <>
                  <Eye size={14} /> Hiện bài viết
                </>
              )}
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              <Trash2 size={14} /> Xóa
            </Button>
          </div>
        )}
      </div>

      <h1>{post.title}</h1>
      <p className={styles.detailContent}>{post.content}</p>
      <p className={styles.detailFooter}>
        Đăng bởi {author?.name ?? 'Ẩn danh'} · {new Date(post.createdAt).toLocaleDateString('vi-VN')}
      </p>

      <div className={styles.commentsSection}>
        <h2 style={{ fontSize: 'var(--font-size-base)' }}>Bình luận ({post.comments.length})</h2>
        <CommentThread comments={post.comments} onAddComment={handleAddComment} />
      </div>
    </div>
  );
}
