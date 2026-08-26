"use client"

import type { AnalysisBlock } from "@/types/analysis-block"
import type { RuntimeAnalysis } from "@/types/analysis-runtime"
import { simulateJob, type JobSimulationHandle } from "@/services/job-service"
import { appendRuntimeBlock, updateRuntimeAnalysis, updateRuntimeJobs, getRuntimeAnalysis } from "@/services/analysis-runtime"
import type { Job, JobEvent } from "@/types/job"

const STEP_ORDER = ["document", "extraction", "section", "variable", "evidence", "policy", "risk", "decision", "consolidation"] as const

const ICONS: Record<string, AnalysisBlock["iconName"]> = {
  document: "FileInput",
  extraction: "FileText",
  section: "ScanSearch",
  variable: "Braces",
  evidence: "Quote",
  policy: "ShieldCheck",
  risk: "TriangleAlert",
  decision: "Scale",
  consolidation: "CheckCircle2",
}

function now() { return new Date().toISOString() }

function baseBlock(id: string, type: AnalysisBlock["type"], title: string, description: string, status: AnalysisBlock["status"]): AnalysisBlock {
  return { id, type, step: STEP_ORDER.indexOf(type) + 1, title, iconName: ICONS[type], status, timestamp: now(), description, actions: [] }
}

function buildBlocks(analysis: RuntimeAnalysis, event: JobEvent): AnalysisBlock[] {
  const blocks = analysis.blocks.map((block) => ({ ...block }))
  const set = (block: AnalysisBlock) => {
    const index = blocks.findIndex((item) => item.id === block.id)
    if (index >= 0) blocks[index] = block
    else blocks.push(block)
  }
  const completeBefore = (step: number) => blocks.forEach((block, index) => {
    if (index < step && block.status !== "error") blocks[index] = { ...block, status: "completed" }
  })

  switch (event.type) {
    case "JOB_CREATED": {
      set({ ...baseBlock("analysis:document", "document", "Documento recebido", `${analysis.documentNames.length} documento(s) foram recebidos e preparados para análise.`, "completed"), step: 1, documents: analysis.documentNames.map((label, i) => ({ id: `doc-${i}`, label, kind: "document" })), actions: ["document"] })
      break
    }
    case "EXTRACTION_COMPLETED": {
      completeBefore(2)
      set({ ...baseBlock("analysis:extraction", "extraction", "Extração documental", "Texto extraído e normalizado para análise estruturada.", "completed"), step: 2, metadata: { "Páginas processadas": "42", "Texto encontrado": "96%", "Método": "PDF nativo" } })
      break
    }
    case "SECTION_DETECTED": {
      completeBefore(3)
      set({ ...baseBlock("analysis:section", "section", "Seções relevantes encontradas", "Seções de habilitação, prazos, garantias, penalidades, pagamento e reajuste foram localizadas.", "completed"), step: 3, metadata: { Seções: "14", Cláusulas: "96" }, actions: ["document"] })
      break
    }
    case "LLM_COMPLETED": {
      completeBefore(4)
      set({ ...baseBlock("analysis:variable", "variable", "Variáveis críticas identificadas", "Variáveis estruturadas foram extraídas das cláusulas relevantes.", "completed"), step: 4, metadata: { Prazo: "8 dias úteis", Garantia: "5%", Multa: "8%", Valor: "R$ 3,2M" } })
      break
    }
    case "EVIDENCE_VALIDATED": {
      completeBefore(5)
      set({ ...baseBlock("analysis:evidence", "evidence", "Evidências encontradas", "Achados foram vinculados à página e cláusula de origem.", "completed"), step: 5, evidences: [
        { id: "evidence:guarantee", label: "Garantia contratual · p. 37 · cláusula 14.2", kind: "evidence" },
        { id: "evidence:deadline", label: "Prazo de proposta · p. 11 · cláusula 5.1", kind: "evidence" },
        { id: "evidence:fine", label: "Multa moratória · p. 38 · cláusula 15.1", kind: "evidence" },
      ], actions: ["evidence", "document"] })
      break
    }
    case "RULES_APPLIED": {
      completeBefore(6)
      set({ ...baseBlock("analysis:policy", "policy", "Política da empresa aplicada", `Política ${analysis.policyName} confrontada com as evidências encontradas.`, "completed"), step: 6, policy: { id: "policy:pme", label: analysis.policyName, kind: "policy" }, rules: [
        { id: "rule:R-001", label: "R-001 · Prazo mínimo", kind: "rule" },
        { id: "rule:R-004", label: "R-004 · Garantia máxima", kind: "rule" },
        { id: "rule:R-007", label: "R-007 · Multa máxima", kind: "rule" },
      ] })
      set({ ...baseBlock("analysis:risk", "risk", "Risco identificado", "Garantia acima do limite da política e prazo abaixo do mínimo foram sinalizados para revisão.", "warning"), step: 7, metadata: { Impacto: "Alto", Conflitos: "2", Evidência: "Página 37" }, actions: ["evidence", "policy"] })
      break
    }
    case "DECISION_READY": {
      completeBefore(8)
      set({ ...baseBlock("analysis:decision", "decision", "Recomendação preliminar", "A evidência disponível sustenta uma recomendação para revisão humana antes da decisão final.", "completed"), step: 8, metadata: { Recomendação: "REVISAR", "Risk Score": "54/100", Motivos: "2 conflitos · 1 evidência parcial" }, actions: ["decision"] })
      set({ ...baseBlock("analysis:consolidation", "consolidation", "Decisão consolidada", "REVISAR — validação humana recomendada antes da decisão final.", "completed"), step: 9, metadata: { "Principais fatores": "Garantia acima do limite · Prazo abaixo do mínimo · Multa dentro do limite" }, actions: ["decision"] })
      break
    }
  }
  return blocks.sort((a, b) => a.step - b.step)
}

export function startAnalysisRuntime(analysisId: string): JobSimulationHandle[] {
  const analysis = getRuntimeAnalysis(analysisId)
  if (!analysis) return []
  const handles: JobSimulationHandle[] = []
  const jobs: Job[] = analysis.documentNames.map((documentName, index) => ({ id: `job_${analysisId}_${index}`, documentId: `${analysisId}:doc:${index}`, documentName, progress: 0, currentStep: "Documento na fila", status: "queued", steps: [] }))
  updateRuntimeAnalysis(analysisId, { status: "processing", progress: 0, currentStep: "Documento recebido", jobs })
  let completedDocuments = 0
  let latestJobs = jobs

  analysis.documentNames.forEach((documentName, index) => {
    const documentId = `${analysisId}:doc:${index}`
    const handle = simulateJob(documentId, documentName, {
      onEvent(event) {
        const current = getRuntimeAnalysis(analysisId)
        if (!current) return
        const blocks = buildBlocks(current, event)
        const progressPerDoc = event.progress ?? 0
        const totalProgress = Math.round(((completedDocuments * 100) + progressPerDoc) / analysis.documentNames.length)
        const currentStep = blocks.find((block) => block.status === "warning" || block.status === "active")?.title ?? blocks.at(-1)?.title ?? "Processando"
        updateRuntimeAnalysis(analysisId, {
          progress: totalProgress,
          currentStep,
          evidenceCount: event.type === "EVIDENCE_VALIDATED" ? 3 : current.evidenceCount,
          conflictCount: event.type === "RULES_APPLIED" ? 2 : current.conflictCount,
          riskScore: event.type === "DECISION_READY" ? 54 : current.riskScore,
          recommendation: event.type === "DECISION_READY" ? "REVIEW" : current.recommendation,
          blocks,
        })
        const currentEvents = [...(current.events ?? []), event]
        updateRuntimeAnalysis(analysisId, { events: currentEvents })
      },
      onUpdate(job) {
        latestJobs = latestJobs.map((item) => item.id === job.id ? job : item)
        updateRuntimeJobs(analysisId, latestJobs)
      },
      onComplete() {
        completedDocuments += 1
        if (completedDocuments === analysis.documentNames.length) {
          updateRuntimeAnalysis(analysisId, { progress: 100, currentStep: "Decisão consolidada", status: "completed", riskScore: 54, recommendation: "REVIEW", evidenceCount: 3, conflictCount: 2 })
        }
      },
    }, { stepMs: 850 + index * 150 })
    handles.push(handle)
  })
  return handles
}
