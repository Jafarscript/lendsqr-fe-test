// Generates 500 mock user records matching the shape derived from the Figma design.
// Run with: node scripts/generate-users.mjs
// Output: src/mocks/users.json (used by the local mock API layer / MSW / json-server)

import { faker } from '@faker-js/faker';
import { writeFileSync } from 'fs';

const STATUSES = ['active', 'inactive', 'pending', 'blacklisted'];
const ORGS = ['Lendsqr', 'Irorun', 'Lendstar', 'Kredi Bank', 'Urgent10k'];
const EDUCATION_LEVELS = ['B.Sc', 'M.Sc', 'HND', 'OND', 'Ph.D'];
const SECTORS = ['FinTech', 'Education', 'Health', 'Oil and Gas', 'Retail', 'Agriculture'];
const RESIDENCE_TYPES = ["Parent's Apartment", 'Rented Apartment', 'Own House'];
const RELATIONSHIPS = ['Sister', 'Brother', 'Father', 'Mother', 'Friend', 'Spouse'];

function randomStatus() {
  return STATUSES[Math.floor(Math.random() * STATUSES.length)];
}

function nigerianPhoneNumber() {
  const prefixes = ['0803', '0805', '0806', '0810', '0813', '0816', '0703', '0706', '0902', '0907'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const rest = faker.string.numeric(7);
  return `${prefix}${rest}`;
}


function makeGuarantor() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    fullName: `${firstName} ${lastName}`,
    phoneNumber: nigerianPhoneNumber(),
    emailAddress: faker.internet.email({ firstName, lastName }).toLowerCase(),
    relationship: RELATIONSHIPS[Math.floor(Math.random() * RELATIONSHIPS.length)],
  };
}

function makeUser(index) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  const org = ORGS[Math.floor(Math.random() * ORGS.length)];
  const orgDomain = org.toLowerCase().replace(/\s+/g, '') + '.com';
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const incomeLow = faker.number.int({ min: 20, max: 400 }) * 1000;

  return {
    id: `LSQ${faker.string.alphanumeric(8)}`,
    orgName: org,
    username: fullName,
    email,
    phoneNumber: nigerianPhoneNumber(),
    dateJoined: faker.date.past({ years: 5 }).toISOString(),
    status: randomStatus(),
    userTier: faker.number.int({ min: 1, max: 3 }),
    accountBalance: faker.number.int({ min: 0, max: 500000 }),
    accountNumber: faker.finance.accountNumber(10),
    bankName: faker.company.name() + ' Bank',
    personalInfo: {
      fullName,
      phoneNumber: nigerianPhoneNumber(),
      emailAddress: faker.internet.email({ firstName, lastName }).toLowerCase(),
      bvn: faker.finance.accountNumber(11),
      gender: faker.person.sex() === 'male' ? 'Male' : 'Female',
      maritalStatus: faker.helpers.arrayElement(['Single', 'Married', 'Divorced']),
      children: faker.helpers.arrayElement(['None', '1', '2', '3+']),
      typeOfResidence: faker.helpers.arrayElement(RESIDENCE_TYPES),
    },
    educationAndEmployment: {
      levelOfEducation: faker.helpers.arrayElement(EDUCATION_LEVELS),
      employmentStatus: faker.helpers.arrayElement(['Employed', 'Unemployed', 'Self-Employed']),
      sectorOfEmployment: faker.helpers.arrayElement(SECTORS),
      durationOfEmployment: `${faker.number.int({ min: 1, max: 10 })} years`,
      officeEmail: `${firstName.toLowerCase()}@${orgDomain}`,
      monthlyIncome: [incomeLow, incomeLow + 200000],
      loanRepayment: faker.number.int({ min: 10000, max: 100000 }),
    },
    socials: {
      twitter: `@${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
      facebook: fullName,
      instagram: `@${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    },
    guarantors: [makeGuarantor(), makeGuarantor()],
  };
}

const users = Array.from({ length: 500 }, (_, i) => makeUser(i));

writeFileSync(
  new URL('../src/mocks/users.json', import.meta.url),
  JSON.stringify(users, null, 2)
);

console.log(`Generated ${users.length} mock users -> src/mocks/users.json`);
