import { ICONS } from '../../constants/icons';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  // Update the type definition to accept Lucide icon components instead of strings
  icon?: React.ComponentType<{ size?: number | string; strokeWidth?: number | string }>;
  title: string;
  message?: string;
}

/** Generic "nothing here" state — used wherever a list/table has zero results. */
export default function EmptyState({ 
  icon: IconComponent = ICONS.emptyStateDefault, 
  title, 
  message 
}: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon} aria-hidden="true">
        {/* Render the icon component with an appropriate size for an empty state */}
        <IconComponent size={48} strokeWidth={1.5} />
      </div>
      <p className={styles.title}>{title}</p>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
