import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
  interactive?: boolean;
}

export function Card({ children, padded = true, interactive = false, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`${styles.card} ${padded ? styles.padded : ''} ${interactive ? styles.interactive : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
