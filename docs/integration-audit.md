# LexGuard integration audit

## Current status

| Area | Status | Notes |
|---|---|---|
| Tenant isolation | Implemented | FastAPI scope is derived from JWT claims and every private query filters `tenant_id`. |
| Persistent documents | Partial | Metadata is persisted in Neon; storage provider wiring remains the next backend slice. |
| Analysis creation | Implemented | Analysis and document links are persisted and validated per tenant. |
| Async processing | Partial | Redis enqueue and worker entrypoint are present; processing stages still need domain adapters. |
| Replayable events | Implemented | `analysis_events` is persisted and exposed through SSE with an `after` cursor. |
| Policies/rules | Partial | Rules are persisted and listed; policy version management remains to be added. |
| Findings/evidence | Partial | Models and tenant-scoped evidence query exist; extraction and deterministic decision engine remain. |
| Collaboration | Partial | Tenant-scoped analysis comments are now available; assignments and notifications remain. |
| Frontend API adapter | Implemented | API mode is selected by `NEXT_PUBLIC_DATA_SOURCE=api` or `NEXT_PUBLIC_API_URL`; mock mode is explicit fallback. |
| Auth | Partial | Backend expects signed JWT scope; the frontend auth service still needs migration to the real auth endpoint. |

## Contract conventions

- Private API requests require a bearer token and derive tenant context server-side.
- Error responses use `detail.code` and `detail.message`.
- Analysis creation returns HTTP 202 with `QUEUED` status.
- SSE supports replay through `?after=<event_id>` and emits `id`, `event`, and `data` fields.
- Frontend mock data remains available only when API mode is not enabled.

## Remaining work

1. Complete auth registration/login/logout and replace fixed demo claims.
2. Add object storage abstraction and document text/page extraction.
3. Implement worker state transitions, retries, structured LLM gateway, evidence validation, and decision packages.
4. Add assignments, notifications, search/filter query contracts, reports, and audit writes.
5. Add integration and end-to-end coverage for register → upload → analysis → events → decision.
