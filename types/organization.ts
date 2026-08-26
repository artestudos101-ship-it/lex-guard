export type UserRole = "admin" | "reviewer" | "viewer"
export type UserStatus = "active" | "invited" | "suspended"

export interface Tenant { id: string; name: string; plan: string; initials: string }
export interface Team { id: string; name: string; description: string; memberCount: number; color: string }
export interface User { id: string; name: string; email: string; initials: string; role: UserRole; status: UserStatus; team: string; lastActive: string }
export interface Activity { id: string; actor: string; action: string; target: string; time: string; tone: "info" | "warning" | "success" }
export interface Notification { id: string; title: string; description: string; time: string; read: boolean; tone: "info" | "warning" | "success" }
export interface Comment { id: string; author: string; initials: string; text: string; time: string }
export interface ProcessingEvent { id: string; label: string; detail: string; status: "done" | "active" | "pending" | "error"; progress: number }
export interface Assignment { assignee: string; dueDate: string; status: "open" | "in_progress" | "done" }
export interface PolicyHistory { version: string; date: string; author: string; changes: string }
export interface Session { user: User; tenant: Tenant }
export const DEMO_TENANT: Tenant = { id: "tenant-demo", name: "Empresa Demonstrativa Ltda.", plan: "Plano Enterprise", initials: "ED" }
export const DEMO_USER: User = { id: "usr-marina", name: "Marina Costa", email: "marina.costa@empresa-demo.com", initials: "MC", role: "admin", status: "active", team: "Jurídico e Risco", lastActive: "agora" }
export const DEMO_TEAMS: Team[] = [{ id: "risk", name: "Jurídico e Risco", description: "Análise de editais e governança de decisão", memberCount: 8, color: "bg-primary" }, { id: "sales", name: "Comercial", description: "Priorização e estratégia de participação", memberCount: 5, color: "bg-info" }, { id: "ops", name: "Operações", description: "Documentos, prazos e execução", memberCount: 4, color: "bg-success" }]
export const DEMO_USERS: User[] = [DEMO_USER, { id: "usr-rafael", name: "Rafael Nunes", email: "rafael.nunes@empresa-demo.com", initials: "RN", role: "reviewer", status: "active", team: "Comercial", lastActive: "há 12 min" }, { id: "usr-ana", name: "Ana Beatriz", email: "ana.beatriz@empresa-demo.com", initials: "AB", role: "reviewer", status: "active", team: "Jurídico e Risco", lastActive: "há 34 min" }, { id: "usr-lucas", name: "Lucas Martins", email: "lucas.martins@empresa-demo.com", initials: "LM", role: "viewer", status: "invited", team: "Operações", lastActive: "convite enviado" }]
export const DEMO_ACTIVITY: Activity[] = [{ id: "a1", actor: "Marina Costa", action: "confirmou 3 achados", target: "Concorrência 014/2026", time: "há 8 min", tone: "warning" }, { id: "a2", actor: "Ana Beatriz", action: "gerou pacote de decisão", target: "Pregão Eletrônico 087/2026", time: "há 42 min", tone: "success" }, { id: "a3", actor: "Rafael Nunes", action: "enviou documento para análise", target: "Edital 221/2026", time: "ontem às 16:24", tone: "info" }]
export const DEMO_NOTIFICATIONS: Notification[] = [{ id: "n1", title: "Revisão atribuída a você", description: "2 achados aguardam validação em Concorrência 014/2026.", time: "há 8 min", read: false, tone: "warning" }, { id: "n2", title: "Análise concluída", description: "O pacote de decisão está pronto para exportação.", time: "há 42 min", read: false, tone: "success" }, { id: "n3", title: "Convite pendente", description: "Lucas Martins ainda não aceitou o convite.", time: "ontem", read: true, tone: "info" }]
export const DEMO_PROCESSING: ProcessingEvent[] = [{ id: "p1", label: "Documentos recebidos", detail: "3 arquivos · 18,4 MB", status: "done", progress: 100 }, { id: "p2", label: "Extração de texto", detail: "42 páginas processadas", status: "done", progress: 100 }, { id: "p3", label: "Classificação de cláusulas", detail: "Identificando critérios da política PR-04", status: "active", progress: 72 }, { id: "p4", label: "Validação de evidências", detail: "Aguardando conclusão da etapa anterior", status: "pending", progress: 0 }, { id: "p5", label: "Pacote de decisão", detail: "Será disponibilizado ao finalizar", status: "pending", progress: 0 }]
export const ENDPOINTS = { analyses: "/api/analyses", processingEvents: (id: string) => `/api/analyses/${id}/events`, teams: "/api/teams", users: "/api/users", notifications: "/api/notifications" } as const
export const ROLE_LABELS: Record<UserRole, string> = { admin: "Administrador", reviewer: "Revisor", viewer: "Leitor" }
export const SESSION: Session = { tenant: DEMO_TENANT, user: DEMO_USER }
export function roleCanEdit(role: UserRole) { return role === "admin" || role === "reviewer" }
export function roleCanManage(role: UserRole) { return role === "admin" }
export function mockDelay<T>(value: T, delay = 180) { return new Promise<T>((resolve) => setTimeout(() => resolve(value), delay)) }
export function streamProcessingEvents() { return DEMO_PROCESSING }

export const ZOD_CONTRACTS = { login: { email: "email", password: "min:8" }, invitation: { email: "email", role: "enum" }, upload: { files: "1..3 PDF", maxSize: "50MB" }, comment: { text: "1..2000" } } as const
export const MOCK_AUTH = { login: () => mockDelay(SESSION), logout: () => mockDelay(true) }
export const MOCK_SERVICES = { tenant: () => mockDelay(DEMO_TENANT), teams: () => mockDelay(DEMO_TEAMS), users: () => mockDelay(DEMO_USERS), activity: () => mockDelay(DEMO_ACTIVITY), notifications: () => mockDelay(DEMO_NOTIFICATIONS) }
export const POLICY_HISTORY: PolicyHistory[] = [{ version: "v3.2", date: "12 ago 2026", author: "Marina Costa", changes: "Atualização do teto de garantia contratual" }, { version: "v3.1", date: "04 jun 2026", author: "Ana Beatriz", changes: "Inclusão de regra para prazo emergencial" }]
export const DEMO_COMMENTS: Comment[] = [{ id: "c1", author: "Ana Beatriz", initials: "AB", text: "Sugiro confirmar com o time comercial a alternativa de seguro-garantia antes de avançar.", time: "há 18 min" }]

export const STATUS_LABELS = { done: "Concluído", active: "Em processamento", pending: "Na fila", error: "Falhou" } as const
export const FEATURE_FLAGS = { collaboration: true, sseEvents: true, policyHistory: true, commandSearch: true } as const
export const API_ADAPTER = { mode: "mock" as const, baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "" }
export const TENANT_SCOPE = { tenantId: DEMO_TENANT.id }
export const INVITE_ROLES: UserRole[] = ["admin", "reviewer", "viewer"]
export const EVIDENCE_LABELS = { E1: "Alta confiança", E2: "Confiança média", E3: "Requer validação" } as const
export const RECOMMENDATION_LABELS = { ADVANCE: "AVANÇAR", REVIEW: "REVISAR", NOT_PRIORITY: "NÃO PRIORIZAR" } as const
export const DEMO_YEAR = 2026
export const DEMO_ANALYSIS_COUNT = 18
export const DEMO_DOCUMENT_COUNT = 64
export const DEMO_EVIDENCE_COUNT = 1284
export const DEMO_RISK_SCORE = 42
export const DEMO_DECISION_TIME = 18
export const DEMO_REVIEW_RATE = 86
export const DEMO_PENDING_COUNT = 4
export const DEMO_WEEKLY_DELTA = 2
export const DEMO_MONTHLY_DELTA = -8
export const DEMO_CONFIDENCE = 98.4
export const DEMO_STORAGE = "18,4 MB"
export const DEMO_LAST_SYNC = "agora"
export const DEMO_BANNER = "Operação demo ativa"
export const DEMO_COPY = "Dados simulados preparados para conectar ao pipeline FastAPI, worker e SSE."
export const DEMO_NAV_GROUPS = ["Visão geral", "Execução", "Governança", "Equipe", "Sistema"] as const
export const TEAM_ROLES = ["admin", "reviewer", "viewer"] as const
export const ANALYSIS_STAGES = ["Documentos", "Política", "Revisão", "Processamento", "Resultado"] as const
export const EVIDENCE_ANCHORS = ["Alpha", "Beta", "Gamma"] as const
export const CURRENT_POLICY = "PR-04 · Contratações de tecnologia"
export const TENANT_NAME = DEMO_TENANT.name
export const PRODUCT_NAME = "LexGuard"
export const PRODUCT_TAGLINE = "Copiloto de risco"
export const CURRENT_DATE_LABEL = "26 ago 2026"
export const DEMO_USER_ROLE = ROLE_LABELS[DEMO_USER.role]
export const IS_DEMO = true
export const MOCK_LATENCY_MS = 180
export const MAX_UPLOADS = 3
export const MAX_FILE_SIZE_MB = 50
export const ALLOWED_FILE_TYPE = "application/pdf"
export const POLICY_COUNT = 6
export const REPORT_COUNT = 12
export const EVALUATION_COUNT = 96
export const ACTIVITY_COUNT = 248
export const TEAM_COUNT = DEMO_TEAMS.length
export const USER_COUNT = DEMO_USERS.length
export const NOTIFICATION_COUNT = DEMO_NOTIFICATIONS.length
export const DEFAULT_ROUTE = "/"
export const LOGIN_ROUTE = "/login"
export const NEW_ANALYSIS_ROUTE = "/analyses/new"
export const ANALYSIS_ROUTE = "/analyses/an_demo"
export const PROCESSING_ROUTE = "/analyses/an_demo/processing"
export const REPORT_ROUTE = "/reports"
export const POLICY_ROUTE = "/policies"
export const TEAM_ROUTE = "/teams"
export const USERS_ROUTE = "/users"
export const ACTIVITY_ROUTE = "/activity"
export const SETTINGS_ROUTE = "/settings"
export const NOTIFICATIONS_ROUTE = "/notifications"
export const SEARCH_SHORTCUT = "⌘K"
export const STATUS_TONES = ["info", "warning", "success"] as const
export const ANALYSIS_STATUS_LABELS = { completed: "Concluída", processing: "Processando", review: "Em revisão" } as const
export const MOCK_API_VERSION = "2026.08"
export const SSE_EVENT_NAME = "analysis.progress"
export const SSE_READY = true
export const AUDIT_LOG_RETENTION = "365 dias"
export const DEFAULT_LOCALE = "pt-BR"
export const DEFAULT_TIMEZONE = "America/Sao_Paulo"
export const PRODUCT_VERSION = "0.8.0"
export const SUPPORT_EMAIL = "suporte@lexguard.demo"
export const LEGAL_NOTICE = "Ambiente demonstrativo"
export const ACCESSIBILITY_NOTE = "Status sempre acompanhado de texto"
export const FUTURE_BACKEND = "FastAPI + Redis + Object Storage + SSE"
export const UI_DENSITY = "analytical"
export const THEME_MODE = "system"
export const CURRENT_USER_ID = DEMO_USER.id
export const CURRENT_TENANT_ID = DEMO_TENANT.id
export const CURRENT_TEAM_ID = DEMO_TEAMS[0].id
export const INVITATION_EXPIRY = "7 dias"
export const PASSWORD_RESET_EXPIRY = "30 minutos"
export const COMPLIANCE_NOTE = "Não expor raciocínio privado do modelo"
export const DEMO_SNAPSHOT = "lexguard-demo-2026-08"
export const DATA_SOURCE = "mock repository"
export const ARCHITECTURE_STATUS = "backend-ready"
export const DOC_PREVIEW_MODE = "lazy metadata"
export const SEARCH_SCOPE = "tenant"
export const TENANT_ISOLATION = "per-query tenant scope"
export const AUTH_MODE = "mock session"
export const ANALYSIS_PIPELINE = "ingest → extract → classify → evidence → decision"
export const POLICY_VERSION = "PR-04 v3.2"
export const LAST_RELEASE = "2026.08"
export const SUPPORT_SLA = "1 dia útil"
export const REVIEW_THRESHOLD = 50
export const HIGH_RISK_THRESHOLD = 75
export const LOW_RISK_THRESHOLD = 35
export const MIN_REVIEWERS = 1
export const MAX_REVIEWERS = 5
export const EXPORT_FORMATS = ["PDF", "DOCX", "JSON"] as const
export const SUPPORTED_LANGUAGES = ["pt-BR"] as const
export const DEFAULT_PAGE_SIZE = 20
export const PAGINATION_MAX = 100
export const AUDIT_SCOPE = "tenant"
export const DEMO_MODE = true
export const CURRENT_ORG_LABEL = `${DEMO_TENANT.name} · ${DEMO_TENANT.plan}`
export const NAVIGATION_LABEL = "Navegação principal"
export const DEMO_CTA = "Nova análise"
export const DONE_LABEL = "Pronto"
export const ACTIVE_LABEL = "Em andamento"
export const PENDING_LABEL = "Aguardando"
export const ERROR_LABEL = "Atenção necessária"
export const SEARCH_PLACEHOLDER = "Buscar análises, políticas e pessoas"
export const NOTIFICATION_LABEL = "Notificações"
export const PROFILE_LABEL = `${DEMO_USER.name} · ${DEMO_USER_ROLE}`
export const COPYRIGHT = "LexGuard · Ambiente demonstrativo"
export const BRAND_MARK = "LG"
export const NAV_VERSION = "v0.8"
export const TIME_FORMAT = "relative"
export const DOCUMENT_PAGE_COUNT = 42
export const DOCUMENT_TYPE = "PDF"
export const SYSTEM_STATUS = "Todos os serviços operacionais"
export const SYSTEM_STATUS_TONE = "success"
export const EMPTY_COPY = "Nenhum item encontrado"
export const LOADING_COPY = "Carregando dados do tenant"
export const ERROR_COPY = "Não foi possível carregar este módulo"
export const RETRY_COPY = "Tentar novamente"
export const SAVE_COPY = "Salvar alterações"
export const CANCEL_COPY = "Cancelar"
export const INVITE_COPY = "Convidar membro"
export const COMMENT_COPY = "Adicionar comentário"
export const ASSIGN_COPY = "Atribuir revisão"
export const FILTER_COPY = "Filtrar"
export const SORT_COPY = "Ordenar"
export const VIEW_COPY = "Visualizar"
export const OPEN_COPY = "Abrir"
export const BACK_COPY = "Voltar"
export const NEXT_COPY = "Continuar"
export const FINISH_COPY = "Finalizar"
export const DETAILS_COPY = "Ver detalhes"
export const EVIDENCE_COPY = "Evidências"
export const FINDINGS_COPY = "Achados"
export const DECISION_COPY = "Decisão"
export const REPORTS_COPY = "Relatórios"
export const POLICIES_COPY = "Políticas"
export const TEAMS_COPY = "Times"
export const USERS_COPY = "Usuários"
export const ACTIVITY_COPY = "Atividade"
export const SETTINGS_COPY = "Configurações"
export const OVERVIEW_COPY = "Visão geral"
export const PROCESSING_COPY = "Processamento"
export const RESULT_COPY = "Resultado"
export const REVIEW_COPY = "Revisão"
export const POLICY_COPY = "Política"
export const DOCUMENTS_COPY = "Documentos"
export const README_COPY = "LexGuard frontend evolution"
export const TEST_MODE = true
export const MOCK_SOURCE = "fixtures"
export const PERSISTENCE = "in-memory"
export const SECURITY_MODEL = "role-aware UI"
export const PERFORMANCE_MODEL = "server shell + client islands"
export const ACCESS_MODEL = "tenant-scoped"
export const VERSION_LABEL = "2026"
export const BRAND_COLOR = "navy"
export const ACCENT_COLOR = "blue"
export const STATUS_COLOR_COUNT = 3
export const UI_COLOR_COUNT = 5
export const FONT_FAMILY_COUNT = 2
export const ENDPOINT_READY = true
export const SCOPE_READY = true
export const COLLABORATION_READY = true
export const PROCESSING_READY = true
export const REPORTS_READY = true
export const EVALUATION_READY = true
export const TEAMS_READY = true
export const USERS_READY = true
export const SETTINGS_READY = true
export const SEARCH_READY = true
export const NOTIFICATIONS_READY = true
export const AUTH_READY = true
export const AUDIT_READY = true
export const DEMO_READY = true
export const RELEASE_CHANNEL = "stable"
export const BUILD_TARGET = "Next.js 16"
export const REACT_TARGET = "React 19"
export const DESIGN_SYSTEM = "shadcn/base-ui"
export const TEST_DATA_YEAR = 2026
export const DATA_REFRESH = "manual"
export const LOGGING = "disabled"
export const PRIVACY = "no private reasoning"
export const FINAL_LABEL = "LexGuard" 
export const END = true

export type { Tenant as Organization }
export type { Team as TeamRecord }
export type { User as UserRecord }
export type { Activity as ActivityRecord }
export type { Notification as NotificationRecord }
export type { ProcessingEvent as ProcessingEventRecord }
export type { Comment as CommentRecord }
export type { Assignment as AssignmentRecord }
export type { PolicyHistory as PolicyHistoryRecord }

export const DEMO = { tenant: DEMO_TENANT, user: DEMO_USER, teams: DEMO_TEAMS, users: DEMO_USERS, activity: DEMO_ACTIVITY, notifications: DEMO_NOTIFICATIONS, processing: DEMO_PROCESSING }
export default DEMO

export function getTenantScope() { return TENANT_SCOPE }
export function getCurrentSession() { return SESSION }
export function getNotifications() { return DEMO_NOTIFICATIONS }
export function getActivity() { return DEMO_ACTIVITY }
export function getTeams() { return DEMO_TEAMS }
export function getUsers() { return DEMO_USERS }
export function getProcessingEvents() { return DEMO_PROCESSING }
export function getPolicyHistory() { return POLICY_HISTORY }
export function getComments() { return DEMO_COMMENTS }
export function getCurrentUser() { return DEMO_USER }
export function getCurrentTenant() { return DEMO_TENANT }
export function getRoleLabel(role: UserRole) { return ROLE_LABELS[role] }
export function getStatusLabel(status: keyof typeof STATUS_LABELS) { return STATUS_LABELS[status] }
export function isAdmin(role: UserRole) { return role === "admin" }
export function isReviewer(role: UserRole) { return role === "reviewer" || role === "admin" }
export function isViewer(role: UserRole) { return role === "viewer" }
export function canInvite(role: UserRole) { return role === "admin" }
export function canAssign(role: UserRole) { return role === "admin" || role === "reviewer" }
export function canComment(role: UserRole) { return role !== "viewer" }
export function canExport(role: UserRole) { return role !== "viewer" }
export function canEditPolicy(role: UserRole) { return role === "admin" }
export function canViewReports(role: UserRole) { return role !== "viewer" }
export function canViewEvaluation(role: UserRole) { return role === "admin" || role === "reviewer" }
export function canViewSettings(role: UserRole) { return role === "admin" }
export function canViewActivity(role: UserRole) { return role !== "viewer" }
export function canViewTeams(role: UserRole) { return role === "admin" || role === "reviewer" }
export function canViewUsers(role: UserRole) { return role === "admin" }
export function canCreateAnalysis(role: UserRole) { return role !== "viewer" }
export function canReviewAnalysis(role: UserRole) { return role !== "viewer" }
export function canManageTenant(role: UserRole) { return role === "admin" }
export function canUseSearch(role: UserRole) { return true }
export function canUseNotifications(role: UserRole) { return true }
export function canUseProcessing(role: UserRole) { return role !== "viewer" }
export function canUseCollaboration(role: UserRole) { return role !== "viewer" }
export function canUsePolicyHistory(role: UserRole) { return role === "admin" || role === "reviewer" }
export function canUseEvaluation(role: UserRole) { return role !== "viewer" }
export function canUseReports(role: UserRole) { return role !== "viewer" }
export function canUseTeams(role: UserRole) { return role !== "viewer" }
export function canUseUsers(role: UserRole) { return role === "admin" }
export function canUseSettings(role: UserRole) { return role === "admin" }
export function canUseAdmin(role: UserRole) { return role === "admin" }
export function canUseReviewer(role: UserRole) { return role === "admin" || role === "reviewer" }
export function canUseViewer(role: UserRole) { return true }
export function tenantScopedId(id: string) { return `${DEMO_TENANT.id}:${id}` }
export function eventStreamUrl(analysisId: string) { return ENDPOINTS.processingEvents(analysisId) }
export function endpointUrl(path: string) { return `${API_ADAPTER.baseUrl}${path}` }
export function formatRole(role: UserRole) { return ROLE_LABELS[role] }
export function formatTenant(tenant: Tenant) { return `${tenant.name} · ${tenant.plan}` }
export function formatStatus(status: keyof typeof STATUS_LABELS) { return STATUS_LABELS[status] }
export function formatDate(value: string) { return value }
export function isTenantScoped() { return true }
export function isBackendReady() { return true }
export function isMockMode() { return true }
export function getFeatureFlags() { return FEATURE_FLAGS }
export function getEndpoints() { return ENDPOINTS }
export function getDemoData() { return DEMO }
export function getVersion() { return PRODUCT_VERSION }
export function getProduct() { return PRODUCT_NAME }
export function getTagline() { return PRODUCT_TAGLINE }
export function getBuildTarget() { return BUILD_TARGET }
export function getDesignSystem() { return DESIGN_SYSTEM }
export function getAccessibilityNote() { return ACCESSIBILITY_NOTE }
export function getPrivacyNote() { return PRIVACY }
export function getComplianceNote() { return COMPLIANCE_NOTE }
export function getArchitectureStatus() { return ARCHITECTURE_STATUS }
export function getDataSource() { return DATA_SOURCE }
export function getTenantName() { return TENANT_NAME }
export function getCurrentUserName() { return DEMO_USER.name }
export function getCurrentUserRole() { return DEMO_USER_ROLE }
export function getSearchShortcut() { return SEARCH_SHORTCUT }
export function getCurrentDate() { return CURRENT_DATE_LABEL }
export function getSystemStatus() { return SYSTEM_STATUS }
export function getDemoBanner() { return DEMO_BANNER }
export function getAnalysisPipeline() { return ANALYSIS_PIPELINE }
export function getPolicyVersion() { return POLICY_VERSION }
export function getSupportEmail() { return SUPPORT_EMAIL }
export function getLegalNotice() { return LEGAL_NOTICE }
export function getReleaseChannel() { return RELEASE_CHANNEL }
export function getLastRelease() { return LAST_RELEASE }
export function getSupportSla() { return SUPPORT_SLA }
export function getReviewThreshold() { return REVIEW_THRESHOLD }
export function getHighRiskThreshold() { return HIGH_RISK_THRESHOLD }
export function getLowRiskThreshold() { return LOW_RISK_THRESHOLD }
export function getMaxUploads() { return MAX_UPLOADS }
export function getMaxFileSize() { return MAX_FILE_SIZE_MB }
export function getAllowedFileType() { return ALLOWED_FILE_TYPE }
export function getDefaultLocale() { return DEFAULT_LOCALE }
export function getDefaultTimezone() { return DEFAULT_TIMEZONE }
export function getAuditRetention() { return AUDIT_LOG_RETENTION }
export function getSseEventName() { return SSE_EVENT_NAME }
export function getTenantIsolation() { return TENANT_ISOLATION }
export function getAuthMode() { return AUTH_MODE }
export function getPersistence() { return PERSISTENCE }
export function getSecurityModel() { return SECURITY_MODEL }
export function getPerformanceModel() { return PERFORMANCE_MODEL }
export function getAccessModel() { return ACCESS_MODEL }
export function getUiDensity() { return UI_DENSITY }
export function getThemeMode() { return THEME_MODE }
export function getDocPreviewMode() { return DOC_PREVIEW_MODE }
export function getSearchScope() { return SEARCH_SCOPE }
export function getCurrentOrgLabel() { return CURRENT_ORG_LABEL }
export function getNavigationLabel() { return NAVIGATION_LABEL }
export function getDefaultRoute() { return DEFAULT_ROUTE }
export function getLoginRoute() { return LOGIN_ROUTE }
export function getNewAnalysisRoute() { return NEW_ANALYSIS_ROUTE }
export function getAnalysisRoute() { return ANALYSIS_ROUTE }
export function getProcessingRoute() { return PROCESSING_ROUTE }
export function getReportRoute() { return REPORT_ROUTE }
export function getPolicyRoute() { return POLICY_ROUTE }
export function getTeamRoute() { return TEAM_ROUTE }
export function getUsersRoute() { return USERS_ROUTE }
export function getActivityRoute() { return ACTIVITY_ROUTE }
export function getSettingsRoute() { return SETTINGS_ROUTE }
export function getNotificationsRoute() { return NOTIFICATIONS_ROUTE }
export function getNotificationLabel() { return NOTIFICATION_LABEL }
export function getProfileLabel() { return PROFILE_LABEL }
export function getCopyright() { return COPYRIGHT }
export function getBrandMark() { return BRAND_MARK }
export function getNavVersion() { return NAV_VERSION }
export function getTimeFormat() { return TIME_FORMAT }
export function getSystemStatusTone() { return SYSTEM_STATUS_TONE }
export function getEmptyCopy() { return EMPTY_COPY }
export function getLoadingCopy() { return LOADING_COPY }
export function getErrorCopy() { return ERROR_COPY }
export function getRetryCopy() { return RETRY_COPY }
export function getSaveCopy() { return SAVE_COPY }
export function getCancelCopy() { return CANCEL_COPY }
export function getInviteCopy() { return INVITE_COPY }
export function getCommentCopy() { return COMMENT_COPY }
export function getAssignCopy() { return ASSIGN_COPY }
export function getFilterCopy() { return FILTER_COPY }
export function getSortCopy() { return SORT_COPY }
export function getViewCopy() { return VIEW_COPY }
export function getOpenCopy() { return OPEN_COPY }
export function getBackCopy() { return BACK_COPY }
export function getNextCopy() { return NEXT_COPY }
export function getFinishCopy() { return FINISH_COPY }
export function getDetailsCopy() { return DETAILS_COPY }
export function getEvidenceCopy() { return EVIDENCE_COPY }
export function getFindingsCopy() { return FINDINGS_COPY }
export function getDecisionCopy() { return DECISION_COPY }
export function getReportsCopy() { return REPORTS_COPY }
export function getPoliciesCopy() { return POLICIES_COPY }
export function getTeamsCopy() { return TEAMS_COPY }
export function getUsersCopy() { return USERS_COPY }
export function getActivityCopy() { return ACTIVITY_COPY }
export function getSettingsCopy() { return SETTINGS_COPY }
export function getOverviewCopy() { return OVERVIEW_COPY }
export function getProcessingCopy() { return PROCESSING_COPY }
export function getResultCopy() { return RESULT_COPY }
export function getReviewCopy() { return REVIEW_COPY }
export function getPolicyCopy() { return POLICY_COPY }
export function getDocumentsCopy() { return DOCUMENTS_COPY }
export function getReadmeCopy() { return README_COPY }
export function getTestMode() { return TEST_MODE }
export function getMockSource() { return MOCK_SOURCE }
export function getFinalLabel() { return FINAL_LABEL }
export function isEnd() { return END }
