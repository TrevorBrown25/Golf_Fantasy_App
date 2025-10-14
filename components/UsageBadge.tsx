import styles from './UsageBadge.module.css';

interface Props {
  used: number;
  limit: number;
  viaSave?: boolean;
}

export function UsageBadge({ used, limit, viaSave }: Props) {
  const remaining = Math.max(limit - used, 0);
  return (
    <span className={styles.badge} data-variant={remaining === 0 ? 'exhausted' : 'available'}>
      {remaining} left{viaSave ? ' (save)' : ''}
    </span>
  );
}
