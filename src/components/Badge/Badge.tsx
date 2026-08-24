import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type Tone = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  outline?: boolean;
}

export function Badge({ children, tone = 'neutral', outline = false }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[tone]} ${outline ? styles.outline : ''}`}>
      {children}
    </span>
  );
}
