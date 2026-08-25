import type { ActivityItem, DashboardMetric, EvaluationMetrics } from "@/types"
import { delay } from "./util"

export async function getDashboardMetrics(): Promise<DashboardMetric[]> {
  return delay(
    [
      { key: "analyses", label: "Editais analisados", value: "48", hint: "últimos 30 dias" },
      { key: "advance", label: "Recomendados para avançar", value: "17", hint: "35% do total" },
      { key: "hours", label: "Horas economizadas", value: "312h", hint: "vs. leitura manual" },
      { key: "precision", label: "Precisão dos riscos", value: "92%", hint: "validado por humanos" },
    ],
    350,
  )
}

export async function getActivity(): Promise<ActivityItem[]> {
  return delay(
    [
      {
        id: "act_1",
        kind: "analysis_completed",
        title: "Lote de editais — Agosto/2025",
        description: "3 documentos processados · 1 avançar, 1 revisar, 1 não prioritário",
        at: "2025-08-23T12:14:00.000Z",
      },
      {
        id: "act_2",
        kind: "evidence_validated",
        title: "Garantia contratual elevada",
        description: "Evidência confirmada por analista · Pregão 112/2025",
        at: "2025-08-23T11:40:00.000Z",
      },
      {
        id: "act_3",
        kind: "report_generated",
        title: "Pacote executivo gerado",
        description: "Concorrência 009/2025 — Infraestrutura",
        at: "2025-08-21T16:00:00.000Z",
      },
      {
        id: "act_4",
        kind: "review_requested",
        title: "Revisão solicitada",
        description: "Prazo de proposta reduzido · Pregão 112/2025",
        at: "2025-08-21T09:42:00.000Z",
      },
    ],
    350,
  )
}

export async function getEvaluationMetrics(): Promise<EvaluationMetrics> {
  return delay(
    {
      confirmedFindingsPct: 74,
      rejectedFindingsPct: 14,
      pendingReviewPct: 12,
      falsePositives: 6,
      falseNegatives: 2,
      decisionsChanged: 3,
      precisionSeries: [
        { period: "Abr", precision: 84 },
        { period: "Mai", precision: 86 },
        { period: "Jun", precision: 88 },
        { period: "Jul", precision: 90 },
        { period: "Ago", precision: 92 },
      ],
    },
    400,
  )
}
