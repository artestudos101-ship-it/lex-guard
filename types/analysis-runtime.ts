import type { AnalysisBlock } from "./analysis-block"
import type { AnalysisSummary } from "./analysis"
import type { Job, JobEvent } from "./job"

export interface RuntimeEvidence {
  id: string
  label: string
  page: number | null
  excerpt: string
}

export interface PublicValidationCheck {
  source: "PNCP" | "Receita Federal" | "Compras.gov.br"
  status: "verified" | "warning" | "not_found" | "unavailable"
  detail: string
  url?: string
}

export interface RuntimeConflict {
  id: string
  title: string
  description: string
  severity: "high" | "medium" | "low"
}

export interface RuntimeAnalysis extends AnalysisSummary {
  policyName: string
  documentNames: string[]
  responsible: string
  progress: number
  currentStep: string
  evidenceCount: number
  conflictCount: number
  blocks: AnalysisBlock[]
  events: JobEvent[]
  jobs: Job[]
  summary?: string
  llmSource?: "gemini" | "demo"
  evidences?: RuntimeEvidence[]
  conflicts?: RuntimeConflict[]
  chatMessages?: Array<{ role: "user" | "assistant"; content: string; createdAt: string }>
  validationChecks?: PublicValidationCheck[]
  sourceDocument?: { name: string; data: string; mimeType: "application/pdf" }
}
