# Frontend workflow audit

## Current routes

- `/` — dashboard shell with demo metrics and priorities.
- `/analyses`, `/analyses/new`, `/analyses/:id`, `/analyses/:id/processing` — canonical analysis workflow.
- `/policies`, `/reports`, `/evaluation`, `/search`, `/notifications`, `/settings` — operational module routes.
- `/teams`, `/users`, `/activity` — collaboration views.

## Preserved components and services

The application already has reusable shell, sidebar, shadcn UI, analysis, decision, dashboard, query-hook, and service layers. The refactor should preserve these boundaries and keep future API replacement inside services.

## Duplications and gaps found

- Authentication was represented by a synchronous demo session without public login, registration, recovery, or route guard flows.
- The account menu contained the correct destinations but theme and logout actions were not functional.
- Module routes used a shared visual shell but did not expose enough operational structure, filters, table states, or empty states.
- Search and filters were primarily visual controls and did not share URL state.
- Demo tenant constants included an Enterprise plan label, which conflicts with the single standard environment rule.
- Settings had no contextual sections for account, organization, preferences, security, or team.
- Mock services existed per domain, but no common API client contract documented tenant scope and error handling.

## Canonical intents

- One canonical creation path: `/analyses/new`.
- One global search experience: `/search`, available from the account menu and keyboard shortcut.
- One account/settings path: `/settings` with contextual sections.
- One logout action: auth service clears the mock session and redirects to `/login`.

## Implementation direction

Add a framework-neutral mock auth service and provider, public auth screens, route-aware empty states, URL-backed analysis filters, functional theme control, and shared API contracts. Keep demo data isolated from the future empty tenant flow; no Enterprise-specific product behavior should be added.

## Backend readiness notes

The current services are the correct seam for replacing mocks with FastAPI. Future requests should pass tenant context, use a shared API client, validate payloads, and let the backend enforce authorization independently of the UI.
