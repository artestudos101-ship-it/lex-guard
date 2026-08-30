-- Lex Guard initial schema. Apply through Alembic/Neon MCP in deployment.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Core tables
CREATE TABLE IF NOT EXISTS tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(160) NOT NULL,
    plan varchar(32) NOT NULL DEFAULT 'mvp',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    email varchar(320) NOT NULL,
    name varchar(160) NOT NULL,
    password_hash varchar(255) NOT NULL,
    role varchar(32) NOT NULL DEFAULT 'owner',
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS users_tenant_idx ON users (tenant_id);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    filename varchar(255) NOT NULL,
    storage_key varchar(500),
    mime_type varchar(120),
    size_bytes integer,
    status varchar(32) NOT NULL DEFAULT 'READY',
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS documents_tenant_created_idx ON documents (tenant_id, created_at DESC);

-- Analyses
CREATE TABLE IF NOT EXISTS analyses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    created_by uuid NOT NULL,
    title varchar(255) NOT NULL,
    status varchar(32) NOT NULL DEFAULT 'QUEUED',
    progress integer NOT NULL DEFAULT 0,
    policy_version_id varchar(120),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analyses_tenant_created_idx ON analyses (tenant_id, created_at DESC);

-- Analysis Documents Junction Table
CREATE TABLE IF NOT EXISTS analysis_documents (
    analysis_id uuid NOT NULL,
    document_id uuid NOT NULL,
    PRIMARY KEY (analysis_id, document_id)
);

-- Analysis Events
CREATE TABLE IF NOT EXISTS analysis_events (
    id serial PRIMARY KEY,
    tenant_id uuid NOT NULL,
    analysis_id uuid NOT NULL,
    event_type varchar(64) NOT NULL,
    payload_json text NOT NULL DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analysis_events_tenant_idx ON analysis_events (tenant_id);
CREATE INDEX IF NOT EXISTS analysis_events_analysis_idx ON analysis_events (analysis_id);

-- Findings
CREATE TABLE IF NOT EXISTS findings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    analysis_id uuid NOT NULL,
    severity varchar(32) NOT NULL,
    title varchar(255) NOT NULL,
    explanation text NOT NULL,
    evidence_quality varchar(8) NOT NULL DEFAULT 'E2',
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS findings_tenant_idx ON findings (tenant_id);
CREATE INDEX IF NOT EXISTS findings_analysis_idx ON findings (analysis_id);

-- Rules
CREATE TABLE IF NOT EXISTS rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    code varchar(80) NOT NULL,
    name varchar(255) NOT NULL,
    description text NOT NULL DEFAULT '',
    severity varchar(32) NOT NULL DEFAULT 'MEDIUM',
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rules_tenant_idx ON rules (tenant_id);

-- Evidences
CREATE TABLE IF NOT EXISTS evidences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    finding_id uuid NOT NULL,
    document_id uuid NOT NULL,
    page integer,
    quote text NOT NULL,
    confidence numeric NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS evidences_tenant_idx ON evidences (tenant_id);
CREATE INDEX IF NOT EXISTS evidences_finding_idx ON evidences (finding_id);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    analysis_id uuid NOT NULL,
    author_id uuid NOT NULL,
    text text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS comments_tenant_idx ON comments (tenant_id);
CREATE INDEX IF NOT EXISTS comments_analysis_idx ON comments (analysis_id);

-- Assignments
CREATE TABLE IF NOT EXISTS assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    analysis_id uuid NOT NULL,
    assignee_id uuid NOT NULL,
    status varchar(32) NOT NULL DEFAULT 'open',
    due_date timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS assignments_tenant_idx ON assignments (tenant_id);
CREATE INDEX IF NOT EXISTS assignments_analysis_idx ON assignments (analysis_id);

-- Decisions
CREATE TABLE IF NOT EXISTS decisions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    analysis_id uuid NOT NULL UNIQUE,
    recommendation varchar(32) NOT NULL,
    rationale text NOT NULL DEFAULT '',
    created_by uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS decisions_tenant_idx ON decisions (tenant_id);
CREATE INDEX IF NOT EXISTS decisions_analysis_idx ON decisions (analysis_id);

-- Reports
CREATE TABLE IF NOT EXISTS reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    analysis_id uuid NOT NULL UNIQUE,
    format varchar(16) NOT NULL DEFAULT 'json',
    content_json text NOT NULL DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reports_tenant_idx ON reports (tenant_id);
CREATE INDEX IF NOT EXISTS reports_analysis_idx ON reports (analysis_id);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    actor_id uuid,
    action varchar(120) NOT NULL,
    resource_type varchar(80) NOT NULL,
    resource_id varchar(120),
    metadata_json text NOT NULL DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_tenant_idx ON audit_logs (tenant_id);
CREATE INDEX IF NOT EXISTS audit_logs_tenant_created_idx ON audit_logs (tenant_id, created_at DESC);
