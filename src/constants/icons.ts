/**
 * Every icon used in the app, in one place.
 *
 * Currently these are emoji placeholders. To swap in real icons (an icon font,
 * SVG components, or a library like lucide-react) matching the Figma design,
 * this is the ONLY file you should need to touch — every component below
 * imports from here rather than hardcoding an emoji inline.
 *
 * If you swap to an icon library, each value here would become a component
 * reference instead of a string, and the few call sites that render
 * `<span>{ICONS.xyz}</span>` would render `<ICONS.xyz />` instead — see the
 * inline comments at each usage site for exactly what to change.
 */
export const ICONS = {
  // Sidebar — top
  switchOrganization: '💼',
  chevronDown: '⌄',
  dashboard: '🏠',

  // Sidebar — Customers section
  users: '👥',
  guarantors: '🧑‍🤝‍🧑',
  loans: '💰',
  decisionModels: '🔀',
  savings: '🐷',
  loanRequests: '📝',
  whitelist: '✅',
  karma: '🚫',

  // Sidebar — Businesses section
  organization: '💼',
  loanProducts: '📦',
  savingsProducts: '🏦',
  feesAndCharges: '💳',
  transactions: '🧾',
  services: '⚙️',
  serviceAccount: '👤',
  settlements: '🗂️',
  reports: '📊',

  // Sidebar — Settings section
  preferences: '🎚️',
  feesAndPricing: '🏷️',
  auditLogs: '📋',
  systemsMessages: '💬',
  logout: '🚪',

  // Header
  search: '🔍',
  notificationBell: '🔔',
  userAvatar: '👤',
  menuToggle: '☰',

  // Users page — stat cards (StatCard also takes an iconBg color, set alongside these in UsersStats.tsx)
  statUsers: '👥',
  statActiveUsers: '👤',
  statUsersWithLoans: '📄',
  statUsersWithSavings: '💰',

  // Users table — row action menu
  actionMenuTrigger: '⋮',
  viewDetails: '👁',
  blacklistUser: '🚫',
  activateUser: '✅',

  // Table filter column trigger
  filterCaret: '▽',

  // Pagination arrows
  paginationPrev: '‹',
  paginationNext: '›',
  selectCaret: '▾',

  // Generic states
  emptyStateDefault: '🗂️',
  emptyStateSearch: '🔍',
  emptyStateUnbuilt: '🚧',
  errorState: '⚠️',

  // User Details profile card
  profileAvatar: '👤',
  starFilled: '★',
  starEmpty: '☆',
  backArrow: '←',
} as const;
