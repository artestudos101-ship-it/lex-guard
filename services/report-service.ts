import type { DecisionPackageType, ReportRow } from "@/types"
import { MOCK_ANALYSES } from "@/mock/analyses"
import { pickHeadlineDocument } from "./analysis-service"
import { delay } from "./util"

let store: ReportRow[] = [
  {
    id: "rep_1",
    analysisId: "an_saude",
    analysisTitle: "Pregão Eletrônico 112/2025",
    orgao: "Secretaria de Estado da Saúde",
    createdAt: "2025-08-21T10:05:00.000Z",
    recommendation: "REVIEW",
    type: "executive",
    status: "ready",
  },
  {
    id: "rep_2",
    analysisId: "an_infra",
    analysisTitle: "Concorrência 009/2025 — Infraestrutura",
    orgao: "Departamento Nacional de Infraestrutura",
    createdAt: "2025-08-19T16:00:00.000Z",
    recommendation: "NOT_PRIORITY",
    type: "legal",
    status: "ready",
  },
]

export async function listReports(): Promise<ReportRow[]> {
  return delay([...store], 400)
}

export async function generateReport(analysisId: string, type: DecisionPackageType): Promise<ReportRow> {
  const analysis = MOCK_ANALYSES.find((a) => a.id === analysisId)
  if (!analysis) throw new Error("Análise não encontrada")
  const headline = pickHeadlineDocument(analysis.documents)
  const row: ReportRow = {
    id: `rep_${Date.now()}`,
    analysisId,
    analysisTitle: analysis.title,
    orgao: analysis.orgao,
    createdAt: new Date().toISOString(),
    recommendation: headline.decision.recommendation,
    type,
    status: "ready",
  }
  store = [row, ...store]
  return delay(row, 1200)
}
