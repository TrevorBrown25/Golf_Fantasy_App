import styles from './PickCard.module.css';
import type { Golfer, Pick } from '@/lib/types';
import { UsageBadge } from './UsageBadge';

interface Props {
  pick: Pick;
  golfer: Golfer | undefined;
  usageCount: number;
  onRemove?: () => void;
}

export function PickCard({ pick, golfer, usageCount, onRemove }: Props) {
  return (
    <article className={styles.card}>
      <div>
        <h3>{golfer?.name ?? 'Field Fallback'}</h3>
        <p className={styles.meta}>Usage #{pick.usageNumber}</p>
        {pick.isProhibited && <p className={styles.warning}>Prohibited pick — $0</p>}
      </div>
      <div className={styles.actions}>
        <UsageBadge used={usageCount} limit={pick.viaSave ? 4 : 3} viaSave={pick.viaSave} />
        {onRemove && (
          <button type="button" onClick={onRemove} className={styles.remove}>
            Remove
          </button>
        )}
      </div>
    </article>
  );
}
