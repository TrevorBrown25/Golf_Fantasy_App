import styles from './EscalationNotice.module.css';

interface Props {
  message: string;
}

export function EscalationNotice({ message }: Props) {
  return (
    <div className={styles.notice} role="alert">
      {message}
    </div>
  );
}
