import styles from './StatCard.module.scss';

interface StatCardProps {
  // Change string to a React component type that accepts Lucide styling props
  icon: React.ComponentType<{ size?: number | string; strokeWidth?: number | string }>;
  iconBg: string;
  label: string;
  value: number;
}

export default function StatCard({ icon: IconComponent, iconBg, label, value }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon} style={{ backgroundColor: iconBg }} aria-hidden="true">
        {/* Render the Lucide component using standard dashboard card sizes */}
        <IconComponent size={22} strokeWidth={2} />
      </div>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value.toLocaleString()}</div>
    </div>
  );
}
