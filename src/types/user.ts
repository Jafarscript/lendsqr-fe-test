export type UserStatus = 'active' | 'inactive' | 'pending' | 'blacklisted';

export interface Guarantor {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  relationship: string;
}

export interface PersonalInfo {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  bvn: string;
  gender: 'Male' | 'Female';
  maritalStatus: string;
  children: string;
  typeOfResidence: string;
}

export interface EducationAndEmployment {
  levelOfEducation: string;
  employmentStatus: string;
  sectorOfEmployment: string;
  durationOfEmployment: string;
  officeEmail: string;
  monthlyIncome: [number, number];
  loanRepayment: number;
}

export interface Socials {
  twitter: string;
  facebook: string;
  instagram: string;
}


export interface UserSummary {
  id: string;
  orgName: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string; // ISO string
  status: UserStatus;
}


export interface UserDetail extends UserSummary {
  userTier: 1 | 2 | 3;
  accountBalance: number;
  accountNumber: string;
  bankName: string;
  personalInfo: PersonalInfo;
  educationAndEmployment: EducationAndEmployment;
  socials: Socials;
  guarantors: Guarantor[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserFilters {
  organization?: string;
  username?: string;
  email?: string;
  date?: string;
  phoneNumber?: string;
  status?: UserStatus;
}
