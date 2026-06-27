# Development Guide

## Local Development

1. Install dependencies with `npm install`.
2. Start Vite with `npm run dev`.
3. Open `http://127.0.0.1:5173/login`.

For Windows desktop use, `run-dev-server.cmd` starts the Vite server and writes logs to `dev-server.log`.

## Validation

Run these before committing:

```bash
npm run lint
npm run build
```

## Workflow Rules

- Keep the localStorage login/demo flow unchanged unless a backend is introduced deliberately.
- Keep the patient status workflow intact: Draft -> Submitted -> Returned -> Approved -> Closed.
- Supervisors can edit Draft and Returned records.
- Submitted, Approved, and Closed records remain locked for supervisors.
- Only admin views supervisor performance or case counts for other supervisors.
- Keep Hindi/English language switching functional.

## UI Guidelines

- Use the existing blue/teal healthcare theme.
- Keep typography readable but compact enough for hospital dashboards.
- Keep forms mobile responsive and touch friendly.
- Avoid duplicate dashboard sections or duplicate navigation items.
