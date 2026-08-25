import type { RiskSeverity } from "./evidence"

export type Recommendation = "ADVANCE" | "REVIEW" | "NOT_PRIORITY"

export type RiskBand = "low" | "medium" | "high"

export type EvidenceStrength = "Alta" | "Média" | "Baixa"

export interface RiskScore {
  /** 0-100 (maior = mais arriscado) */
  value: number
  band: RiskBand
}

export interface DecisionFactor {
  severity: RiskSeverity
  label: string
}

export interface Decision {
  recommendation: Recommendation
  riskScore: RiskScore
  evidenceQuality: EvidenceStrength
  conflictsCount: number
  mainRisk: string
  factors: DecisionFactor[]
}

export type DecisionPackageType = "executive" | "legal" | "operational"

export interface DecisionPackage {
  id: string
  analysisId: string
  analysisTitle: string
  orgao: string
  createdAt: string
  recommendation: Recommendation
  type: DecisionPackageType
  status: "ready" | "generating"
}
