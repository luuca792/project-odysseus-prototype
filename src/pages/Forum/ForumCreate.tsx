import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { TextField, TextAreaField, SelectField } from '../../components/FormField/FormField';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast/ToastContext';
import styles from './Forum.module.css';

const TOPIC_OPTIONS = [
  { value: 'Hoạt động chi hội', label: 'Hoạt động chi hội' },
  { value: 'Hoạt động trường', label: 'Hoạt động trường' },
  { value: 'Đời sống sinh viên', label: 'Đời sống sinh viên' },
  { value: 'Khác', label: 'Khác' },
];

export function ForumCreate() {
  const { currentUser, activeSubAssociationId } = useAuth();
  const { addPost } = useAppData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState(TOPIC_OPTIONS[0].value);
  const [content, setContent] = useState('');

  if (!currentUser) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!currentUser || !activeSubAssociationId || !title.trim() || !content.trim()) return;
    const id = `post-${Date.now()}`;
    addPost({
      id,
      subAssociationId: activeSubAssociationId,
      authorId: currentUser.id,
      postType: 'forum',
      title: title.trim(),
      topic,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      status: 'published',
      comments: [],
    });
    showToast('Đã đăng bài viết.');
    navigate(`/forum/${id}`);
  }

  return (
    <div>
      <h1>Tạo bài viết mới</h1>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <TextField label="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <SelectField label="Chủ đề" options={TOPIC_OPTIONS} value={topic} onChange={(e) => setTopic(e.target.value)} />
        <TextAreaField label="Nội dung" value={content} onChange={(e) => setContent(e.target.value)} required />
        <div className={styles.formActions}>
          <Button type="submit" disabled={!title.trim() || !content.trim()}>
            Đăng bài
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
}
