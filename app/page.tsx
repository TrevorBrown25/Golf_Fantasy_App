import { LockCountdown } from '@/components/LockCountdown';
import { SaveCreditChip } from '@/components/SaveCreditChip';
import { StandingsTable } from '@/components/StandingsTable';
import { ownersData, weeksData } from '@/lib/data';
import { computeStandings, grantPlayoffSaves, seedPlayoffs } from '@/lib/rules';
import styles from './page.module.css';

export default function DashboardPage() {
  const currentWeek = weeksData[0];
  const standings = computeStandings();
  const seeds = grantPlayoffSaves(seedPlayoffs(standings));

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <h1>MHS Golf Dayz</h1>
          <p>The complete league operations hub for our multi-division fantasy golf season.</p>
        </div>
        <div className={styles.lockPanel}>
          <h2>{currentWeek ? `Week ${currentWeek.id.split('-')[1]} — Draft Center` : 'Off Week'}</h2>
          {currentWeek && <LockCountdown lockAt={currentWeek.lockAt} />}
          <SaveCreditChip count={3} />
        </div>
      </section>

      <section>
        <h2>Playoff Outlook</h2>
        <div className={styles.seedGrid}>
          {seeds.map((seed) => {
            const owner = ownersData.find((o) => o.id === seed.ownerId);
            return (
              <div key={seed.seed} className={styles.seedCard}>
                <p className={styles.seedLabel}>Seed #{seed.seed}</p>
                <p className={styles.seedOwner}>{owner?.name}</p>
                <p className={styles.seedSave}>Save grants: +{seed.savedPlaysGranted}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <StandingsTable rows={standings} owners={ownersData} />
      </section>
    </div>
  );
}
