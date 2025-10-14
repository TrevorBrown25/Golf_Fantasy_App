'use client';

import styles from './DivisionSelector.module.css';
import type { DivisionId } from '@/lib/types';

interface Props {
  value: DivisionId | 'ALL';
  onChange: (value: DivisionId | 'ALL') => void;
}

export function DivisionSelector({ value, onChange }: Props) {
  return (
    <div className={styles.selector}>
      <label htmlFor="division-filter">Division</label>
      <select
        id="division-filter"
        value={value}
        onChange={(event) => onChange(event.target.value as DivisionId | 'ALL')}
      >
        <option value="ALL">All</option>
        <option value="RIGHT_SHARKS">Right Sharks</option>
        <option value="LEFT_SHARKS">Left Sharks</option>
      </select>
    </div>
  );
}
