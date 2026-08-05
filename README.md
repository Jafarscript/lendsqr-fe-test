# lendsqr-fe-test

Frontend Engineering assessment submission for Lendsqr — a React + TypeScript + SCSS
implementation of the Login, Users, and User Details screens from the provided Figma design.

**Live app:** https://jafar-li-hammed-lendsqr-fe-test.vercel.app
**Repository:** https://github.com/Jafarscript/lendsqr-fe-test

## Tech stack

- **React 19 + TypeScript** — Vite as the build tool
- **SCSS Modules** — one stylesheet per component, no global class leakage
- **React Router v7** — client-side routing + a route guard for auth
- **Vitest + React Testing Library** — unit tests
- **@faker-js/faker** (dev-only) — generates the 500-record mock dataset at build/dev time, not shipped to production

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks then builds to dist/
npm run test      # runs the unit test suite once
npm run test:watch
```

On first login, **any syntactically valid email + a password of 4 or more characters**
will succeed, see [Mock authentication](#mock-authentication) below for why.

## Environment variables

See `.env.example`. `VITE_API_BASE_URL` controls the data source: blank uses the local
generated dataset (`src/mocks/users.json`, 500 records); set to a real endpoint and the
app fetches from there instead, no code changes needed either way, `userApi.ts` checks
this variable and switches automatically.

The deployed app is currently configured against a live mockapi.io endpoint, seeded via
`scripts/seed-mockapi.mjs` (which POSTs records individually through their REST API,
sidestepping the schema editor's import limits, see the note below on why). This is
deliberate: it means the deployed app genuinely fetches over the network rather than
reading a bundled file, which is verifiable in the Network tab.

**A note on free-tier record limits.** mockapi.io, My JSON Server, and Beeceptor were
all evaluated for hosting the full 500-record dataset live. Every one of them caps
free-tier usage well below 500 records (mockapi.io's free plan in particular stops
accepting new records past ~100 per resource). None will host the full dataset for
free, so the live mockapi.io endpoint is seeded with the subset their free tier accepts.
The pagination, filtering, and table-performance logic described below is what was
actually engineered and tested against the full 500 records, via the same
`VITE_API_BASE_URL` toggle pointed at the local dataset the mechanism works correctly
at any record count; the ceiling here is the free tooling, not the app.

## Project structure

```
src/
  components/    Shared, reusable UI pieces (Pagination, StatusPill, EmptyState,
                 ErrorState, TableSkeleton, ActionMenu, FilterPanel, Tabs, Field,
                 Sidebar, Header, Layout, ProtectedRoute)
  pages/         One folder per route (Login, Dashboard, Users, UserDetails),
                 each split into a thin page component + focused sub-components
                 (e.g. Users/UsersStats.tsx, Users/UsersTable.tsx)
  hooks/         useUsers, useUserDetail — data-fetching hooks with loading/error state
  services/      userApi.ts (mock/remote data layer), authApi.ts (mock auth)
  types/         Shared TypeScript types, derived from the Figma design
  mocks/         Generated 500-record dataset (see scripts/generate-users.mjs)
  styles/        SCSS variables/mixins and global reset
scripts/
  generate-users.mjs   Regenerates src/mocks/users.json (`node scripts/generate-users.mjs`)
```

## Key decisions and tradeoffs

**Pagination over virtualization.** With 500 records, the Users table paginates
(page-size selector: 10/25/50/100) rather than virtualizing an unpaginated list.
Pagination keeps the DOM small on every page load regardless of dataset size, matches
the "Showing X out of Y" control already in the Figma, and avoids the added complexity
of a virtualized-scroll library for a dataset this size. Virtualization would earn its
complexity at a much larger scale (tens of thousands of rows) where users genuinely
need to scroll through everything at once.

**localStorage over IndexedDB for User Details persistence.** The per-user detail
object is a single flat-ish JSON blob with no need for querying, indexing, or
transactions — localStorage's synchronous get/set is simpler and sufficient.
IndexedDB would be the better call if this needed to store and query large volumes of
structured records client-side, which isn't the case here. The strategy is cache-first:
first visit fetches and caches; subsequent visits (including a hard refresh) read from
cache instantly with no loading state.

**Mock authentication.** There's no real backend for this assessment, so Login accepts
any syntactically valid email with a password of 4+ characters. This is a deliberate,
documented stand-in for real credential validation, not an oversight.

**Dataset lazy-loaded, not bundled.** The generated 500-record JSON (~750KB) is
dynamically imported inside `userApi.ts` rather than statically imported at the top of
the module. A static import would have shipped that dataset in the same chunk as the
Login page, which never needs it. It now loads as its own chunk only when the
Users/User Details routes are actually visited.

**Stat cards computed from the dataset, not hardcoded.** The 4 summary cards on the
Users page (Users / Active Users / Users with Loans / Users with Savings) are derived
from the actual 500-record dataset rather than the larger numbers shown in the Figma
mockup, so the UI stays internally consistent with the data it's actually displaying.

**Sidebar scope.** The full sidebar navigation (Customers/Businesses/Settings sections)
is rendered to faithfully match the admin console chrome shown in the design, but only
Dashboard and Users are wired to real routes building out every other section
(Guarantors, Loans, Decision Models, etc.) is out of scope for the 4 pages this
assessment asks for.

**Dashboard page.** The Figma export provided for this assessment did not include a
distinct Dashboard screen (only Login, Users, and User Details). This was flagged to
Lendsqr directly rather than guessed at silently see the note below.

**Undesigned User Details tabs.** Of the 6 tabs on the User Details page, only
"General Details" has content specified in the Figma. The remaining 5 (Documents, Bank
Details, Loans, Savings, App and System) render their tab navigation but show a clear
placeholder state rather than invented content, for the same reason as above.

## Responsive & accessibility notes

- Sidebar collapses to a slide-in drawer with a hamburger toggle below the tablet
  breakpoint, rather than disappearing with no way to reopen it.
- Table loading state uses per-column-width skeleton bars (not uniform bars) plus a
  visually-hidden `aria-live="polite"` region announcing load state to screen readers.
- Login and filter form fields use associated `<label>` elements (visually hidden where
  the design only shows placeholder text), with `aria-invalid`/`aria-describedby` wired
  to inline validation errors.
- Action menus and tabs use appropriate ARIA roles (`menu`/`menuitem`, `tablist`/`tab`)
  and close on Escape / outside click.

## Testing approach

Unit tests focus on logic with real branching behavior: form validation, pagination
boundaries/ellipsis, filtering, the simulated error path, and disabled-state logic
rather than snapshotting static markup. Both positive and negative cases are covered
for each (see test output for the full list). Run `npm run test` for results.

## Known limitations

- Status changes (Blacklist/Activate) persist only for the current session (in-memory
  dataset mutation on the local dataset; writes against the live mockapi.io endpoint
  persist there instead, subject to its own free-tier limits).
- The live mockapi.io endpoint holds a subset of records (its free tier caps around
  100), not the full 500 see the note under Environment variables above.