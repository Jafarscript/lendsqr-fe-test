import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUserDetail } from '../../hooks/useUserDetail';
import { updateUserStatus } from '../../services/userApi';
import Tabs from '../../components/Tabs/Tabs';
import ErrorState from '../../components/ErrorState/ErrorState';
import EmptyState from '../../components/EmptyState/EmptyState';
import ProfileHeader from './ProfileHeader';
import GeneralDetails from './GeneralDetails';
import { ICONS } from '../../constants/icons';
import styles from './UserDetails.module.scss';
import type { UserDetail } from '../../types/user';

const TABS = ['General Details', 'Documents', 'Bank Details', 'Loans', 'Savings', 'App and System'];

export default function UserDetails() {
  const { userId } = useParams<{ userId: string }>();
  const { user, isLoading, error, refetch } = useUserDetail(userId);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localUser, setLocalUser] = useState<UserDetail | null>(null);

  const displayUser = localUser ?? user;
  const BackArrow = ICONS.backArrow

  async function handleStatusChange(status: UserDetail['status']) {
    if (!userId) return;
    setIsUpdating(true);
    try {
      await updateUserStatus(userId, status);
      if (user) setLocalUser({ ...user, status });
    } finally {
      setIsUpdating(false);
    }
  }


  return (
    <div className={styles.page}>
      <Link to="/dashboard/users" className={styles.backLink}>
        <BackArrow size={14} strokeWidth={2} /> Back to Users
      </Link>

      <div className={styles.headerRow}>
        <h1 className={styles.heading}>User Details</h1>
        {displayUser && (
          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.blacklistButton}
              disabled={isUpdating || displayUser.status === 'blacklisted'}
              onClick={() => handleStatusChange('blacklisted')}
            >
              BLACKLIST USER
            </button>
            <button
              type="button"
              className={styles.activateButton}
              disabled={isUpdating || displayUser.status === 'active'}
              onClick={() => handleStatusChange('active')}
            >
              ACTIVATE USER
            </button>
          </div>
        )}
      </div>

      {isLoading && (
        <div aria-hidden="true">
          <div className={styles.skeletonBlock} />
          <div className={styles.skeletonBlock} style={{ height: 300 }} />
        </div>
      )}

      {!isLoading && error && (
        <div className={styles.profileCard}>
          <ErrorState title="Couldn't load this user" message={error} onRetry={refetch} />
        </div>
      )}

      {!isLoading && !error && !displayUser && (
        <div className={styles.profileCard}>
          <EmptyState title="User not found" message="This user may no longer exist." />
        </div>
      )}

      {!isLoading && !error && displayUser && (
        <div className={styles.profileCard}>
          <ProfileHeader user={displayUser} />

          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

          <div className={styles.tabContent}>
            {activeTab === 'General Details' ? (
              <GeneralDetails user={displayUser} />
            ) : (
              <EmptyState
                icon={ICONS.emptyStateUnbuilt}
                title={`No data for "${activeTab}"`}
                message="This tab isn't specified in the assessment design — see project notes."
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
