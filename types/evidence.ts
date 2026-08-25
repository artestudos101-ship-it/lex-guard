/** E1 = confirmada, E2 = parcial, E3 = requer validação humana */
export type EvidenceQuality = "E1" | "E2" | "E3"

export type RiskSeverity = "critical" | "medium" | "low" | "info"

export type ConflictStatus = "ok" | "warning" | "violation"

export interface EvidenceLocation {
  page: number
  clause: string
}

export interface PolicyConflict {
  criterion: string
  policyValue: string
  editalValue: string
  status: ConflictStatus
}

export interface Finding {
  id: string
  title: string
  severity: RiskSeverity
  quality: EvidenceQuality
  /** O quê? */
  what: string
  /** Onde? */
  where: EvidenceLocation
  /** Trecho do edital */
  quote: string
  /** Por quê? */
  why: string
  /** Impacto */
  impact: string
  /** Ação recomendada */
  recommendedAction: string
  /** Validado por humano */
  confirmed: boolean
  policyConflict?: PolicyConflict
}
