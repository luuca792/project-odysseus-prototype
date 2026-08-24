import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button';
import { TextField, TextAreaField, SelectField } from '../../components/FormField/FormField';
import { useToast } from '../../components/Toast/ToastContext';
import styles from './Documents.module.css';

const TEMPLATES = [
  { value: 'plan', label: 'Kế hoạch hoạt động' },
  { value: 'budget', label: 'Dự trù kinh phí' },
  { value: 'official', label: 'Văn kiện' },
];

export function Documents() {
  const { currentUser, activeSubAssociationId } = useAuth();
  const { subAssociations } = useAppData();
  const { showToast } = useToast();
  const [template, setTemplate] = useState(TEMPLATES[0].value);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!currentUser) return null;
  const sa = subAssociations.find((s) => s.id === activeSubAssociationId);

  function handleExport(format: 'word' | 'pdf') {
    showToast(`Xuất file ${format === 'word' ? 'Word' : 'PDF'}: chưa được hỗ trợ trong bản dựng thử.`);
  }

  return (
    <div>
      <h1>Tạo bản in</h1>
      <p className={styles.pageDescription}>
        Chọn mẫu tài liệu, nhập thông tin, và xuất bản dạng Word hoặc PDF.
      </p>

      <div className={styles.layout}>
        <Card className={styles.formCard}>
          <SelectField label="Mẫu tài liệu" options={TEMPLATES} value={template} onChange={(e) => setTemplate(e.target.value)} />
          <TextField label="Tiêu đề tài liệu" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextAreaField label="Nội dung" value={content} onChange={(e) => setContent(e.target.value)} />

          <div className={styles.exportRow}>
            <Button variant="secondary" onClick={() => handleExport('word')}>
              <Download size={14} /> Xuất Word
            </Button>
            <Button variant="secondary" onClick={() => handleExport('pdf')}>
              <Download size={14} /> Xuất PDF
            </Button>
          </div>
          <p className={styles.exportNote}>Chức năng xuất file thật sẽ được xây dựng ở giai đoạn phát triển chính thức.</p>
        </Card>

        <Card className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <FileText size={16} />
            <span>Xem trước</span>
          </div>
          <div className={styles.previewPage}>
            <p className={styles.previewOrg}>HỘI SINH VIÊN ĐẠI HỌC CẦN THƠ</p>
            <p className={styles.previewOrg}>{sa?.name.toUpperCase()}</p>
            <h3 className={styles.previewTitle}>{title || `[Tiêu đề ${TEMPLATES.find((t) => t.value === template)?.label}]`}</h3>
            <p className={styles.previewBody}>{content || 'Nội dung tài liệu sẽ hiển thị ở đây...'}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
