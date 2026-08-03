// There is no real backend for this assessment, so authentication is simulated:
// any syntactically valid, non-empty email + a password of at least 4 characters
// is accepted. This is a deliberate, documented decision (see the project README)
// rather than an oversight — the brief has no backend for real credential checks.

const AUTH_KEY = 'lendsqr_auth_session';
const NETWORK_DELAY_MS = 600;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function login(email: string, password: string): Promise<{ email: string }> {
  await delay(null);

  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }
  if (password.length < 4) {
    throw new Error('Incorrect email or password.');
  }

  const session = { email };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getSession(): { email: string } | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
