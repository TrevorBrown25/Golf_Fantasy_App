import styles from './FieldFallbackBanner.module.css';

interface Props {
  message: string;
}

export function FieldFallbackBanner({ message }: Props) {
  return (
    <div className={styles.banner} role="status" aria-live="polite">
      {message}
    </div>
  );
}
