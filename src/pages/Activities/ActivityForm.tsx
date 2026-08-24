import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import type { Activity, ActivityStatus, ActivityType } from '../../mock-data/types';
import { TextField, TextAreaField, SelectField } from '../../components/FormField/FormField';
import { ImagePicker } from '../../components/ImagePicker/ImagePicker';
import { DocumentPicker } from '../../components/DocumentPicker/DocumentPicker';
import { registerDocumentMedia, getMediaById } from '../../mock-data/media';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast/ToastContext';
import styles from './Activities.module.css';

const TYPE_OPTIONS: { value: ActivityType; label: string }[] = [
  { value: 'volunteer', label: 'Tình nguyện' },
  { value: 'meeting', label: 'Họp lệ' },
  { value: 'organizational', label: 'Tổ chức' },
  { value: 'sports', label: 'Thể thao' },
  { value: 'labor', label: 'Lao động' },
];

const STATUS_OPTIONS: { value: ActivityStatus; label: string }[] = [
  { value: 'upcoming', label: 'Sắp diễn ra' },
  { value: 'ongoing', label: 'Đang diễn ra' },
  { value: 'ended', label: 'Đã kết thúc' },
];

export function ActivityForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { currentUser, activeSubAssociationId } = useAuth();
  const { activities, subAssociations, addActivity, updateActivity } = useAppData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const existing = isEditing ? activities.find((a) => a.id === id) : undefined;
  const termOfOffice = subAssociations.find((s) => s.id === activeSubAssociationId)?.termOfOffice ?? '2025–2026';

  const [title, setTitle] = useState(existing?.title ?? '');
  const [type, setType] = useState<ActivityType>(existing?.type ?? 'organizational');
  const [status, setStatus] = useState<ActivityStatus>(existing?.status ?? 'upcoming');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [date, setDate] = useState(existing?.date ?? '');
  const [location, setLocation] = useState(existing?.location ?? '');
  const [benefits, setBenefits] = useState<string[]>(existing?.benefits ?? []);
  const [benefitDraft, setBenefitDraft] = useState('');
  const [mediaIds, setMediaIds] = useState<string[]>(existing?.mediaIds ?? []);
  const [documents, setDocuments] = useState<{ name: string; size: string }[]>(
    (existing?.documentIds ?? [])
      .map((docId) => getMediaById(docId))
      .filter((m) => m !== undefined)
      .map((m) => ({ name: m.filename ?? '', size: m.size ?? '' })),
  );

  if (!currentUser || !activeSubAssociationId) return null;
  const subAssociationId = activeSubAssociationId;

  function addBenefit() {
    const trimmed = benefitDraft.trim();
    if (!trimmed) return;
    setBenefits((prev) => [...prev, trimmed]);
    setBenefitDraft('');
  }

  function removeBenefit(index: number) {
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const documentIds = documents.map((doc, i) => {
      const docId = `doc-${(existing?.id ?? 'new')}-${i}-${Date.now()}`;
      registerDocumentMedia({ id: docId, kind: 'document', filename: doc.name, size: doc.size });
      return docId;
    });

    if (isEditing && existing) {
      const updated: Activity = {
        ...existing,
        title,
        type,
        status,
        description,
        date,
        location,
        benefits,
        mediaIds,
        documentIds,
      };
      updateActivity(updated);
      showToast('Đã cập nhật hoạt động.');
      navigate(`/activities/${existing.id}`);
    } else {
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        subAssociationId,
        title,
        type,
        status,
        description,
        date,
        location,
        benefits,
        termOfOffice,
        mediaIds,
        participantIds: [],
        documentIds,
      };
      addActivity(newActivity);
      showToast('Đã tạo hoạt động mới.');
      navigate(`/activities/${newActivity.id}`);
    }
  }

  return (
    <div>
      <h1>{isEditing ? 'Sửa hoạt động' : 'Tạo hoạt động mới'}</h1>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <TextField label="Tên hoạt động" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <SelectField
          label="Loại hoạt động"
          options={TYPE_OPTIONS}
          value={type}
          onChange={(e) => setType(e.target.value as ActivityType)}
        />

        <SelectField
          label="Trạng thái"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value as ActivityStatus)}
        />

        <TextAreaField
          label="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <TextField
          label="Thời gian diễn ra"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <TextField label="Địa điểm" value={location} onChange={(e) => setLocation(e.target.value)} required />

        <div>
          <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Lợi ích tham gia
          </label>
          {benefits.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {benefits.map((b, i) => (
                <li key={`${b}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ flex: 1, fontSize: 'var(--font-size-sm)' }}>{b}</span>
                  <button
                    type="button"
                    onClick={() => removeBenefit(i)}
                    aria-label="Xóa lợi ích"
                    style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-subtle)' }}
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder='Ví dụ: "Điểm rèn luyện"'
              value={benefitDraft}
              onChange={(e) => setBenefitDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addBenefit();
                }
              }}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
            />
            <Button type="button" variant="secondary" size="sm" onClick={addBenefit}>
              <Plus size={14} /> Thêm
            </Button>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)', marginTop: 4 }}>
            Ví dụ: Điểm rèn luyện, đạt tiêu chí Tình nguyện tốt của danh hiệu Sinh viên 5 tốt,...
          </p>
        </div>

        <div>
          <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Hình ảnh hoạt động
          </label>
          <ImagePicker selectedIds={mediaIds} onChange={setMediaIds} />
        </div>

        <div style={{ marginTop: 'var(--space-3)' }}>
          <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Tài liệu tổ chức (kế hoạch, dự trù kinh phí...)
          </label>
          <DocumentPicker documents={documents} onChange={setDocuments} />
        </div>

        <div className={styles.formActions}>
          <Button type="submit">{isEditing ? 'Lưu thay đổi' : 'Tạo hoạt động'}</Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
}
