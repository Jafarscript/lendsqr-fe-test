import type { UserDetail, UserFilters, PaginatedResponse, UserSummary } from '../types/user';

let usersCache: UserDetail[] | null = null;

async function getAllUsers(): Promise<UserDetail[]> {
  if (usersCache) return usersCache;
  const module = await import('../mocks/users.json');
  usersCache = module.default as UserDetail[];
  return usersCache;
}


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

// Simulated network delay so loading states are actually exercised in dev/testing.
const NETWORK_DELAY_MS = 500;


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
  if (shouldSimulateError()) {
    await delay(null, NETWORK_DELAY_MS);
    throw new Error('Failed to fetch user stats. Please try again.');
  }

  if (API_BASE_URL) {
    return fetchUserStatsFromRemote();
  }

  const allUsers = await getAllUsers();
  return delay(calculateStats(allUsers));
}

async function fetchUserStatsFromRemote() {
  const res = await fetch(`${API_BASE_URL}/users`);
  if (!res.ok) {
    throw new Error('Failed to fetch user stats. Please try again.');
  }
  const allUsers = (await res.json()) as UserDetail[];
  return calculateStats(allUsers);
}

// Helper function to avoid repeating the calculation logic
function calculateStats(allUsers: UserDetail[]) {
  const total = allUsers.length;
  const active = allUsers.filter((u) => u.status === 'active').length;
  const withLoans = allUsers.filter((u) => u.educationAndEmployment.loanRepayment > 0).length;
  const withSavings = allUsers.filter((u) => u.accountBalance > 0).length;
  
  return { total, active, withLoans, withSavings };
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
}

function toSummary(user: UserDetail): UserSummary {
  const { id, orgName, username, email, phoneNumber, dateJoined, status } = user;
  return { id, orgName, username, email, phoneNumber, dateJoined, status };
}
