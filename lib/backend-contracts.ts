import type { Analysis, AnalysisSummary, AnalyzedDocument, DocumentPage, EditalDocument } from "@/types"
import type { RegisterInput } from "@/features/auth/types"
import type { Session } from "@/types/organization"

export type ApiMode = "mock" | "api"
export type ApiErrorPayload = { message?: string; code?: string; request_id?: string }
export type DocumentPageWindow = { pages: DocumentPage[]; total: number }
export type AnalysisStreamEvent = { type: "analysis.progress"; data: { id: string; label: string; detail: string; status: string; progress: number } }

export interface BackendAdapter {
  login(email: string, password: string): Promise<Session>
  register(input: RegisterInput): Promise<Session>
  logout(): Promise<void>
  getSession(): Promise<Session | null>
  forgotPassword(email: string): Promise<void>
  listAnalyses(): Promise<AnalysisSummary[]>
  getAnalysis(id: string): Promise<Analysis | null>
  getDocument(id: string): Promise<EditalDocument | null>
  getDocumentPages(id: string, from: number, to: number): Promise<DocumentPageWindow>
}
