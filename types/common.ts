import type { Recommendation } from "./decision"

export interface DashboardMetric {
  key: string
  label: string
  value: string
  hint?: string
}

export type ActivityKind =
  | "analysis_completed"
  | "analysis_processing"
  | "report_generated"
  | "evidence_validated"
  | "review_requested"

export interface ActivityItem {
  id: string
  kind: ActivityKind
  title: string
  description: string
  at: string
}

export interface EvaluationMetrics {
  confirmedFindingsPct: number
  rejectedFindingsPct: number
  pendingReviewPct: number
  falsePositives: number
  falseNegatives: number
  decisionsChanged: number
  precisionSeries: { period: string; precision: number }[]
}

export interface ReportRow {
  id: string
  analysisId: string
  analysisTitle: string
  orgao: string
  createdAt: string
  recommendation: Recommendation
  type: "executive" | "legal" | "operational"
  status: "ready" | "generating"
}
