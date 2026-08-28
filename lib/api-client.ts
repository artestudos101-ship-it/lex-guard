import { API_ADAPTER } from "@/types/organization"

export class ApiError extends Error {
  constructor(public status: number, message: string, public requestId?: string, public code?: string) { super(message) }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  const requestId = crypto.randomUUID()
  try {
    const response = await fetch(`${API_ADAPTER.baseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      credentials: "include",
      headers: { "content-type": "application/json", "x-request-id": requestId, ...init.headers },
    })
    const responseRequestId = response.headers.get("x-request-id") ?? requestId
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { error?: { code?: string; message?: string }; detail?: { code?: string; message?: string } } | null
      const error = body?.error ?? body?.detail
      throw new ApiError(response.status, error?.message ?? "Não conseguimos carregar os dados.", responseRequestId, error?.code)
    }
    if (response.status === 204) return undefined as T
    const body = await response.json()
    return (body?.data ?? body) as T
  } finally {
    clearTimeout(timeout)
  }
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T>(path: string, body: unknown) => apiRequest<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => apiRequest<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
}
