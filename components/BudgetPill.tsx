import styles from './BudgetPill.module.css';

interface Props {
  amount: number;
}

export function BudgetPill({ amount }: Props) {
  return <span className={styles.pill}>Budget ${amount}</span>;
}
