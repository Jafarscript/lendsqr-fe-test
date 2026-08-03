import styles from './Field.module.scss';

/** A single labeled value, used throughout the User Details sections. */
export default function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
}
