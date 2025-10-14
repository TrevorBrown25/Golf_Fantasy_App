import styles from './DraftTurnBar.module.css';
import type { Owner } from '@/lib/types';

interface Props {
  owners: Owner[];
  activeOwnerId: string;
  sequence: string[];
  pickIndex: number;
}

export function DraftTurnBar({ owners, activeOwnerId, sequence, pickIndex }: Props) {
  return (
    <div className={styles.bar}>
      {sequence.map((ownerId, index) => {
        const owner = owners.find((o) => o.id === ownerId);
        const status = index === pickIndex ? 'current' : index < pickIndex ? 'complete' : 'upcoming';
        return (
          <div key={`${ownerId}-${index}`} className={styles.step} data-status={status}>
            <span>{owner?.name ?? ownerId}</span>
          </div>
        );
      })}
    </div>
  );
}
