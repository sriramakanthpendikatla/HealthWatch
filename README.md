# HealthWatch

### Waterborne Disease Monitoring PWA

🔗 **Live demo:** [sriramakanthpendikatla.github.io/HealthWatch](https://sriramakanthpendikatla.github.io/HealthWatch/)

## Business Context & Value Proposition

HealthWatch is a frontend platform for community health workers — ASHA workers, clinic staff, district health officers, and volunteers — to monitor and respond to waterborne disease outbreaks at the village/district level. Field workers need a fast way to log suspected cases, record water quality readings at local sources, and access prevention guidance, even in low-connectivity areas. The platform centralizes this into role-based dashboards so that health data flows from the field up to decision-makers without relying on paper records.

## Business Capabilities & Rules

**Role-Based Access:** Users are assigned one of five roles — `admin`, `district_officer`, `clinic`, `asha`, or `volunteer` — which determines their view of the system.

**Case Reporting:** Field workers can log suspected waterborne disease cases as they're identified, capturing the details needed for follow-up and outbreak tracking.

**Water Quality Monitoring:** Water sources can be tested and logged, giving health officers visibility into contamination risk by location over time.

**Offline Awareness:** The app surfaces real-time connection status so field workers know when their data may not be syncing — important for workers in areas with unreliable connectivity.

**Prevention Guidance:** A searchable, categorized tips library (water safety, hygiene, prevention, home care) is available to all roles for community education.

**Profile Management:** Users can view and update their own profile details.

## Core Features

**Dashboard**
- At-a-glance overview of case trends and key stats

**Case Reporting**
- Log suspected waterborne disease cases from the field

**Water Quality**
- Record and review water quality readings by location

**Tips**
- Searchable prevention/hygiene guidance, filterable by category
- Categories: Water Safety, Hygiene, Prevention, Home Care

**Profile**
- View and update user details and role

**Offline Indicator**
- Live connection-status banner for field conditions

## Ambiguity Areas / Open Decisions

**Authentication:** Login currently uses a mocked auth flow (any phone number signs in as a demo user) for prototyping purposes. Real authentication — likely OTP-based via Supabase — is planned but not yet implemented.

**Data Persistence:** The app currently runs without a connected backend/database; case reports and water quality readings are not yet persisted beyond local component state. A backend (Supabase is already included as a dependency) is the natural next step.

**Offline Sync Strategy:** The Offline Indicator currently reflects connection status but does not yet queue/sync data captured while offline — this needs a defined strategy (e.g. local storage queue + background sync) before field use in low-connectivity areas.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Routing | React Router |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend (planned) | Supabase |
| Deployment | GitHub Actions → GitHub Pages |

## Project Structure

```
src/
├── components/      # Header, Sidebar, LoadingSpinner, OfflineIndicator
├── contexts/        # AuthContext, OfflineContext
├── pages/           # Dashboard, CaseReporting, WaterQuality, Tips, Profile, Login
├── App.tsx          # Routes and layout
├── main.tsx         # App entry point
└── index.css        # Tailwind directives
```

## Running the Project

**Install dependencies**
```bash
npm install
```

**Start dev server**
```bash
npm run dev
```
App runs at `http://localhost:5173` (or the port Vite reports).

**Build for production**
```bash
npm run build
```

**Preview production build**
```bash
npm run preview
```

## Deployment

Deploys automatically via GitHub Actions on every push to `main`. The workflow installs dependencies, runs `npm run build`, and publishes the `dist/` output to GitHub Pages. See `.github/workflows/deploy.yml`.

## Future Enhancements

- Real OTP-based authentication (Supabase)
- Persistent backend storage for case reports and water quality data
- Offline data queue with background sync
- Role-based data access at the API layer
- Push notifications for outbreak alerts
- Analytics dashboard for district officers (case trends, hotspots)
- Multi-language support for field workers

## Author

**Pendikatla Sri RamaKanth**

AI/ML Enthusiast | Backend Developer | FastAPI Developer
