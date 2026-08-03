import { getSession } from '../../services/authApi';
import { ICONS } from '../../constants/icons';
import styles from './Header.module.scss';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const session = getSession();
  const displayName = session?.email ? session.email.split('@')[0] : 'User';

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Toggle navigation menu"
      >
        {ICONS.menuToggle}
      </button>

      <div className={styles.logo}>
        <span className={styles.logoMark} aria-hidden="true" />
        <span>lendsqr</span>
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
          {ICONS.search}
        </button>
      </form>

      <div className={styles.rightGroup}>
        <a href="#docs" className={styles.docsLink}>
          Docs
        </a>
        <span className={styles.bell} aria-hidden="true">
          {ICONS.notificationBell}
        </span>
        <div className={styles.userMenu}>
          <div className={styles.avatar} aria-hidden="true">
            {ICONS.userAvatar}
          </div>
          <span className={styles.userName}>{displayName}</span>
        </div>
      </div>
    </header>
  );
}
