import { describe, it, expect, beforeEach } from 'vitest';
import { login, logout, getSession, isAuthenticated } from './authApi';

describe('authApi', () => {
  beforeEach(() => {
    localStorage.clear();
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
});
