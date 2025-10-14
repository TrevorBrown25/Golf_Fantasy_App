'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './LockCountdown.module.css';

interface Props {
  lockAt: string;
}

function formatRemaining(diff: number) {
  if (diff <= 0) {
    return 'Locked';
  }
  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

export function LockCountdown({ lockAt }: Props) {
  const lockTime = useMemo(() => new Date(lockAt).getTime(), [lockAt]);
  const [remaining, setRemaining] = useState(() => lockTime - Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(lockTime - Date.now());
    }, 1000 * 30);

    return () => window.clearInterval(timer);
  }, [lockTime]);

  const isLocked = remaining <= 0;

  return (
    <div className={styles.countdown} aria-live="polite">
      <span className={styles.label}>Lock</span>
      <span className={styles.value} data-state={isLocked ? 'locked' : 'open'}>
        {formatRemaining(remaining)}
      </span>
    </div>
  );
}
