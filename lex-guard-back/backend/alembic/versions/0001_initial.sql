-- Lex Guard initial schema. Apply through Alembic/Neon MCP in deployment.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS tenants (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar(160) NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS documents (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, filename varchar(255) NOT NULL, status varchar(32) NOT NULL DEFAULT 'READY', extracted_text text, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS documents_tenant_created_idx ON documents (tenant_id, created_at DESC);
CREATE TABLE IF NOT EXISTS analyses (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, status varchar(32) NOT NULL DEFAULT 'QUEUED', progress smallint NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100), created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS analyses_tenant_created_idx ON analyses (tenant_id, created_at DESC);
CREATE TABLE IF NOT EXISTS audit_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, actor_id uuid, action varchar(120) NOT NULL, entity_type varchar(80) NOT NULL, entity_id uuid, created_at timestamptz NOT NULL DEFAULT now());
