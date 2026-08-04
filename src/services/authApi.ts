// There is no real backend for this assessment, so authentication is simulated:
// any syntactically valid, non-empty email + a password of at least 4 characters
// is accepted. This is a deliberate, documented decision (see the project README)
// rather than an oversight — the brief has no backend for real credential checks.

const AUTH_KEY = 'lendsqr_auth_session';
const NETWORK_DELAY_MS = 600;

// How long a session stays valid after login, before the user is treated as
// logged out again. 30 minutes is a reasonable default for an admin console
// handling sensitive lending/customer data — adjust to taste.
const SESSION_DURATION_MS = 30 * 60 * 1000;

interface StoredSession {
  email: string;
  expiresAt: number; // epoch ms
}

export interface Session {
  email: string;
}

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function login(email: string, password: string): Promise<Session> {
  await delay(null);

  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }
  if (password.length < 4) {
    throw new Error('Incorrect email or password.');
  }

  const session: StoredSession = { email, expiresAt: Date.now() + SESSION_DURATION_MS };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return { email };
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

/**
 * Returns the active session, or null if there isn't one — including when a
 * session exists but has expired, in which case it's cleared as a side
 * effect so the next check doesn't have to redo this work.
 */
export function getSession(): Session | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  let parsed: StoredSession;
  try {
    parsed = JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }

  if (!parsed.expiresAt || Date.now() >= parsed.expiresAt) {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }

  return { email: parsed.email };
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/**
 * Extends the current session's expiry, if one exists. Call this on
 * meaningful user activity (e.g. navigation) if you want "30 minutes of
 * inactivity" rather than "30 minutes since login, period." Not wired up
 * anywhere by default — opt-in.
 */
export function refreshSession() {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return;
  try {
    const parsed: StoredSession = JSON.parse(raw);
    parsed.expiresAt = Date.now() + SESSION_DURATION_MS;
    localStorage.setItem(AUTH_KEY, JSON.stringify(parsed));
  } catch {
    // Corrupted session — leave it to expire/clear naturally on next getSession() call.
  }
}
