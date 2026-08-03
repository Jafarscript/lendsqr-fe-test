import { useEffect, useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { fetchUserStats, updateUserStatus } from '../../services/userApi';
import Pagination from '../../components/Pagination/Pagination';
import UsersStats from './UsersStats';
import UsersTable from './UsersTable';
import type { UserFilters, UserDetail } from '../../types/user';
import styles from './Users.module.scss';

interface Stats {
  total: number;
  active: number;
  withLoans: number;
  withSavings: number;
}

export default function Users() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<UserFilters>({});
  const [stats, setStats] = useState<Stats | null>(null);

  const { users, total, isLoading, error, refetch } = useUsers(page, pageSize, filters);

  useEffect(() => {
    fetchUserStats().then(setStats).catch(() => setStats(null));
  }, []);

  function handleApplyFilters(newFilters: UserFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  function handleResetFilters() {
    setFilters({});
    setPage(1);
  }

  async function handleBlacklist(id: string) {
    await updateUserStatus(id, 'blacklisted' as UserDetail['status']);
    refetch();
  }

  async function handleActivate(id: string) {
    await updateUserStatus(id, 'active' as UserDetail['status']);
    refetch();
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Users</h1>

      <UsersStats stats={stats} />

      <UsersTable
        users={users}
        isLoading={isLoading}
        error={error}
        pageSize={pageSize}
        filters={filters}
        hasActiveFilters={Object.keys(filters).length > 0}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        onRetry={refetch}
        onBlacklist={handleBlacklist}
        onActivate={handleActivate}
      />

      {!error && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}
