import type { UserDetail } from "../../types/user";
import { ICONS } from "../../constants/icons";
import styles from "./ProfileHeader.module.scss";

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

function Stars({ tier }: { tier: number }) {
  const StarFilled = ICONS.starFilled;
  const StarEmpty = ICONS.starEmpty;

  return (
    <span className={styles.stars} aria-label={`${tier} out of 3 stars`}>
      {/* Render the filled stars */}
      {Array.from({ length: tier }).map((_, index) => (
        <StarFilled
          key={`filled-${index}`}
          size={16}
          strokeWidth={2}
          fill="#e9b200"
          color="#e9b200"
        />
      ))}

      {/* Render the remaining empty stars */}
      {Array.from({ length: 3 - tier }).map((_, index) => (
        <StarEmpty
          key={`empty-${index}`}
          size={16}
          strokeWidth={2}
          color="#dbdfea"
        />
      ))}
    </span>
  );
}

export default function ProfileHeader({ user }: { user: UserDetail }) {
  const ProfileAvatar = ICONS.profileAvatar;

  return (
    <div className={styles.profileTop}>
      <div className={styles.avatar} aria-hidden="true">
        <ProfileAvatar size={14} strokeWidth={2} />
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
        <span className={styles.amount}>
          {formatCurrency(user.accountBalance)}
        </span>
        <span className={styles.bankInfo}>
          {user.accountNumber}/{user.bankName}
        </span>
      </div>
    </div>
  );
}
