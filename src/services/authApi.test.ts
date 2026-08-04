import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { login, logout, getSession, isAuthenticated, refreshSession } from './authApi';

describe('authApi', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('logs in successfully with a valid email and a password of sufficient length', async () => {
    const session = await login('jafar@example.com', 'password123');
    expect(session.email).toBe('jafar@example.com');
    expect(isAuthenticated()).toBe(true);
  });

  it('rejects an invalid email address', async () => {
    await expect(login('not-an-email', 'password123')).rejects.toThrow(/valid email/i);
    expect(isAuthenticated()).toBe(false);
  });

  it('rejects a password that is too short', async () => {
    await expect(login('jafar@example.com', 'ab')).rejects.toThrow(/incorrect email or password/i);
    expect(isAuthenticated()).toBe(false);
  });

  it('persists the session so getSession returns it after login', async () => {
    await login('jafar@example.com', 'password123');
    expect(getSession()).toEqual({ email: 'jafar@example.com' });
  });

  it('clears the session on logout', async () => {
    await login('jafar@example.com', 'password123');
    logout();
    expect(getSession()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it('remains authenticated just before the 30-minute session expiry', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await login('jafar@example.com', 'password123');

    vi.advanceTimersByTime(29 * 60 * 1000); // 29 minutes
    expect(isAuthenticated()).toBe(true);
  });

  it('expires the session after 30 minutes and clears it from storage', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await login('jafar@example.com', 'password123');

    vi.advanceTimersByTime(31 * 60 * 1000); // 31 minutes
    expect(isAuthenticated()).toBe(false);
    expect(getSession()).toBeNull();
    expect(localStorage.getItem('lendsqr_auth_session')).toBeNull();
  });

  it('refreshSession extends expiry so the session survives past the original window', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await login('jafar@example.com', 'password123');

    vi.advanceTimersByTime(25 * 60 * 1000); // 25 minutes — still valid
    refreshSession();

    vi.advanceTimersByTime(25 * 60 * 1000); // another 25 minutes — 50 total, but refreshed at 25
    expect(isAuthenticated()).toBe(true);
  });

  it('refreshSession does nothing if there is no active session', () => {
    expect(() => refreshSession()).not.toThrow();
    expect(getSession()).toBeNull();
  });
});
