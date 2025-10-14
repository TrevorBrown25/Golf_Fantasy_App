'use client';

import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

interface Props {
  message: string;
  duration?: number;
}

export function Toast({ message, duration = 3000 }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {message}
    </div>
  );
}
