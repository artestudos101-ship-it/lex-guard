"use client"

import { useCallback, useEffect, useState } from "react"
import { MOCK_ANALYSES } from "@/mock/analyses"
import type { Analysis } from "@/types"

const STORAGE_KEY = "lexguard:analyses:v2"
export type StepState = "pending" | "processing" | "completed" | "review"
export type AnalysisView = Analysis & { progress: number; owner: string; steps: string[]; stepStates: StepState[]; completedSteps: number; archived?: boolean }
export const defaultSteps = ["Contexto e objetivo", "Documentos vinculados", "Extração de evidências", "Comparação com política", "Mapa de riscos", "Recomendação"]

function hydrateDefaults(): AnalysisView[] {
  return MOCK_ANALYSES.map((analysis, index) => {
    const completed = analysis.status === "completed" ? defaultSteps.length : index === 0 ? 4 : defaultSteps.length
    return { ...analysis, progress: Math.round((completed / defaultSteps.length) * 100), owner: index === 0 ? "Marina Costa" : index === 1 ? "Rafael Lima" : "Ana Martins", steps: defaultSteps, stepStates: defaultSteps.map((_, step) => step < completed ? "completed" : step === completed && analysis.status === "processing" ? "processing" : "pending"), completedSteps: completed }
  })
}

export function useAnalysisStore() {
  const [analyses, setAnalyses] = useState<AnalysisView[]>(hydrateDefaults)
  const [ready, setReady] = useState(false)
  useEffect(() => { try { const saved = window.localStorage.getItem(STORAGE_KEY); if (saved) setAnalyses(JSON.parse(saved)) } catch {} setReady(true) }, [])
  useEffect(() => { if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses)) }, [analyses, ready])
  useEffect(() => {
    const timer = window.setInterval(() => setAnalyses((current) => current.map((item) => {
      if (item.status !== "processing") return item
      const next = Math.min(item.completedSteps + 1, item.steps.length)
      const done = next >= item.steps.length
      return { ...item, status: done ? "completed" : "processing", completedSteps: next, progress: Math.round((next / item.steps.length) * 100), stepStates: item.steps.map((_, index) => index < next ? "completed" : index === next ? "processing" : "pending"), updatedAt: new Date().toISOString() }
    })), 1800)
    return () => window.clearInterval(timer)
  }, [])
  const update = useCallback((id: string, patch: Partial<AnalysisView>) => setAnalyses((current) => current.map((item) => item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item)), [])
  const start = useCallback((id: string) => update(id, { status: "processing", stepStates: defaultSteps.map((_, i) => i === 0 ? "processing" : "pending"), completedSteps: 0, progress: 0 }), [update])
  const archive = useCallback((id: string) => update(id, { archived: true }), [update])
  const duplicate = useCallback((id: string) => setAnalyses((current) => { const source = current.find((item) => item.id === id); if (!source) return current; return [{ ...source, id: `AN-${Date.now().toString().slice(-6)}`, title: `${source.title} · cópia`, status: "queued", progress: 0, completedSteps: 0, stepStates: defaultSteps.map(() => "pending"), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), archived: false }, ...current] }), [])
  return { analyses: analyses.filter((item) => !item.archived), update, start, archive, duplicate, ready }
}
