import { ICONS } from '../../constants/icons';
import styles from './ErrorState.module.scss';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry: () => void;
}

/** Generic fetch-failed state with a retry action — used across Users and User Details. */
export default function ErrorState({ title = "Couldn't load this", message, onRetry }: ErrorStateProps) {

  const ErrorIcon = ICONS.errorState;
  return (
    <div className={styles.container} role="alert">
      <div className={styles.icon} aria-hidden="true">
        <ErrorIcon size={48} strokeWidth={1.5} />
      </div>
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
      <button type="button" className={styles.retryButton} onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
