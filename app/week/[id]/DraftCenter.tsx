'use client';

import { useMemo, useState } from 'react';
import { DraftTurnBar } from '@/components/DraftTurnBar';
import { FieldFallbackBanner } from '@/components/FieldFallbackBanner';
import { GolferRow } from '@/components/GolferRow';
import { PickCard } from '@/components/PickCard';
import { LockCountdown } from '@/components/LockCountdown';
import { Toast } from '@/components/Toast';
import type { Golfer, Owner, Pick, Week } from '@/lib/types';
import styles from './DraftCenter.module.css';

interface Props {
  week: Week;
  homeOwner?: Owner;
  awayOwner?: Owner;
  golfers: Golfer[];
}

const SEQUENCE = ['home', 'away', 'away', 'home', 'home', 'away', 'away', 'home'] as const;

type Role = typeof SEQUENCE[number];

export default function DraftCenter({ week, homeOwner, awayOwner, golfers }: Props) {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const ownerMap: Record<Role, Owner | undefined> = useMemo(
    () => ({ home: homeOwner, away: awayOwner }),
    [homeOwner, awayOwner]
  );

  const currentRole = SEQUENCE[picks.length] ?? null;
  const activeOwner = currentRole ? ownerMap[currentRole] : undefined;

  const usageCounts = useMemo(() => {
    const usage = new Map<string, number>();
    picks.forEach((pick) => {
      const key = `${pick.ownerId}-${pick.golferId}`;
      usage.set(key, (usage.get(key) ?? 0) + 1);
    });
    return usage;
  }, [picks]);

  const handlePick = (golfer: Golfer) => {
    if (!activeOwner) return;
    const key = `${activeOwner.id}-${golfer.id}`;
    const priorUsage = usageCounts.get(key) ?? 0;
    if (priorUsage >= 3) {
      setToast(`${golfer.name} is usage-capped. Field fallback will be applied.`);
      setPicks((prev) =>
        prev.concat({
          ownerId: activeOwner.id,
          golferId: golfer.id,
          weekId: week.id,
          usageNumber: priorUsage + 1,
          isProhibited: true
        })
      );
      return;
    }
    setPicks((prev) =>
      prev.concat({
        ownerId: activeOwner.id,
        golferId: golfer.id,
        weekId: week.id,
        usageNumber: priorUsage + 1
      })
    );
  };

  const removePick = (index: number) => {
    setPicks((prev) => prev.filter((_, idx) => idx !== index));
  };

  const lockReached = new Date(week.lockAt).getTime() < Date.now();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>{homeOwner?.name} vs {awayOwner?.name}</h1>
          <p>Draft order follows the snake pattern. Picks freeze at lock.</p>
        </div>
        <LockCountdown lockAt={week.lockAt} />
      </header>

      <DraftTurnBar
        owners={[homeOwner, awayOwner].filter(Boolean) as Owner[]}
        activeOwnerId={activeOwner?.id ?? ''}
        sequence={SEQUENCE.map((role) => (role === 'home' ? homeOwner?.id ?? '' : awayOwner?.id ?? ''))}
        pickIndex={picks.length}
      />

      {lockReached && (
        <FieldFallbackBanner message="Draft is locked. Picks are now read-only." />
      )}

      <section className={styles.picks}>
        <h2>Selections</h2>
        {picks.length === 0 && <p className={styles.empty}>No golfers drafted yet.</p>}
        {picks.map((pick, index) => {
          const golfer = golfers.find((player) => player.id === pick.golferId);
          const usage = usageCounts.get(`${pick.ownerId}-${pick.golferId}`) ?? pick.usageNumber;
          return (
            <PickCard
              key={`${pick.ownerId}-${pick.golferId}-${index}`}
              pick={pick}
              golfer={golfer}
              usageCount={usage}
              onRemove={lockReached ? undefined : () => removePick(index)}
            />
          );
        })}
      </section>

      <section className={styles.pool}>
        <h2>Golfer Pool</h2>
        <div className={styles.list}>
          {golfers.map((golfer) => {
            const taken = picks.some((pick) => pick.golferId === golfer.id && pick.ownerId === activeOwner?.id);
            return (
              <GolferRow
                key={golfer.id}
                golfer={golfer}
                usage={usageCounts.get(`${activeOwner?.id}-${golfer.id}`) ?? 0}
                onPick={lockReached ? undefined : () => handlePick(golfer)}
                disabled={lockReached || taken}
              />
            );
          })}
        </div>
      </section>

      {toast && <Toast message={toast} />}
    </div>
  );
}
