import {
  Briefcase,
  ChevronDown,
  Home,
  Users,
  UserCheck,
  HandCoins,
  Scale,
  PiggyBank,
  FileText,
  UserPlus,
  UserX,
  Coins,
  Receipt,
  Settings,
  UserCog,
  Scroll,
  BarChart3,
  Sliders,
  Percent,
  ClipboardList,
  MessageSquare,
  LogOut,
  Search,
  Bell,
  Menu,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  AlertTriangle,
  Star,
  ArrowLeft,
  User
} from 'lucide-react';

/**
 * Every icon used in the app, in one place.
 * Swapped from emoji placeholders to real lucide-react SVG icon components
 * matching the Lendsqr Figma design.
 */
export const ICONS = {
  // Sidebar — top
  switchOrganization: Briefcase,
  chevronDown: ChevronDown,
  dashboard: Home,

  // Sidebar — Customers section
  users: Users,
  guarantors: UserCheck, // Silhouette with checkmark or pairing
  loans: HandCoins, // Hand holding coins
  decisionModels: Scale, // Scales for legal/decision models
  savings: PiggyBank,
  loanRequests: FileText,
  whitelist: UserPlus, // Added/whitelisted user profile icon
  karma: UserX, // Crossed out / banned user profile icon

  // Sidebar — Businesses section
  organization: Briefcase,
  loanProducts: HandCoins, 
  savingsProducts: PiggyBank,
  feesAndCharges: Coins, // Stack of coins/charges
  transactions: Receipt,
  services: Settings,
  serviceAccount: UserCog, // User profile with gear
  settlements: Scroll, // Ledger / scroll paper document
  reports: BarChart3,

  // Sidebar — Settings section
  preferences: Sliders,
  feesAndPricing: Percent, // Percentage symbol for pricing models
  auditLogs: ClipboardList,
  systemsMessages: MessageSquare,
  logout: LogOut,

  // Header
  search: Search,
  notificationBell: Bell,
  userAvatar: User,
  menuToggle: Menu,

  // Users page — stat cards
  statUsers: Users,
  statActiveUsers: UserCheck,
  statUsersWithLoans: FileText,
  statUsersWithSavings: PiggyBank,

  // Users table — row action menu
  actionMenuTrigger: '⋮', // Kept as vertical ellipsis text string or custom SVG
  viewDetails: Eye,
  blacklistUser: UserX,
  activateUser: UserCheck,

  // Table filter column trigger
  filterCaret: SlidersHorizontal, // Clean filter slider icon

  // Pagination arrows
  paginationPrev: ChevronLeft,
  paginationNext: ChevronRight,
  selectCaret: ChevronDown,

  // Generic states
  emptyStateDefault: FolderOpen,
  emptyStateSearch: Search,
  emptyStateUnbuilt: AlertTriangle,
  errorState: AlertTriangle,

  // User Details profile card
  profileAvatar: User,
  starFilled: Star,
  starEmpty: Star, // Handle unfilled state with custom color properties
  backArrow: ArrowLeft,
} as const;
