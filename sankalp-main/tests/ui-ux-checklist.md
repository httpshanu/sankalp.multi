# SANKALP UI/UX QA Checklist

Use this checklist after UI or dashboard changes.

## Core Checks

- Login page opens at `/login`.
- Admin demo login works.
- Supervisor demo login works.
- Hindi/English toggle changes visible labels.
- Language preference remains stored in localStorage.

## Admin Dashboard

- `Monthly Facility Entries` appears as the combined facility-wise monthly chart.
- Separate `Facility Performance` section is not present.
- Separate duplicate `Monthly Entry` section is not present.
- `Breastfeeding Rate` dashboard chart/card is not present.
- `Audit Logs` is not present in sidebar, routes, dashboard cards, or navigation.
- Admin can still view supervisor performance data.

## Supervisor Dashboard

- `Other Supervisors` shows at most four supervisors.
- If more than four supervisors exist, `View All Supervisors` opens the full list.
- Other supervisor cards show only initials/avatar, name, and facility/department.
- Other supervisor cards do not show total entries, approved, submitted, pending, patient counts, or performance data.

## Patient Registry

- Search input and filters have clear spacing.
- Status and facility filters do not appear stuck together.
- Layout remains usable on mobile widths.

## Workflow

- Draft records are editable by supervisor.
- Returned records are editable by supervisor.
- Submitted records are locked for supervisor.
- Approved records are locked for supervisor.
- Closed records are locked for supervisor.
