const AUTH_KEY = 'lendsqr_auth_session';
const NETWORK_DELAY_MS = 600;


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
