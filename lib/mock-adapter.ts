import { DEMO_TENANT, DEMO_USER, MOCK_AUTH, mockDelay } from "@/types/organization"
import { MOCK_DOCUMENTS } from "@/mock/documents"
import { MOCK_ANALYSES } from "@/mock/analyses"
import type { BackendAdapter } from "./backend-contracts"
import type { AnalysisSummary } from "@/types"
import type { AnalyzedDocument, EditalDocument } from "@/types"

function pickHeadlineDocument(documents: AnalyzedDocument[]) { return [...documents].sort((a, b) => b.decision.riskScore.value - a.decision.riskScore.value)[0] }

export const mockAdapter: BackendAdapter = {
  login: async () => MOCK_AUTH.login(),
  register: async (input) => mockDelay({ user: { ...DEMO_USER, id: "usr-new", name: input.name, email: input.email }, tenant: { ...DEMO_TENANT, id: "tenant-new", name: input.organization || "Nova Empresa Ltda." } }),
  logout: async () => { await MOCK_AUTH.logout() },
  getSession: async () => MOCK_AUTH.login(),
  forgotPassword: async () => { await mockDelay(true) },
  listAnalyses: async () => mockDelay(MOCK_ANALYSES.map((a): AnalysisSummary => { const worst = pickHeadlineDocument(a.documents); return { id: a.id, title: a.title, orgao: a.orgao, valueBRL: a.valueBRL, recommendation: worst.decision.recommendation, riskScore: worst.decision.riskScore.value, evidenceQuality: worst.decision.evidenceQuality, status: a.status, updatedAt: a.updatedAt } }), 400),
  getAnalysis: async (id) => mockDelay(MOCK_ANALYSES.find((a) => a.id === id) ?? null, 450),
  getDocument: async (id) => { const rec = MOCK_DOCUMENTS[id]; if (!rec) return null; const { content, ...meta } = rec; return mockDelay(meta as EditalDocument, 250) },
  getDocumentPages: async (id, from, to) => { const rec = MOCK_DOCUMENTS[id]; if (!rec) return { pages: [], total: 0 }; return mockDelay({ pages: rec.content.filter((p) => p.page >= from && p.page <= to), total: rec.content.length }, 300) },
}
