import { useState, type FormEvent } from 'react';
import styles from './FilterPanel.module.scss';
import type { UserFilters, UserStatus } from '../../types/user';

interface FilterPanelProps {
  initialFilters: UserFilters;
  onApply: (filters: UserFilters) => void;
  onReset: () => void;
  onClose: () => void;
}

const ORG_OPTIONS = ['Lendsqr', 'Irorun', 'Lendstar', 'Kredi Bank', 'Urgent10k'];
const STATUS_OPTIONS: UserStatus[] = ['active', 'inactive', 'pending', 'blacklisted'];

export default function FilterPanel({
  initialFilters,
  onApply,
  onReset,
  onClose,
}: FilterPanelProps) {
  const [organization, setOrganization] = useState(initialFilters.organization ?? '');
  const [username, setUsername] = useState(initialFilters.username ?? '');
  const [email, setEmail] = useState(initialFilters.email ?? '');
  const [date, setDate] = useState(initialFilters.date ?? '');
  const [phoneNumber, setPhoneNumber] = useState(initialFilters.phoneNumber ?? '');
  const [status, setStatus] = useState<string>(initialFilters.status ?? '');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onApply({
      organization: organization || undefined,
      username: username || undefined,
      email: email || undefined,
      date: date || undefined,
      phoneNumber: phoneNumber || undefined,
      status: (status as UserStatus) || undefined,
    });
    onClose();
  }

  function handleReset() {
    setOrganization('');
    setUsername('');
    setEmail('');
    setDate('');
    setPhoneNumber('');
    setStatus('');
    onReset();
    onClose();
  }

  return (
    <form className={styles.panel} onSubmit={handleSubmit} role="dialog" aria-label="Filter users">
      <div className={styles.field}>
        <label htmlFor="filter-org" className={styles.label}>
          Organization
        </label>
        <select
          id="filter-org"
          className={styles.select}
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        >
          <option value="">Select</option>
          {ORG_OPTIONS.map((org) => (
            <option key={org} value={org}>
              {org}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="filter-username" className={styles.label}>
          Username
        </label>
        <input
          id="filter-username"
          className={styles.input}
          placeholder="User"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="filter-email" className={styles.label}>
          Email
        </label>
        <input
          id="filter-email"
          type="email"
          className={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="filter-date" className={styles.label}>
          Date
        </label>
        <input
          id="filter-date"
          type="date"
          className={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="filter-phone" className={styles.label}>
          Phone Number
        </label>
        <input
          id="filter-phone"
          className={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="filter-status" className={styles.label}>
          Status
        </label>
        <select
          id="filter-status"
          className={styles.select}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.resetButton} onClick={handleReset}>
          Reset
        </button>
        <button type="submit" className={styles.filterButton}>
          Filter
        </button>
      </div>
    </form>
  );
}
