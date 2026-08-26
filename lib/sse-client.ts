import { API_ADAPTER, CURRENT_TENANT_ID } from "@/types/organization"
import type { AnalysisStreamEvent } from "./backend-contracts"

export function subscribeToAnalysis(id: string, onEvent: (event: AnalysisStreamEvent) => void, onError?: (error: Event) => void) {
  if (API_ADAPTER.mode !== "api") return () => { /* mock mode has no remote stream */ }
  const source = new EventSource(`${API_ADAPTER.baseUrl}/api/analyses/${id}/events?tenant_id=${encodeURIComponent(CURRENT_TENANT_ID)}`, { withCredentials: true })
  source.addEventListener("analysis.progress", (event) => onEvent({ type: "analysis.progress", data: JSON.parse((event as MessageEvent).data) }))
  if (onError) source.onerror = onError
  return () => source.close()
}
