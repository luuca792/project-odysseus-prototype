import { useState } from 'react';
import { FileText, X, Plus } from 'lucide-react';
import { Button } from '../Button';
import styles from './DocumentPicker.module.css';

interface DocumentPickerProps {
  documents: { name: string; size: string }[];
  onChange: (documents: { name: string; size: string }[]) => void;
}

const MOCK_NAMES = ['Ke-hoach-hoat-dong.docx', 'Du-tru-kinh-phi.xlsx', 'Van-kien-to-chuc.pdf'];

export function DocumentPicker({ documents, onChange }: DocumentPickerProps) {
  const [mockIndex, setMockIndex] = useState(0);

  function addMockDocument() {
    const name = MOCK_NAMES[mockIndex % MOCK_NAMES.length];
    const size = `${(Math.random() * 900 + 50).toFixed(0)} KB`;
    onChange([...documents, { name, size }]);
    setMockIndex((i) => i + 1);
  }

  function removeDocument(index: number) {
    onChange(documents.filter((_, i) => i !== index));
  }

  return (
    <div>
      {documents.length > 0 && (
        <ul className={styles.list}>
          {documents.map((doc, i) => (
            <li key={`${doc.name}-${i}`} className={styles.item}>
              <FileText size={16} />
              <span className={styles.name}>{doc.name}</span>
              <span className={styles.size}>{doc.size}</span>
              <button type="button" className={styles.removeBtn} onClick={() => removeDocument(i)} aria-label="Xóa tài liệu">
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Button type="button" variant="secondary" size="sm" onClick={addMockDocument}>
        <Plus size={14} /> Thêm tài liệu (giả lập)
      </Button>
      <p className={styles.note}>Chỉ dành cho BCH xem. Bản dựng thử không hỗ trợ tải tệp thật.</p>
    </div>
  );
}
