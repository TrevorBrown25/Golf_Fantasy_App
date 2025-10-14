'use client';

import { useMemo, useState } from 'react';
import { AuctionBidRow } from '@/components/AuctionBidRow';
import { BudgetPill } from '@/components/BudgetPill';
import { MarbleRace } from '@/components/MarbleRace';
import { ownersData } from '@/lib/data';
import type { AuctionBid } from '@/lib/types';
import styles from './page.module.css';

const sampleBids: AuctionBid[] = [
  { ownerId: 'bryce', golferId: 'g001', amount: 100 },
  { ownerId: 'tl', golferId: 'g001', amount: 100 },
  { ownerId: 'nick', golferId: 'g002', amount: 88 }
];

export default function MajorsPage() {
  const [winner, setWinner] = useState<string | null>(null);
  const tied = useMemo(() => sampleBids.filter((bid) => bid.amount === 100), []);

  return (
    <div className={styles.page}>
      <header>
        <h1>Calcutta Control Center</h1>
        <p>Manage major championship auctions, track budgets, and resolve $100 ties with a marble race.</p>
      </header>

      <section className={styles.panel}>
        <div className={styles.topRow}>
          {ownersData.slice(0, 4).map((owner) => (
            <BudgetPill key={owner.id} amount={100} />
          ))}
        </div>
        <div className={styles.bidList}>
          {sampleBids.map((bid) => (
            <AuctionBidRow key={`${bid.ownerId}-${bid.golferId}`} bid={bid} owners={ownersData} />
          ))}
        </div>
      </section>

      <section className={styles.race}>
        <h2>Marble Race Tiebreaker</h2>
        <p className={styles.helper}>Run this when multiple owners reach the $100 ceiling on the same golfer.</p>
        <MarbleRace racers={tied.map((bid) => ({ name: ownersData.find((o) => o.id === bid.ownerId)?.name ?? bid.ownerId }))} onFinish={setWinner} />
        {winner && <p className={styles.winner}>Winner: {winner}</p>}
      </section>
    </div>
  );
}
