import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  fetchUsers,
  fetchUserById,
  fetchUserStats,
  updateUserStatus,
} from './userApi';

describe('userApi', () => {
  beforeEach(() => {
    localStorage.removeItem('forceApiError');
  });

  afterEach(() => {
    localStorage.removeItem('forceApiError');
  });

  describe('fetchUsers', () => {
    it('returns the requested page size and correct total count', async () => {
      const result = await fetchUsers(1, 10);
      expect(result.data).toHaveLength(10);
      expect(result.total).toBe(500);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('returns different records on different pages', async () => {
      const page1 = await fetchUsers(1, 10);
      const page2 = await fetchUsers(2, 10);
      const page1Ids = page1.data.map((u) => u.id);
      const page2Ids = page2.data.map((u) => u.id);
      expect(page1Ids).not.toEqual(page2Ids);
    });

    it('returns only users matching a status filter', async () => {
      const result = await fetchUsers(1, 500, { status: 'active' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.every((u) => u.status === 'active')).toBe(true);
    });

    it('returns an empty result set for a filter that matches nothing', async () => {
      const result = await fetchUsers(1, 10, { username: 'zzz_no_such_user_zzz' });
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('rejects with an error when the error toggle is set', async () => {
      localStorage.setItem('forceApiError', 'true');
      await expect(fetchUsers(1, 10)).rejects.toThrow(/failed to fetch users/i);
    });
  });

  describe('fetchUserById', () => {
    it('returns the matching user for a valid id', async () => {
      const page = await fetchUsers(1, 1);
      const targetId = page.data[0].id;

      const user = await fetchUserById(targetId);
      expect(user.id).toBe(targetId);
    });

    it('rejects when the id does not exist', async () => {
      await expect(fetchUserById('does-not-exist')).rejects.toThrow(/not found/i);
    });

    it('rejects with an error when the error toggle is set', async () => {
      localStorage.setItem('forceApiError', 'true');
      await expect(fetchUserById('any-id')).rejects.toThrow(/failed to fetch user details/i);
    });
  });

  describe('fetchUserStats', () => {
    it('returns counts that are internally consistent with the dataset size', async () => {
      const stats = await fetchUserStats();
      expect(stats.total).toBe(500);
      expect(stats.active).toBeGreaterThanOrEqual(0);
      expect(stats.active).toBeLessThanOrEqual(stats.total);
    });
  });

  describe('updateUserStatus', () => {
    it('updates the status so a subsequent fetch reflects the change', async () => {
      const page = await fetchUsers(1, 1);
      const targetId = page.data[0].id;

      await updateUserStatus(targetId, 'blacklisted');

      const updated = await fetchUserById(targetId);
      expect(updated.status).toBe('blacklisted');
    });
  });
});
