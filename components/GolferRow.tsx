import styles from './GolferRow.module.css';
import type { Golfer } from '@/lib/types';
import { UsageBadge } from './UsageBadge';

interface Props {
  golfer: Golfer;
  usage: number;
  onPick?: () => void;
  disabled?: boolean;
}

export function GolferRow({ golfer, usage, onPick, disabled }: Props) {
  return (
    <div className={styles.row}>
      <div>
        <p className={styles.name}>{golfer.name}</p>
        <p className={styles.rank}>World Rank #{golfer.worldRank ?? '—'}</p>
      </div>
      <div className={styles.actions}>
        <UsageBadge used={usage} limit={3} />
        {onPick && (
          <button
            type="button"
            onClick={onPick}
            className={styles.button}
            disabled={disabled}
          >
            Pick
          </button>
        )}
      </div>
    </div>
  );
}
