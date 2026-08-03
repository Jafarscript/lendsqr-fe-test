import { NavLink } from 'react-router-dom';
import { logout } from '../../services/authApi';
import { ICONS } from '../../constants/icons';
import styles from './Sidebar.module.scss';

interface NavItem {
  label: string;
  icon: string;
}

// All icon values below come from src/constants/icons.ts — edit that file to
// swap emoji for real icons everywhere at once.
const CUSTOMER_ITEMS: NavItem[] = [
  { label: 'Users', icon: ICONS.users },
  { label: 'Guarantors', icon: ICONS.guarantors },
  { label: 'Loans', icon: ICONS.loans },
  { label: 'Decision Models', icon: ICONS.decisionModels },
  { label: 'Savings', icon: ICONS.savings },
  { label: 'Loan Requests', icon: ICONS.loanRequests },
  { label: 'Whitelist', icon: ICONS.whitelist },
  { label: 'Karma', icon: ICONS.karma },
];

const BUSINESS_ITEMS: NavItem[] = [
  { label: 'Organization', icon: ICONS.organization },
  { label: 'Loan Products', icon: ICONS.loanProducts },
  { label: 'Savings Products', icon: ICONS.savingsProducts },
  { label: 'Fees and Charges', icon: ICONS.feesAndCharges },
  { label: 'Transactions', icon: ICONS.transactions },
  { label: 'Services', icon: ICONS.services },
  { label: 'Service Account', icon: ICONS.serviceAccount },
  { label: 'Settlements', icon: ICONS.settlements },
  { label: 'Reports', icon: ICONS.reports },
];

const SETTINGS_ITEMS: NavItem[] = [
  { label: 'Preferences', icon: ICONS.preferences },
  { label: 'Fees and Pricing', icon: ICONS.feesAndPricing },
  { label: 'Audit Logs', icon: ICONS.auditLogs },
  { label: 'Systems Messages', icon: ICONS.systemsMessages },
];

// Only Dashboard and Users are implemented in this assessment. The rest of the
// sidebar is rendered to faithfully match the full admin console chrome shown
// in the Figma, but is intentionally inert (not routed) since building out
// every one of these sections is out of scope for the 4 required pages.
function InertItem({ label, icon }: NavItem) {
  return (
    <li>
      <span className={`${styles.navItem} ${styles.navItemInert}`} aria-disabled="true">
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
        {label}
      </span>
    </li>
  );
}

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} aria-hidden="true" />}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
        aria-label="Main navigation"
      >
        <button type="button" className={styles.switchOrg}>
          {ICONS.switchOrganization} Switch Organization {ICONS.chevronDown}
        </button>

        <NavLink
          to="/dashboard"
          onClick={onClose}
          className={({ isActive }) =>
            `${styles.dashboardLink} ${isActive ? styles.navItemActive : ''}`
          }
        >
          <span className={styles.icon} aria-hidden="true">
            {ICONS.dashboard}
          </span>
          Dashboard
        </NavLink>

        <div className={styles.sectionLabel}>Customers</div>
        <ul className={styles.navList}>
          {CUSTOMER_ITEMS.map((item) =>
            item.label === 'Users' ? (
              <li key={item.label}>
                <NavLink
                  to="/users"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                  }
                >
                  <span className={styles.icon} aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ) : (
              <InertItem key={item.label} {...item} />
            )
          )}
        </ul>

        <div className={styles.sectionLabel}>Businesses</div>
        <ul className={styles.navList}>
          {BUSINESS_ITEMS.map((item) => (
            <InertItem key={item.label} {...item} />
          ))}
        </ul>

        <div className={styles.sectionLabel}>Settings</div>
        <ul className={styles.navList}>
          {SETTINGS_ITEMS.map((item) => (
            <InertItem key={item.label} {...item} />
          ))}
        </ul>

        <hr className={styles.divider} />

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.navItem}
            style={{ padding: 0 }}
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
          >
            <span className={styles.icon} aria-hidden="true">
              {ICONS.logout}
            </span>
            Logout
          </button>
        </div>
        <div className={styles.version}>v1.2.0</div>
      </aside>
    </>
  );
}
