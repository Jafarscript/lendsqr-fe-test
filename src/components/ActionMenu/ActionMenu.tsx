import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../../constants/icons';
import styles from './ActionMenu.module.scss';

interface ActionMenuProps {
  userId: string;
  status: string;
  onBlacklist: (id: string) => void;
  onActivate: (id: string) => void;
}

export default function ActionMenu({ userId, status, onBlacklist, onActivate }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Assign the Lucide components to capitalized variable names for JSX rendering
  const ViewDetailsIcon = ICONS.viewDetails;
  const BlacklistUserIcon = ICONS.blacklistUser;
  const ActivateUserIcon = ICONS.activateUser;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for user ${userId}`}
      >
        {/* Renders the static vertical ellipsis string string cleanly */}
        <span className={styles.triggerText}>{ICONS.actionMenuTrigger}</span>
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            onClick={() => {
              setOpen(false);
              navigate(`/dashboard/users/${userId}`);
            }}
          >
            <ViewDetailsIcon size={14} strokeWidth={2} />
            <span>View Details</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            disabled={status === 'blacklisted'}
            onClick={() => {
              setOpen(false);
              onBlacklist(userId);
            }}
          >
            <BlacklistUserIcon size={14} strokeWidth={2} />
            <span>Blacklist User</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            disabled={status === 'active'}
            onClick={() => {
              setOpen(false);
              onActivate(userId);
            }}
          >
            <ActivateUserIcon size={14} strokeWidth={2} />
            <span>Activate User</span>
          </button>
        </div>
      )}
    </div>
  );
}
