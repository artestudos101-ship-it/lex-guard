import { API_ADAPTER, CURRENT_TENANT_ID } from "@/types/organization"
import type { ApiErrorPayload } from "./backend-contracts"

export class ApiError extends Error {
  constructor(public status: number, message: string, public requestId?: string, public code?: string) { super(message); this.name = "ApiError" }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  try {
    const response = await fetch(`${API_ADAPTER.baseUrl}${path}`, { ...init, signal: controller.signal, credentials: "include", headers: { accept: "application/json", "content-type": "application/json", "x-tenant-id": CURRENT_TENANT_ID, ...init.headers } })
    const requestId = response.headers.get("x-request-id") ?? undefined
    if (!response.ok) {
      let payload: ApiErrorPayload = {}
      try { payload = await response.json() as ApiErrorPayload } catch { /* non-json error */ }
      throw new ApiError(response.status, payload.message ?? "Não conseguimos carregar os dados.", requestId ?? payload.request_id, payload.code)
    }
    return response.status === 204 ? (undefined as T) : await response.json() as T
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw new ApiError(408, "A solicitação excedeu o tempo limite.")
    throw error
  } finally { clearTimeout(timeout) }
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T>(path: string, body: unknown) => apiRequest<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => apiRequest<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path: string) => apiRequest<void>(path, { method: "DELETE" }),
}
