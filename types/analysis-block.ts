import type { LucideIcon } from "lucide-react"

export type AnalysisBlockType = "document" | "extraction" | "section" | "variable" | "evidence" | "policy" | "risk" | "decision" | "consolidation"
export type AnalysisBlockStatus = "pending" | "active" | "completed" | "warning" | "error"

export interface AnalysisBlockLink {
  id: string
  label: string
  kind: "document" | "evidence" | "rule" | "policy"
}

export interface AnalysisBlock {
  id: string
  type: AnalysisBlockType
  step: number
  title: string
  iconName: "FileInput" | "FileText" | "ScanSearch" | "Braces" | "Quote" | "ShieldCheck" | "TriangleAlert" | "Scale" | "CheckCircle2"
  status: AnalysisBlockStatus
  timestamp: string
  description: string
  documents?: AnalysisBlockLink[]
  evidences?: AnalysisBlockLink[]
  rules?: AnalysisBlockLink[]
  policy?: AnalysisBlockLink
  metadata?: Record<string, string>
  actions?: Array<"document" | "evidence" | "policy" | "decision">
}
