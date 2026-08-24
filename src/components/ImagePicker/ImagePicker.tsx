import { ImageIcon, Check } from 'lucide-react';
import styles from './ImagePicker.module.css';

const PLACEHOLDER_IDS = [
  'placeholder-1',
  'placeholder-2',
  'placeholder-3',
  'placeholder-4',
  'placeholder-5',
  'placeholder-6',
  'placeholder-7',
  'placeholder-8',
];

const PLACEHOLDER_HUES: Record<string, number> = Object.fromEntries(
  PLACEHOLDER_IDS.map((id, i) => [id, (i * 47) % 360]),
);

export function placeholderStyle(imageId: string) {
  const hue = PLACEHOLDER_HUES[imageId] ?? 210;
  return { background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${hue + 40} 70% 45%))` };
}

interface ImagePickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function ImagePicker({ selectedIds, onChange }: ImagePickerProps) {
  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <div>
      <div className={styles.grid}>
        {PLACEHOLDER_IDS.map((id) => {
          const selected = selectedIds.includes(id);
          return (
            <button
              type="button"
              key={id}
              className={`${styles.tile} ${selected ? styles.selected : ''}`}
              style={placeholderStyle(id)}
              onClick={() => toggle(id)}
            >
              {selected ? <Check size={18} /> : <ImageIcon size={18} />}
            </button>
          );
        })}
      </div>
      <p className={styles.note}>Chọn ảnh minh họa từ thư viện mẫu (bản dựng thử không hỗ trợ tải ảnh thật).</p>
    </div>
  );
}
