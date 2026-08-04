import { useState } from 'react';
import StatusPill from '../../components/StatusPill/StatusPill';
import ActionMenu from '../../components/ActionMenu/ActionMenu';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import TableSkeleton from '../../components/TableSkeleton/TableSkeleton';
import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';
import { ICONS } from '../../constants/icons';
import type { UserFilters, UserStatus, UserSummary } from '../../types/user';
import styles from './UsersTable.module.scss';

const COLUMNS = [
  { key: 'orgName', label: 'Organization', skeletonWidth: 60 },
  { key: 'username', label: 'Username', skeletonWidth: 70 },
  { key: 'email', label: 'Email', skeletonWidth: 85 },
  { key: 'phoneNumber', label: 'Phone Number', skeletonWidth: 65 },
  { key: 'dateJoined', label: 'Date Joined', skeletonWidth: 75 },
  { key: 'status', label: 'Status', skeletonWidth: 40 },
] as const;

const SKELETON_WIDTHS = [...COLUMNS.map((c) => c.skeletonWidth), 15];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

interface UsersTableProps {
  users: UserSummary[];
  isLoading: boolean;
  error: string | null;
  pageSize: number;
  filters: UserFilters;
  hasActiveFilters: boolean;
  onApplyFilters: (filters: UserFilters) => void;
  onResetFilters: () => void;
  onRetry: () => void;
  onBlacklist: (id: string) => void;
  onActivate: (id: string) => void;
}

export default function UsersTable({
  users,
  isLoading,
  error,
  pageSize,
  filters,
  hasActiveFilters,
  onApplyFilters,
  onResetFilters,
  onRetry,
  onBlacklist,
  onActivate,
}: UsersTableProps) {
  const [openFilterColumn, setOpenFilterColumn] = useState<string | null>(null);

  // Capitalize for proper inline JSX rendering
  const FilterCaretIcon = ICONS.filterCaret;

  if (error) {
    return (
      <div className={styles.tableWrapper}>
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      {/* Announces loading/loaded transitions to screen readers without a visible element. */}
      <span className="visually-hidden" role="status" aria-live="polite">
        {isLoading ? 'Loading users…' : `${users.length} users loaded`}
      </span>

      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} scope="col">
                <span className={styles.thContent}>
                  {col.label}
                  <button
                    type="button"
                    className={styles.filterTrigger}
                    aria-label={`Filter by ${col.label}`}
                    aria-haspopup="dialog"
                    aria-expanded={openFilterColumn === col.key}
                    onClick={() =>
                      setOpenFilterColumn((prev) => (prev === col.key ? null : col.key))
                    }
                  >
                    {/* Render the Lucide icon with crisp sizing */}
                    <FilterCaretIcon size={14} strokeWidth={2} />
                  </button>
                  {openFilterColumn === col.key && (
                    <FilterPanel
                      initialFilters={filters}
                      onApply={onApplyFilters}
                      onReset={onResetFilters}
                      onClose={() => setOpenFilterColumn(null)}
                    />
                  )}
                </span>
              </th>
            ))}
            <th scope="col">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading && <TableSkeleton rowCount={pageSize} columnWidths={SKELETON_WIDTHS} />}

          {!isLoading && users.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length + 1}>
                {/* 
                  Pass the Component directly. You will likely need to update 
                  the `icon` prop type inside EmptyState from `string` to 
                  `React.ComponentType<{ size?: number }>` if it complains.
                */}
                <EmptyState
                  icon={ICONS.emptyStateSearch}
                  title="No users found"
                  message={
                    hasActiveFilters
                      ? 'Try adjusting or resetting your filters.'
                      : 'There are no users to display yet.'
                  }
                />
              </td>
            </tr>
          )}

          {!isLoading &&
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.orgName}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{formatDate(user.dateJoined)}</td>
                <td>
                  <div className={styles.statusCell}>
                    <StatusPill status={user.status} />
                  </div>
                </td>
                <td>
                  <ActionMenu
                    userId={user.id}
                    status={user.status as UserStatus}
                    onBlacklist={onBlacklist}
                    onActivate={onActivate}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
