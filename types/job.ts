import type { AnalysisStatus } from "./analysis"

export type JobEventType =
  | "JOB_CREATED"
  | "EXTRACTION_STARTED"
  | "EXTRACTION_COMPLETED"
  | "SECTION_DETECTED"
  | "LLM_STARTED"
  | "LLM_COMPLETED"
  | "EVIDENCE_VALIDATED"
  | "RULES_APPLIED"
  | "DECISION_READY"
  | "JOB_FAILED"

export type JobStepStatus = "done" | "active" | "pending"

export interface JobStep {
  key: string
  label: string
  status: JobStepStatus
}

export interface Job {
  id: string
  documentId: string
  documentName: string
  progress: number
  currentStep: string
  status: AnalysisStatus
  steps: JobStep[]
}

export interface JobEvent {
  type: JobEventType
  jobId: string
  documentId?: string
  progress?: number
  message?: string
  at: string
}
