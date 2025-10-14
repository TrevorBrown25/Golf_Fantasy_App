'use client';

import { useMemo, useState } from 'react';
import { golfersData } from '@/lib/data';
import { GolferRow } from '@/components/GolferRow';
import styles from './page.module.css';

export default function PlayersPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return golfersData;
    return golfersData.filter((golfer) => golfer.name.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Player Pool</h1>
          <p>Search the eligible field and track season usage.</p>
        </div>
        <input
          aria-label="Search golfers"
          className={styles.search}
          placeholder="Search golfers"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </header>
      <section className={styles.section}>
        {filtered.map((golfer) => (
          <GolferRow key={golfer.id} golfer={golfer} usage={0} />
        ))}
      </section>
    </div>
  );
}
