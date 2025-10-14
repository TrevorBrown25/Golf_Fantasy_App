import type { StandingsRow, Owner } from '@/lib/types';
import styles from './StandingsTable.module.css';

interface Props {
  rows: StandingsRow[];
  owners: Owner[];
}

export function StandingsTable({ rows, owners }: Props) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>Standings Snapshot</caption>
        <thead>
          <tr>
            <th scope="col">Owner</th>
            <th scope="col">W</th>
            <th scope="col">L</th>
            <th scope="col">Earnings</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const owner = owners.find((o) => o.id === row.ownerId);
            return (
              <tr key={row.ownerId}>
                <th scope="row">{owner?.name ?? row.ownerId}</th>
                <td>{row.wins}</td>
                <td>{row.losses}</td>
                <td>${row.seasonEarnings.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
