# SANKALP

SANKALP is a hospital-grade neonatal care management web app built with React and Vite. It provides separate admin and supervisor panels for patient registration, case review, facility monitoring, reports, and bilingual Hindi/English operation.

## Features

- Admin dashboard with monthly facility-wise entries, supervisor performance, and live monitoring
- Supervisor dashboard with patient workflow, follow-up visibility, and privacy-safe supervisor directory
- Patient registry with search, status filters, facility filters, and responsive spacing
- Draft -> Submitted -> Returned -> Approved -> Closed workflow
- Supervisor edit locking for Submitted, Approved, and Closed records
- Returned records remain editable for resubmission
- Hindi/English language toggle stored in localStorage
- Blue/teal healthcare UI theme

## Tech Stack

- React 19
- Vite 8
- React Router
- Tailwind CSS
- Recharts
- Lucide React
- Oxlint

## Quick Start

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173/login
```

On Windows, you can also start the persistent helper script:

```bat
run-dev-server.cmd
```

## Demo Accounts

Admin:

```text
Email: admin@sankalp.in
Password: admin123
```

Supervisor:

```text
Email: supervisor@sankalp.in
Password: supervisor123
```

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Project Structure

```text
src/
  components/       Shared layout, dashboard, and patient UI components
  context/          Auth and language providers/hooks
  data/             Mock patient, supervisor, user, and facility data
  lib/              Utility functions
  pages/
    admin/          Admin dashboard, patients, users, reports, facilities
    auth/           Login page
    shared/         Shared settings page
    supervisor/     Supervisor dashboard, registry, patient form
public/             Static app icons
tests/              Manual QA checklist
```

## Quality Checks

Before pushing changes, run:

```bash
npm run lint
npm run build
```

Both commands should pass before deployment.

## Notes

This app currently uses mock data and localStorage-driven UI preferences. It does not add backend authentication or server persistence.
