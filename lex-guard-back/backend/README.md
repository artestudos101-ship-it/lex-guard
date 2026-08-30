# Lex Guard Backend

FastAPI service for evidence-first, shared multi-tenant contract analysis. It supports local Ollama inference with `qwen2.5-vl`; Ollama runs on the host machine while the API and worker run in Docker.

## Option A: Docker Compose + Ollama on host

### 1. Install Ollama and model

Install Ollama from https://ollama.com/download, then run:

```bash
ollama pull qwen2.5-vl
ollama serve
```

Keep `ollama serve` running. Verify it at `http://localhost:11434`.

### 2. Copy environment files

From the repository root:

```bash
cp .env.example .env.local
cp lex-guard-back/backend/.env.example lex-guard-back/backend/.env
```

The backend `.env` uses `http://host.docker.internal:11434`, which lets containers reach Ollama on macOS, Windows, and modern Docker Linux. On Linux, the compose `extra_hosts` entry maps this hostname to the host gateway.

### 3. Start services

```bash
cd lex-guard-back/backend
docker compose up --build
```

The API is available at `http://localhost:8000/docs`. Start the Next.js frontend in another terminal:

```bash
cd /path/to/lex-guard
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Option B: Run backend directly

```bash
cd lex-guard-back/backend
python -m venv .venv
source .venv/bin/activate
pip install -e '.[test]'
cp .env.example .env
# Change DATABASE_URL and REDIS_URL to localhost values:
# DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/lexguard
# REDIS_URL=redis://localhost:6379/0
# Also change OLLAMA_BASE_URL=http://localhost:11434
uvicorn app.main:app --reload --port 8000
```

Run the worker in a second terminal:

```bash
cd lex-guard-back/backend
source .venv/bin/activate
python -m app.worker
```

Start Postgres and Redis locally, or use the included Compose services with `docker compose up -d postgres redis`.

## Environment templates

### Frontend `.env.local`

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DATA_SOURCE=api
```

### Backend `.env`

```dotenv
DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/lexguard
REDIS_URL=redis://redis:6379/0
JWT_SECRET=replace-with-at-least-32-random-characters
CORS_ORIGINS=["http://localhost:3000"]
UPLOAD_DIR=./data/uploads
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_MODEL=qwen2.5-vl
OLLAMA_TIMEOUT_SECONDS=120
OLLAMA_ENABLED=true
```

Never commit `.env`, `.env.local`, passwords, or production secrets. Generate a production JWT secret with a password manager or `openssl rand -base64 32`.

## Deploying the web app with local Ollama

The hosted web app cannot directly reach Ollama on your private computer. Deploy the Next.js frontend and FastAPI backend normally, but keep LLM execution on your local machine by running a secure relay/tunnel from your local backend to the deployed frontend, or use the frontend only against a locally running API during development.

For a deployed backend, set `OLLAMA_BASE_URL` to a private, authenticated network endpoint that can reach your Ollama host. Do not expose port `11434` publicly without authentication and network restrictions. If the hosted backend must call your personal machine, use a VPN or authenticated tunnel and set `OLLAMA_BASE_URL` to that tunnel URL; the browser should never call Ollama directly.

Hosted environment variables:

```dotenv
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_DATA_SOURCE=api
DATABASE_URL=postgresql+asyncpg://...
REDIS_URL=rediss://...
JWT_SECRET=use-a-unique-production-secret
CORS_ORIGINS=["https://app.example.com"]
OLLAMA_BASE_URL=https://authenticated-ollama-relay.example.com
OLLAMA_MODEL=qwen2.5-vl
OLLAMA_TIMEOUT_SECONDS=180
OLLAMA_ENABLED=true
```

If the deployed backend cannot reach your local network, set `OLLAMA_ENABLED=false` in production and configure a hosted model provider instead. The worker falls back to deterministic review when Ollama is unavailable.

## Useful endpoints

- `GET /health` — liveness
- `GET /ready` — database and Redis readiness
- `GET /docs` — OpenAPI
- `POST /api/v1/auth/register` — create account
- `POST /api/v1/auth/login` — create session
- `GET /api/v1/analyses/{id}/events` — replayable SSE progress stream
- `GET /api/v1/analyses/{id}/report` — persisted report package

## Tests

```bash
cd lex-guard-back/backend
uv run --with pytest --with pytest-asyncio --with httpx pytest -q
```
