import type { UserDetail } from '../../types/user';
import { ICONS } from '../../constants/icons';
import styles from './ProfileHeader.module.scss';

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
}

function Stars({ tier }: { tier: number }) {
  return (
    <span className={styles.stars} aria-label={`${tier} out of 3 stars`}>
      {ICONS.starFilled.repeat(tier)}
      {ICONS.starEmpty.repeat(3 - tier)}
    </span>
  );
}

export default function ProfileHeader({ user }: { user: UserDetail }) {
  return (
    <div className={styles.profileTop}>
      <div className={styles.avatar} aria-hidden="true">
        {ICONS.profileAvatar}
      </div>
      <div className={styles.identity}>
        <span className={styles.fullName}>{user.username}</span>
        <span className={styles.userId}>{user.id}</span>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.tierBlock}>
        <span className={styles.tierLabel}>User's Tier</span>
        <Stars tier={user.userTier} />
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.amountBlock}>
        <span className={styles.amount}>{formatCurrency(user.accountBalance)}</span>
        <span className={styles.bankInfo}>
          {user.accountNumber}/{user.bankName}
        </span>
      </div>
    </div>
  );
}
