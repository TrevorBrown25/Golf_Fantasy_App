import { Bracket } from '@/components/Bracket';
import { ownersData } from '@/lib/data';
import { computeStandings, grantPlayoffSaves, seedPlayoffs } from '@/lib/rules';
import styles from './page.module.css';

export default function PlayoffsPage() {
  const standings = computeStandings();
  const seeds = grantPlayoffSaves(seedPlayoffs(standings));

  return (
    <div className={styles.page}>
      <h1>Playoff Bracket</h1>
      <p className={styles.helper}>
        Division winners hold the top seeds and extra saves. Semifinals run at the FedEx St. Jude Championship, with the BMW Championship hosting the title match.
      </p>
      <Bracket seeds={seeds} owners={ownersData} />
    </div>
  );
}
