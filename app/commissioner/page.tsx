'use client';

import { useMemo, useState } from 'react';
import { JsonImportExport } from '@/components/JsonImportExport';
import { EscalationNotice } from '@/components/EscalationNotice';
import { FieldFallbackBanner } from '@/components/FieldFallbackBanner';
import useLeagueStore from '@/store/useLeagueStore';
import { ownersData, weeksData } from '@/lib/data';
import styles from './page.module.css';

export default function CommissionerPage() {
  const { escalationLog, resolveEscalation, clearState } = useLeagueStore();
  const [toast, setToast] = useState<string | null>(null);

  const pending = useMemo(() => escalationLog.filter((entry) => !entry.resolved), [escalationLog]);

  return (
    <div className={styles.page}>
      <h1>Commissioner Toolkit</h1>
      <p className={styles.helper}>
        Manage escalations, mark absent owners, and keep a pristine audit trail for overrides and fallbacks.
      </p>

      <section className={styles.section}>
        <h2>Escalation Log</h2>
        {pending.length === 0 && <p className={styles.empty}>No active escalations.</p>}
        {pending.map((entry) => {
          const week = weeksData.find((w) => w.id === entry.weekId);
          const willing = ownersData.find((o) => o.id === entry.willingOwnerId);
          return (
            <article key={`${entry.weekId}-${entry.willingOwnerId}`} className={styles.escalationCard}>
              <EscalationNotice
                message={`${willing?.name} escalated Week ${entry.weekId} vs ${week?.awayOwnerId === entry.willingOwnerId ? ownersData.find((o) => o.id === week?.homeOwnerId)?.name : ownersData.find((o) => o.id === week?.awayOwnerId)?.name}`}
              />
              <button
                type="button"
                className={styles.resolve}
                onClick={() => {
                  resolveEscalation(entry.weekId);
                  setToast('Escalation resolved with forfeit.');
                }}
              >
                Resolve Forfeit
              </button>
              <FieldFallbackBanner message="Absent owner receives four field auto-plays with no save eligibility." />
            </article>
          );
        })}
      </section>

      <section className={styles.section}>
        <h2>Data Snapshots</h2>
        <JsonImportExport
          label="League"
          data={{ weeks: weeksData, owners: ownersData, escalations: escalationLog }}
          onImport={() => setToast('League snapshot imported (demo).')}
        />
        <button type="button" className={styles.clear} onClick={() => clearState()}>
          Reset Local State
        </button>
      </section>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
