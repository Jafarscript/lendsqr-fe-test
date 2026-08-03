import { useEffect, useState } from 'react';
import { fetchUserById } from '../services/userApi';
import type { UserDetail } from '../types/user';

const STORAGE_PREFIX = 'lendsqr_user_detail_';

function readFromStorage(id: string): UserDetail | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + id);
    return raw ? (JSON.parse(raw) as UserDetail) : null;
  } catch {
    // Corrupted or unavailable storage shouldn't crash the page — just fall through to a fetch.
    return null;
  }
}

function writeToStorage(id: string, user: UserDetail) {
  try {
    localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(user));
  } catch {
    // Storage can fail (quota, private browsing) — persistence is a nice-to-have here,
    // not something that should break the page if it's unavailable.
  }
}

interface UseUserDetailResult {
  user: UserDetail | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUserDetail(userId: string | undefined): UseUserDetailResult {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchToken, setRefetchToken] = useState(0);

  useEffect(() => {
    if (!userId) {
      setError('No user specified.');
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    // Cache-first: if we already have this user's details persisted from a
    // previous visit, show them immediately without a loading spinner. This
    // satisfies the "persist and retrieve via localStorage" requirement and
    // also means the page still works if you navigate here directly (e.g. a
    // refresh) without re-hitting the mock API.
    const cached = readFromStorage(userId);
    if (cached) {
      setUser(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchUserById(userId)
      .then((result) => {
        if (cancelled) return;
        setUser(result);
        writeToStorage(userId, result);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, refetchToken]);

  return { user, isLoading, error, refetch: () => setRefetchToken((t) => t + 1) };
}
