import { useCallback, useEffect, useState } from 'react';
import { fetchUsers } from '../services/userApi';
import type { UserFilters, UserSummary } from '../types/user';

interface UseUsersResult {
  users: UserSummary[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUsers(
  page: number,
  pageSize: number,
  filters: UserFilters
): UseUsersResult {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchToken, setRefetchToken] = useState(0);

  const refetch = useCallback(() => setRefetchToken((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetchUsers(page, pageSize, filters)
      .then((res) => {
        if (cancelled) return;
        setUsers(res.data);
        setTotal(res.total);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Something went wrong.');
        setUsers([]);
        setTotal(0);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, JSON.stringify(filters), refetchToken]);

  return { users, total, isLoading, error, refetch };
}
