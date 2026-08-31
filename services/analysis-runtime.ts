"use client"

import type { AnalysisBlock } from "@/types/analysis-block"
import type { RuntimeAnalysis } from "@/types/analysis-runtime"
import type { AnalysisStatus, AnalysisSummary } from "@/types/analysis"
import type { Job } from "@/types/job"

const STORAGE_KEY = "lexguard:analysis-runtime:v2"
const listeners = new Set<() => void>()
const memory = new Map<string, RuntimeAnalysis>()

function emit() {
  listeners.forEach((listener) => listener())
}

function seedFromStorage() {
  if (typeof window === "undefined") return
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as RuntimeAnalysis[]
    parsed.forEach((analysis) => memory.set(analysis.id, analysis))
  } catch {
    // Ignore invalid local state; demo data remains usable.
  }
}

function persist() {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...memory.values()]))
}

if (typeof window !== "undefined") seedFromStorage()

export function subscribeRuntime(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getRuntimeAnalysis(id: string) {
  return memory.get(id)
}

export function listRuntimeAnalyses(): RuntimeAnalysis[] {
  return [...memory.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function createRuntimeAnalysis(input: {
  title: string
  orgao: string
  policyId: string
  policyName: string
  documentNames: string[]
  responsible?: string
}): RuntimeAnalysis {
  const now = new Date().toISOString()
  const id = `an_${Date.now()}`
  const analysis: RuntimeAnalysis = {
    id,
    title: input.title,
    orgao: input.orgao,
    valueBRL: 0,
    recommendation: "REVIEW",
    riskScore: 0,
    evidenceQuality: "Média",
    status: "queued",
    updatedAt: now,
    policyName: input.policyName,
    documentNames: input.documentNames,
    responsible: input.responsible ?? "Marina Costa",
    progress: 0,
    currentStep: "Documento recebido",
    evidenceCount: 0,
    conflictCount: 0,
    blocks: [],
    events: [],
    jobs: [],
    summary: "Aguardando o resultado da análise.",
    llmSource: "demo",
    evidences: [],
    conflicts: [],
    chatMessages: [],
  }
  memory.set(id, analysis)
  persist()
  emit()
  return analysis
}

export function applyGeminiResult(id: string, result: {
  recommendation: "APPROVE" | "REVIEW" | "REJECT"
  riskScore: number
  evidenceQuality: "Alta" | "Média" | "Baixa"
  summary: string
  evidence: Array<{ label: string; page: number | null; excerpt: string }>
  conflicts: Array<{ title: string; description: string; severity: "high" | "medium" | "low" }>
}) {
  const current = memory.get(id)
  if (!current) return
  updateRuntimeAnalysis(id, {
    recommendation: result.recommendation,
    riskScore: result.riskScore,
    evidenceQuality: result.evidenceQuality,
    summary: result.summary,
    llmSource: "gemini",
    evidenceCount: result.evidence.length,
    conflictCount: result.conflicts.length,
    evidences: result.evidence.map((item, index) => ({ ...item, id: `gemini:evidence:${index}` })),
    conflicts: result.conflicts.map((item, index) => ({ ...item, id: `gemini:conflict:${index}` })),
  })
}

export function updateRuntimeAnalysis(id: string, patch: Partial<RuntimeAnalysis>) {
  const current = memory.get(id)
  if (!current) return
  memory.set(id, { ...current, ...patch, updatedAt: new Date().toISOString() })
  persist()
  emit()
}

export function updateRuntimeJobs(id: string, jobs: Job[]) {
  updateRuntimeAnalysis(id, { jobs })
}

export function appendRuntimeBlock(id: string, block: AnalysisBlock) {
  const current = memory.get(id)
  if (!current) return
  const blocks = current.blocks.some((item) => item.id === block.id)
    ? current.blocks.map((item) => item.id === block.id ? block : item)
    : [...current.blocks, block]
  updateRuntimeAnalysis(id, { blocks })
}

export function getAnalysisStatus(id: string): AnalysisStatus | undefined {
  return memory.get(id)?.status
}

export function hydrateRuntime() {
  seedFromStorage()
  return listRuntimeAnalyses()
}

export function toSummary(runtime: RuntimeAnalysis): AnalysisSummary {
  return {
    id: runtime.id,
    title: runtime.title,
    orgao: runtime.orgao,
    valueBRL: runtime.valueBRL,
    recommendation: runtime.recommendation,
    riskScore: runtime.riskScore,
    evidenceQuality: runtime.evidenceQuality,
    status: runtime.status,
    updatedAt: runtime.updatedAt,
  }
}
