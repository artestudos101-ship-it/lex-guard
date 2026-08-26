import { API_ADAPTER, CURRENT_TENANT_ID } from "@/types/organization"

export class ApiError extends Error { constructor(public status: number, message: string, public requestId?: string) { super(message) } }

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 10_000)
  try { const response = await fetch(`${API_ADAPTER.baseUrl}${path}`, { ...init, signal: controller.signal, headers: { "content-type": "application/json", "x-tenant-id": CURRENT_TENANT_ID, ...init.headers } }); const requestId = response.headers.get("x-request-id") ?? undefined; if (!response.ok) throw new ApiError(response.status, "Não conseguimos carregar os dados.", requestId); return response.status === 204 ? (undefined as T) : response.json() as Promise<T> } finally { clearTimeout(timeout) }
}

export const api = { get: <T>(path: string) => apiRequest<T>(path), post: <T>(path: string, body: unknown) => apiRequest<T>(path, { method: "POST", body: JSON.stringify(body) }), patch: <T>(path: string, body: unknown) => apiRequest<T>(path, { method: "PATCH", body: JSON.stringify(body) }) }
