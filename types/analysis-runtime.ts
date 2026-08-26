import type { AnalysisBlock } from "./analysis-block"
import type { AnalysisSummary } from "./analysis"
import type { Job, JobEvent } from "./job"

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
}
