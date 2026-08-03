import styles from './StatusPill.module.scss';
import type { UserStatus } from '../../types/user';

const LABELS: Record<UserStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  blacklisted: 'Blacklisted',
};

export default function StatusPill({ status }: { status: UserStatus }) {
  return <span className={`${styles.pill} ${styles[status]}`}>{LABELS[status]}</span>;
}
