import styles from './AuctionBidRow.module.css';
import type { AuctionBid, Owner } from '@/lib/types';

interface Props {
  bid: AuctionBid;
  owners: Owner[];
}

export function AuctionBidRow({ bid, owners }: Props) {
  const owner = owners.find((o) => o.id === bid.ownerId);
  return (
    <div className={styles.row}>
      <span>{owner?.name ?? bid.ownerId}</span>
      <span>${bid.amount}</span>
    </div>
  );
}
