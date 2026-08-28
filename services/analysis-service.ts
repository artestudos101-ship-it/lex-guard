import type { Analysis, AnalysisSummary, AnalyzedDocument } from "@/types"
import { MOCK_ANALYSES } from "@/mock/analyses"
import { API_ADAPTER } from "@/types/organization"
import { api } from "@/lib/api-client"
import { delay } from "./util"

function mockSummaries(): AnalysisSummary[] {
  return MOCK_ANALYSES.map((a) => {
    const worst = pickHeadlineDocument(a.documents)
    return {
      id: a.id,
      title: a.title,
      orgao: a.orgao,
      valueBRL: a.valueBRL,
      recommendation: worst.decision.recommendation,
      riskScore: worst.decision.riskScore.value,
      evidenceQuality: worst.decision.evidenceQuality,
      status: a.status,
      updatedAt: a.updatedAt,
    }
  })
}

export async function listAnalyses(): Promise<AnalysisSummary[]> {
  if (API_ADAPTER.mode === "api") {
    const rows = await api.get<Array<{ id: string; status: string; progress: number; document_ids: string[]; created_at: string }>>("/api/v1/analyses")
    return rows.map((row) => ({ id: row.id, title: `Análise ${row.id.slice(0, 8)}`, orgao: "Aguardando metadados", valueBRL: 0, recommendation: "REVIEW", riskScore: Math.max(0, 100 - row.progress), evidenceQuality: "Média", status: row.status.toLowerCase() as AnalysisSummary["status"], updatedAt: row.created_at }))
  }
  return delay(mockSummaries(), 400)
}

export async function getAnalysis(id: string): Promise<Analysis | null> {
  if (API_ADAPTER.mode === "api") {
    const row = await api.get<{ id: string; status: string; document_ids: string[]; created_at: string }>(`/api/v1/analyses/${id}`)
    return { id: row.id, title: `Análise ${row.id.slice(0, 8)}`, orgao: "Aguardando metadados", valueBRL: 0, status: row.status.toLowerCase() as Analysis["status"], createdAt: row.created_at, updatedAt: row.created_at, policyId: "", policyName: "", documents: [] }
  }
  const found = MOCK_ANALYSES.find((a) => a.id === id) ?? null
  return delay(found, 450)
}

/** The document that drives the headline recommendation (highest risk wins). */
export function pickHeadlineDocument(documents: AnalyzedDocument[]): AnalyzedDocument {
  return [...documents].sort((a, b) => b.decision.riskScore.value - a.decision.riskScore.value)[0]
}
