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
        {ICONS.actionMenuTrigger}
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            onClick={() => {
              setOpen(false);
              navigate(`/users/${userId}`);
            }}
          >
            {ICONS.viewDetails} View Details
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
            {ICONS.blacklistUser} Blacklist User
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
            {ICONS.activateUser} Activate User
          </button>
        </div>
      )}
    </div>
  );
}
