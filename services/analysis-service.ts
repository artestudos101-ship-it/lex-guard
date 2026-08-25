import type { Analysis, AnalysisSummary, AnalyzedDocument } from "@/types"
import { MOCK_ANALYSES } from "@/mock/analyses"
import { delay } from "./util"

export async function listAnalyses(): Promise<AnalysisSummary[]> {
  const summaries: AnalysisSummary[] = MOCK_ANALYSES.map((a) => {
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
  return delay(summaries, 400)
}

export async function getAnalysis(id: string): Promise<Analysis | null> {
  const found = MOCK_ANALYSES.find((a) => a.id === id) ?? null
  return delay(found, 450)
}

/** The document that drives the headline recommendation (highest risk wins). */
export function pickHeadlineDocument(documents: AnalyzedDocument[]): AnalyzedDocument {
  return [...documents].sort((a, b) => b.decision.riskScore.value - a.decision.riskScore.value)[0]
}
