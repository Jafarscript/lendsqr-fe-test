import Field from '../../components/Field/Field';
import type { UserDetail } from '../../types/user';
import styles from './GeneralDetails.module.scss';

export default function GeneralDetails({ user }: { user: UserDetail }) {
  const { personalInfo, educationAndEmployment, socials, guarantors } = user;

  return (
    <>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Personal Information</h2>
        <div className={styles.fieldGrid}>
          <Field label="Full Name" value={personalInfo.fullName} />
          <Field label="Phone Number" value={personalInfo.phoneNumber} />
          <Field label="Email Address" value={personalInfo.emailAddress} />
          <Field label="BVN" value={personalInfo.bvn} />
          <Field label="Gender" value={personalInfo.gender} />
          <Field label="Marital Status" value={personalInfo.maritalStatus} />
          <Field label="Children" value={personalInfo.children} />
          <Field label="Type of Residence" value={personalInfo.typeOfResidence} />
        </div>
      </div>

      <hr className={styles.sectionDivider} />

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Education and Employment</h2>
        <div className={styles.fieldGrid}>
          <Field label="Level of Education" value={educationAndEmployment.levelOfEducation} />
          <Field label="Employment Status" value={educationAndEmployment.employmentStatus} />
          <Field label="Sector of Employment" value={educationAndEmployment.sectorOfEmployment} />
          <Field
            label="Duration of Employment"
            value={educationAndEmployment.durationOfEmployment}
          />
          <Field label="Office Email" value={educationAndEmployment.officeEmail} />
          <Field
            label="Monthly Income"
            value={`₦${educationAndEmployment.monthlyIncome[0].toLocaleString()} - ₦${educationAndEmployment.monthlyIncome[1].toLocaleString()}`}
          />
          <Field
            label="Loan Repayment"
            value={educationAndEmployment.loanRepayment.toLocaleString()}
          />
        </div>
      </div>

      <hr className={styles.sectionDivider} />

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Socials</h2>
        <div className={styles.fieldGrid}>
          <Field label="Twitter" value={socials.twitter} />
          <Field label="Facebook" value={socials.facebook} />
          <Field label="Instagram" value={socials.instagram} />
        </div>
      </div>

      <hr className={styles.sectionDivider} />

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Guarantor</h2>
        {guarantors.map((g, idx) => (
          <div className={`${styles.fieldGrid} ${styles.guarantorBlock}`} key={idx}>
            <Field label="Full Name" value={g.fullName} />
            <Field label="Phone Number" value={g.phoneNumber} />
            <Field label="Email Address" value={g.emailAddress} />
            <Field label="Relationship" value={g.relationship} />
          </div>
        ))}
      </div>
    </>
  );
}
