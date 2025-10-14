import styles from './Bracket.module.css';
import type { PlayoffSeed, Owner } from '@/lib/types';

interface Match {
  seedA: PlayoffSeed;
  seedB: PlayoffSeed;
  title: string;
}

interface Props {
  seeds: PlayoffSeed[];
  owners: Owner[];
}

export function Bracket({ seeds, owners }: Props) {
  const sorted = [...seeds].sort((a, b) => a.seed - b.seed);
  const matchups: Match[] = [
    {
      seedA: sorted[0],
      seedB: sorted[3],
      title: 'Semifinal: #1 vs #4'
    },
    {
      seedA: sorted[1],
      seedB: sorted[2],
      title: 'Semifinal: #2 vs #3'
    }
  ];

  const ownerName = (id: string) => owners.find((o) => o.id === id)?.name ?? id;

  return (
    <div className={styles.bracket}>
      {matchups.map((match) => (
        <section key={match.title} className={styles.match}>
          <h3>{match.title}</h3>
          <p>
            {ownerName(match.seedA.ownerId)} (Save +{match.seedA.savedPlaysGranted}) vs{' '}
            {ownerName(match.seedB.ownerId)} (Save +{match.seedB.savedPlaysGranted})
          </p>
        </section>
      ))}
      {sorted.length === 4 && (
        <section className={styles.match}>
          <h3>Final — BMW Championship</h3>
          <p>Higher seed drafts first</p>
        </section>
      )}
    </div>
  );
}
