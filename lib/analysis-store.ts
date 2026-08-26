"use client"

import { useCallback, useEffect, useState } from "react"
import { MOCK_ANALYSES } from "@/mock/analyses"
import type { Analysis } from "@/types"

const STORAGE_KEY = "lexguard:analyses:v1"

export type AnalysisView = Analysis & {
  progress: number
  owner: string
  steps: string[]
  completedSteps: number
  archived?: boolean
}

const defaultSteps = ["Contexto e objetivo", "Documentos vinculados", "Extração de evidências", "Comparação com política", "Mapa de riscos", "Recomendação"]

function hydrateDefaults(): AnalysisView[] {
  return MOCK_ANALYSES.map((analysis, index) => ({
    ...analysis,
    progress: analysis.status === "completed" ? 100 : index === 0 ? 72 : 100,
    owner: index === 0 ? "Marina Costa" : index === 1 ? "Rafael Lima" : "Ana Martins",
    steps: defaultSteps,
    completedSteps: analysis.status === "completed" ? defaultSteps.length : 4,
  }))
}

export function useAnalysisStore() {
  const [analyses, setAnalyses] = useState<AnalysisView[]>(hydrateDefaults)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) setAnalyses(JSON.parse(saved))
    } catch { /* use defaults when storage is unavailable */ }
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses))
  }, [analyses, ready])

  const update = useCallback((id: string, patch: Partial<AnalysisView>) => {
    setAnalyses((current) => current.map((item) => item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item))
  }, [])

  const archive = useCallback((id: string) => update(id, { archived: true }), [update])
  const duplicate = useCallback((id: string) => {
    setAnalyses((current) => {
      const source = current.find((item) => item.id === id)
      if (!source) return current
      return [{ ...source, id: `AN-${Date.now().toString().slice(-6)}`, title: `${source.title} · cópia`, status: "queued", progress: 0, completedSteps: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), archived: false }, ...current]
    })
  }, [])

  return { analyses: analyses.filter((item) => !item.archived), update, archive, duplicate, ready }
}

export { defaultSteps }
