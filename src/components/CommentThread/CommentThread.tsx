import { useState } from 'react';
import { Send } from 'lucide-react';
import type { Comment } from '../../mock-data/types';
import { getUserById } from '../../mock-data/users';
import { Button } from '../Button';
import styles from './CommentThread.module.css';

interface CommentThreadProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function CommentThread({ comments, onAddComment }: CommentThreadProps) {
  const [draft, setDraft] = useState('');

  function submit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAddComment(trimmed);
    setDraft('');
  }

  return (
    <div className={styles.wrap}>
      <ul className={styles.list}>
        {comments.map((c) => {
          const author = getUserById(c.authorId);
          return (
            <li key={c.id} className={styles.item}>
              <div className={styles.avatar}>{author?.avatarInitials ?? '?'}</div>
              <div className={styles.body}>
                <div className={styles.meta}>
                  <span className={styles.author}>{author?.name ?? 'Người dùng ẩn danh'}</span>
                  <span className={styles.date}>{formatDate(c.createdAt)}</span>
                </div>
                <p className={styles.content}>{c.content}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={styles.composer}>
        <input
          className={styles.input}
          placeholder="Viết bình luận..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
        />
        <Button size="sm" onClick={submit} disabled={!draft.trim()}>
          <Send size={14} />
        </Button>
      </div>
    </div>
  );
}
