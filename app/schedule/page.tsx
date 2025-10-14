'use client';

import { useMemo, useState } from 'react';
import { DivisionSelector } from '@/components/DivisionSelector';
import { LockCountdown } from '@/components/LockCountdown';
import { ownersData, tournamentsData, weeksData } from '@/lib/data';
import type { DivisionId, OwnerId } from '@/lib/types';
import styles from './page.module.css';

export default function SchedulePage() {
  const [divisionFilter, setDivisionFilter] = useState<DivisionId | 'ALL'>('ALL');
  const [ownerFilter, setOwnerFilter] = useState<OwnerId | 'ALL'>('ALL');

  const filteredWeeks = useMemo(() => {
    return weeksData.filter((week) => {
      const ownerMatch =
        ownerFilter === 'ALL' || week.homeOwnerId === ownerFilter || week.awayOwnerId === ownerFilter;
      if (!ownerMatch) return false;
      if (divisionFilter === 'ALL') return true;
      const owners = ownersData.filter((owner) => owner.divisionId === divisionFilter);
      return owners.some((owner) => owner.id === week.homeOwnerId || owner.id === week.awayOwnerId);
    });
  }, [divisionFilter, ownerFilter]);

  return (
    <div className={styles.page}>
      <header className={styles.filters}>
        <DivisionSelector value={divisionFilter} onChange={setDivisionFilter} />
        <label className={styles.ownerFilter}>
          <span>Owner</span>
          <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value as OwnerId | 'ALL')}>
            <option value="ALL">All Owners</option>
            {ownersData.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>
        </label>
      </header>
      <ul className={styles.list}>
        {filteredWeeks.map((week) => {
          const tournament = tournamentsData.find((t) => t.id === week.tournamentId);
          return (
            <li key={week.id} className={styles.card}>
              <div>
                <h3>{tournament?.name}</h3>
                <p>
                  {ownersData.find((o) => o.id === week.homeOwnerId)?.name} vs{' '}
                  {ownersData.find((o) => o.id === week.awayOwnerId)?.name}
                </p>
                <p className={styles.dateRange}>
                  {tournament?.startDate} → {tournament?.endDate}
                </p>
              </div>
              <LockCountdown lockAt={week.lockAt} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
