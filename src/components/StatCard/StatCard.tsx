import styles from './StatCard.module.scss';

interface StatCardProps {
  icon: string;
  iconBg: string;
  label: string;
  value: number;
}

export default function StatCard({ icon, iconBg, label, value }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon} style={{ backgroundColor: iconBg }} aria-hidden="true">
        {icon}
      </div>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value.toLocaleString()}</div>
    </div>
  );
}
