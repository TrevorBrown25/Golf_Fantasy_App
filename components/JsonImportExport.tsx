'use client';

import { ChangeEvent } from 'react';
import styles from './JsonImportExport.module.css';

interface Props<T> {
  label: string;
  data: T;
  onImport: (value: T) => void;
}

export function JsonImportExport<T>({ label, data, onImport }: Props<T>) {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${label.toLowerCase().replace(/\s+/g, '-')}-snapshot.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file.text().then((content) => {
      try {
        const parsed = JSON.parse(content);
        onImport(parsed);
      } catch (error) {
        // eslint-disable-next-line no-alert
        alert('Invalid JSON file');
      }
    });
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleExport} className={styles.button}>
        Download Snapshot
      </button>
      <label className={styles.importLabel}>
        <span>Import Snapshot</span>
        <input type="file" accept="application/json" onChange={handleImport} />
      </label>
    </div>
  );
}
