import styles from './OwnerAvatar.module.css';

interface Props {
  name: string;
}

export function OwnerAvatar({ name }: Props) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return <span className={styles.avatar} aria-hidden>{initials}</span>;
}
