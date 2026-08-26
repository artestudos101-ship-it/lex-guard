import { API_ADAPTER, ENDPOINTS } from "@/types/organization"
import type { BackendAdapter } from "./backend-contracts"
import { api } from "./api-client"
import { mockAdapter } from "./mock-adapter"
import type { RegisterInput } from "@/features/auth/types"
import type { Analysis, AnalysisSummary, DocumentPage, EditalDocument } from "@/types"
import type { Session } from "@/types/organization"

const apiAdapter: BackendAdapter = {
  login: (email, password) => api.post<Session>("/api/auth/login", { email, password }),
  register: (input: RegisterInput) => api.post<Session>("/api/auth/register", input),
  logout: () => api.post<void>("/api/auth/logout", {}),
  getSession: () => api.get<Session | null>("/api/auth/session"),
  forgotPassword: (email) => api.post<void>("/api/auth/forgot-password", { email }),
  listAnalyses: () => api.get<AnalysisSummary[]>(ENDPOINTS.analyses),
  getAnalysis: (id) => api.get<Analysis | null>(`${ENDPOINTS.analyses}/${id}`),
  getDocument: (id) => api.get<EditalDocument | null>(`/api/documents/${id}`),
  getDocumentPages: (id, from, to) => api.get<{ pages: DocumentPage[]; total: number }>(`/api/documents/${id}/pages?from=${from}&to=${to}`),
}

export const backendAdapter: BackendAdapter = API_ADAPTER.mode === "api" ? apiAdapter : mockAdapter
