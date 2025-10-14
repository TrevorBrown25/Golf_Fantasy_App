import styles from './SaveCreditChip.module.css';

interface Props {
  count: number;
}

export function SaveCreditChip({ count }: Props) {
  return <span className={styles.chip}>Saves: {count}</span>;
}
