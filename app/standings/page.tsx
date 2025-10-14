import { StandingsTable } from '@/components/StandingsTable';
import { ownersData } from '@/lib/data';
import { applyTiebreakers, computeStandings } from '@/lib/rules';
import styles from './page.module.css';

export default function StandingsPage() {
  const standings = computeStandings();
  const ordered = applyTiebreakers(standings);
  const right = ordered.filter((row) => row.divisionId === 'RIGHT_SHARKS');
  const left = ordered.filter((row) => row.divisionId === 'LEFT_SHARKS');

  return (
    <div className={styles.page}>
      <h1>Standings & Tiebreakers</h1>
      <p className={styles.helper}>
        Division crowns honor the top record within each side of the league. Wildcard spots are awarded based on season earnings
        after tie resolutions.
      </p>
      <section>
        <h2>Overall</h2>
        <StandingsTable rows={ordered} owners={ownersData} />
      </section>
      <section className={styles.divisionGrid}>
        <div>
          <h3>Right Sharks</h3>
          <StandingsTable rows={right} owners={ownersData} />
        </div>
        <div>
          <h3>Left Sharks</h3>
          <StandingsTable rows={left} owners={ownersData} />
        </div>
      </section>
    </div>
  );
}
