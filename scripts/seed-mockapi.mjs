import { readFileSync } from 'fs';

const baseUrl = process.argv[2];
if (!baseUrl) {
  console.error('Usage: node scripts/seed-mockapi.mjs <base-url>');
  process.exit(1);
}

const users = JSON.parse(readFileSync(new URL('../src/mocks/users.json', import.meta.url)));

for (const [i, user] of users.entries()) {
  const res = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    console.error(`Failed at record ${i} (${user.id}):`, await res.text());
    process.exit(1);
  }
  if (i % 50 === 0) console.log(`${i}/${users.length} seeded...`);
  await new Promise((r) => setTimeout(r, 150)); // avoid rate-limiting
}

console.log('Done.');