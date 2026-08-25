import type { EditalDocument } from "./document"
import type { Finding, PolicyConflict } from "./evidence"
import type { Decision } from "./decision"

export type AnalysisStatus = "queued" | "processing" | "completed" | "failed"

export interface AnalyzedDocument {
  document: EditalDocument
  decision: Decision
  findings: Finding[]
  policyComparison: PolicyConflict[]
}

export interface Analysis {
  id: string
  title: string
  orgao: string
  valueBRL: number
  status: AnalysisStatus
  createdAt: string
  updatedAt: string
  policyId: string
  policyName: string
  documents: AnalyzedDocument[]
}

/** Compact row used by dashboard / list views. */
export interface AnalysisSummary {
  id: string
  title: string
  orgao: string
  valueBRL: number
  recommendation: import("./decision").Recommendation
  riskScore: number
  evidenceQuality: import("./decision").EvidenceStrength
  status: AnalysisStatus
  updatedAt: string
}
