import { ICONS } from '../../constants/icons';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
}

/** Generic "nothing here" state — used wherever a list/table has zero results. */
export default function EmptyState({ icon = ICONS.emptyStateDefault, title, message }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon} aria-hidden="true">
        {icon}
      </div>
      <p className={styles.title}>{title}</p>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
