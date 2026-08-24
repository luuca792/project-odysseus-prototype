import styles from './NotificationDot.module.css';

// Small red indicator used to mock "there's something new here" across the
// prototype (nav items, activity cards, forum posts). Purely visual — see
// context/NotificationContext.tsx for the read/unread state it reflects.
export function NotificationDot({ className = '' }: { className?: string }) {
  return <span className={`${styles.dot} ${className}`} aria-hidden="true" />;
}
