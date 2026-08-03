import type { UserDetail, UserFilters, PaginatedResponse, UserSummary } from '../types/user';

// The 500-record dataset (~750KB) is dynamically imported rather than imported
// at the top of this module. A static import would bundle the whole dataset into
// the main JS chunk, inflating first-load size for every page — including Login,
// which never needs this data at all. Lazy-loading it here means it's fetched as
// its own chunk only once the Users/User Details pages actually need it, and only
// once per session (cached in `usersCache` below).
let usersCache: UserDetail[] | null = null;

async function getAllUsers(): Promise<UserDetail[]> {
  if (usersCache) return usersCache;
  const module = await import('../mocks/users.json');
  usersCache = module.default as UserDetail[];
  return usersCache;
}

// If set (see .env.example), fetch from a real hosted endpoint (e.g. mockapi.io)
// instead of the local dataset below. Populate this once you've uploaded the
// 500 generated records — no other code changes are needed.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

// Simulated network delay so loading states are actually exercised in dev/testing.
const NETWORK_DELAY_MS = 500;

// Toggle via localStorage (`localStorage.setItem('forceApiError', 'true')`) to manually
// exercise the error state during development without editing code.
function shouldSimulateError() {
  return localStorage.getItem('forceApiError') === 'true';
}

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function matchesFilters(user: UserDetail, filters?: UserFilters): boolean {
  if (!filters) return true;
  const { organization, username, email, date, phoneNumber, status } = filters;

  if (organization && user.orgName.toLowerCase() !== organization.toLowerCase()) return false;
  if (username && !user.username.toLowerCase().includes(username.toLowerCase())) return false;
  if (email && !user.email.toLowerCase().includes(email.toLowerCase())) return false;
  if (phoneNumber && !user.phoneNumber.includes(phoneNumber)) return false;
  if (status && user.status !== status) return false;
  if (date) {
    const joined = new Date(user.dateJoined).toDateString();
    const target = new Date(date).toDateString();
    if (joined !== target) return false;
  }
  return true;
}

export async function fetchUsers(
  page: number,
  pageSize: number,
  filters?: UserFilters
): Promise<PaginatedResponse<UserSummary>> {
  if (shouldSimulateError()) {
    await delay(null, NETWORK_DELAY_MS);
    throw new Error('Failed to fetch users. Please try again.');
  }

  if (API_BASE_URL) {
    return fetchUsersFromRemote(page, pageSize, filters);
  }

  const allUsers = await getAllUsers();
  const filtered = allUsers.filter((u) => matchesFilters(u, filters));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return delay({
    data: paged.map(toSummary),
    total: filtered.length,
    page,
    pageSize,
  });
}

// mockapi.io serves the full flat array with ?page & ?limit query params, and doesn't
// support our compound filters server-side — so we fetch a generous page and filter
// client-side. Swap this out for real server-side filtering if your provider supports it.
async function fetchUsersFromRemote(
  page: number,
  pageSize: number,
  filters?: UserFilters
): Promise<PaginatedResponse<UserSummary>> {
  const res = await fetch(`${API_BASE_URL}/users`);
  if (!res.ok) {
    throw new Error('Failed to fetch users. Please try again.');
  }
  const all = (await res.json()) as UserDetail[];
  const filtered = all.filter((u) => matchesFilters(u, filters));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return {
    data: paged.map(toSummary),
    total: filtered.length,
    page,
    pageSize,
  };
}

export async function fetchUserById(id: string): Promise<UserDetail> {
  if (shouldSimulateError()) {
    await delay(null, NETWORK_DELAY_MS);
    throw new Error('Failed to fetch user details. Please try again.');
  }

  if (API_BASE_URL) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error('User not found.');
    return (await res.json()) as UserDetail;
  }

  const allUsers = await getAllUsers();
  const user = allUsers.find((u) => u.id === id);
  if (!user) {
    await delay(null, NETWORK_DELAY_MS);
    throw new Error('User not found.');
  }
  return delay(user);
}

export async function fetchUserStats() {
  const allUsers = await getAllUsers();
  const total = allUsers.length;
  const active = allUsers.filter((u) => u.status === 'active').length;
  const withLoans = allUsers.filter((u) => u.educationAndEmployment.loanRepayment > 0).length;
  const withSavings = allUsers.filter((u) => u.accountBalance > 0).length;

  return delay({ total, active, withLoans, withSavings });
}

export async function updateUserStatus(
  id: string,
  status: UserDetail['status']
): Promise<void> {
  await delay(null, 300);
  const allUsers = await getAllUsers();
  const user = allUsers.find((u) => u.id === id);
  if (user) {
    user.status = status;
  }
  // Note: this mutates the in-memory dataset for the session only. There's no
  // persistence layer in this assessment beyond localStorage (used for the
  // User Details cache), so status changes reset on a full page reload.
}

function toSummary(user: UserDetail): UserSummary {
  const { id, orgName, username, email, phoneNumber, dateJoined, status } = user;
  return { id, orgName, username, email, phoneNumber, dateJoined, status };
}
