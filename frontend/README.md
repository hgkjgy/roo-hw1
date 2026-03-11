## Demo Dashboard (frontend-only)

This is a frontend demo dashboard (Next.js App Router) with mock auth and mock tasks, all persisted in the browser `localStorage`. No backend CRUD is involved; the Nest backend is only used for the demo login endpoint.

### Demo users
- `admin@test.com` — role: admin
- `manager@test.com` — role: manager
- `employee@test.com` — role: employee

### What each role can do
- Employee: view own tasks, toggle their status, see personal summary.
- Manager: view all tasks, change any task status, add demo tasks, see shared summary.
- Admin: same as manager plus a demo users/roles list; can change any task status and add demo tasks.

### Auth & data (all mock, localStorage)
- Login uses mock auth; the logged-in demo user (email/role) is stored in `localStorage`.
- Tasks are stored in `localStorage`; seeded tasks are loaded on first visit or when storage is cleared.
- Logout clears mock auth. “Reset demo data” clears both auth and tasks, then redirects to `/login` (tasks return to seeded defaults after next login).

### Still demo / placeholder
- No real authentication/session/refresh tokens; role is inferred from email.
- No real task backend or database; tasks exist only in the current browser’s `localStorage`.
- No multi-user sync; clearing storage or switching browsers resets data.

### How to run
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000 and login with any demo user above. Backend (Nest) should be running at http://localhost:3001 for the demo login endpoint.

### Key UI notes
- Demo banner visible in dashboard header.
- Route guard redirects unauthenticated users to `/login`.
- Reset button clears demo auth/tasks and returns to `/login`.
- Empty states are shown when no tasks are visible (per role or globally).
