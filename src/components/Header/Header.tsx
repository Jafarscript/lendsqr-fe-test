import { getSession } from '../../services/authApi';
import { ICONS } from '../../constants/icons';
import styles from './Header.module.scss';
import logoSVG from '../../assets/logo.svg'

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const session = getSession();
  const displayName = session?.email ? session.email.split('@')[0] : 'User';

  // Assign the Lucide components to capitalized variable names for JSX rendering
  const MenuToggleIcon = ICONS.menuToggle;
  const SearchIcon = ICONS.search;
  const NotificationBellIcon = ICONS.notificationBell;
  const UserAvatarIcon = ICONS.userAvatar;

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Toggle navigation menu"
      >
        <MenuToggleIcon size={20} strokeWidth={2} />
      </button>

      <div className={styles.logo}>
        <img src={logoSVG} alt="Lendsqr Logo" />
      </div>

      <form
        className={styles.searchForm}
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="global-search" className="visually-hidden">
          Search for anything
        </label>
        <input
          id="global-search"
          type="search"
          placeholder="Search for anything"
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton} aria-label="Search">
          <SearchIcon size={14} strokeWidth={2.5} />
        </button>
      </form>

      <div className={styles.rightGroup}>
        <a href="#docs" className={styles.docsLink}>
          Docs
        </a>
        <button type="button" className={styles.bell} aria-label="Notifications">
          <NotificationBellIcon size={20} strokeWidth={2} />
        </button>
        <div className={styles.userMenu}>
          <div className={styles.avatar} aria-hidden="true">
            <UserAvatarIcon size={18} strokeWidth={2} />
          </div>
          <span className={styles.userName}>{displayName}</span>
        </div>
      </div>
    </header>
  );
}
