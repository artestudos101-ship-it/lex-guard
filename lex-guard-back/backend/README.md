# Lex Guard Backend

FastAPI service for evidence-first, shared multi-tenant contract analysis.

## Run locally

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e '.[test]'
uvicorn app.main:app --reload
```

Health: `GET /health` · Readiness: `GET /ready` · OpenAPI: `/docs`

The current MVP exposes the versioned API contract and deterministic local adapters. Persistence and worker adapters are isolated behind the API/service boundaries so Neon Postgres and Redis can be enabled without changing frontend contracts.
