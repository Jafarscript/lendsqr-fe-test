import StatCard from '../../components/StatCard/StatCard';
import { ICONS } from '../../constants/icons';
import styles from './UsersStats.module.scss';

interface UsersStatsProps {
  stats: {
    total: number;
    active: number;
    withLoans: number;
    withSavings: number;
  } | null;
}

/** The 4 stat cards at the top of the Users page. */
export default function UsersStats({ stats }: UsersStatsProps) {
  return (
    <div className={styles.statsGrid}>
      <StatCard icon={ICONS.statUsers} iconBg="#fce7fc" label="Users" value={stats?.total ?? 0} />
      <StatCard
        icon={ICONS.statActiveUsers}
        iconBg="#e9e2fe"
        label="Active Users"
        value={stats?.active ?? 0}
      />
      <StatCard
        icon={ICONS.statUsersWithLoans}
        iconBg="#ffe8d9"
        label="Users with Loans"
        value={stats?.withLoans ?? 0}
      />
      <StatCard
        icon={ICONS.statUsersWithSavings}
        iconBg="#ffdce5"
        label="Users with Savings"
        value={stats?.withSavings ?? 0}
      />
    </div>
  );
}
