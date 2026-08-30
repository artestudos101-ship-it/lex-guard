"use client"

import { useEffect, useState } from "react"
import { API_ADAPTER } from "@/types/organization"

export type AnalysisEvent = { id: number; type: string; payload: Record<string, unknown> }

export function useAnalysisEvents(analysisId: string | undefined) {
  const [events, setEvents] = useState<AnalysisEvent[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!analysisId || API_ADAPTER.mode !== "api" || typeof EventSource === "undefined") return
    const source = new EventSource(`${API_ADAPTER.baseUrl}/api/v1/analyses/${analysisId}/events`, { withCredentials: true })
    const onMessage = (event: MessageEvent<string>) => {
      try {
        setEvents((current) => [...current, { id: Number(event.lastEventId || Date.now()), type: event.type, payload: JSON.parse(event.data) }])
      } catch {
        setEvents((current) => [...current, { id: Number(event.lastEventId || Date.now()), type: event.type, payload: {} }])
      }
    }
    source.onopen = () => setConnected(true)
    source.onmessage = onMessage
    source.addEventListener("queued", onMessage)
    source.addEventListener("progress", onMessage)
    source.addEventListener("completed", onMessage)
    source.onerror = () => setConnected(false)
    return () => source.close()
  }, [analysisId])

  return { events, connected }
}

export default useAnalysisEvents
