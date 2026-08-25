export type PolicyStatus = "active" | "draft" | "archived"

export interface PolicyRules {
  /** Prazo mínimo em dias */
  minDeadlineDays: number
  /** Multa máxima (%) */
  maxPenaltyPct: number
  /** Garantia máxima (%) */
  maxGuaranteePct: number
  /** Valor máximo (BRL) */
  maxValueBRL: number
  /** Exige qualificação técnica */
  requiresTechnicalQualification: boolean
}

export interface RiskPolicyVersion {
  version: string
  updatedAt: string
  note?: string
}

export interface RiskPolicy {
  id: string
  name: string
  description: string
  status: PolicyStatus
  version: string
  updatedAt: string
  rules: PolicyRules
  history?: RiskPolicyVersion[]
  custom?: boolean
}
