import type { Job, JobEvent, JobStep } from "@/types"

const STEP_DEFS: { key: string; label: string; event: JobEvent["type"] }[] = [
  { key: "queued", label: "Documento na fila", event: "JOB_CREATED" },
  { key: "extraction", label: "Extração de texto (OCR)", event: "EXTRACTION_COMPLETED" },
  { key: "sections", label: "Detecção de seções e cláusulas", event: "SECTION_DETECTED" },
  { key: "llm", label: "Análise semântica dos riscos", event: "LLM_COMPLETED" },
  { key: "evidence", label: "Validação de evidências", event: "EVIDENCE_VALIDATED" },
  { key: "rules", label: "Aplicação da política de risco", event: "RULES_APPLIED" },
  { key: "decision", label: "Consolidação da decisão", event: "DECISION_READY" },
]

export function buildInitialJob(documentId: string, documentName: string): Job {
  return {
    id: `job_${documentId}`,
    documentId,
    documentName,
    progress: 0,
    currentStep: STEP_DEFS[0].label,
    status: "queued",
    steps: STEP_DEFS.map((s, i) => ({
      key: s.key,
      label: s.label,
      status: i === 0 ? "active" : "pending",
    })),
  }
}

export interface JobSimulationHandle {
  cancel: () => void
}

/**
 * Simulates a streaming analysis job. Emits granular events and step/progress
 * updates through callbacks — the caller decides how to store them (we never
 * hold the full stream in a global store).
 */
export function simulateJob(
  documentId: string,
  documentName: string,
  handlers: {
    onEvent: (event: JobEvent) => void
    onUpdate: (job: Job) => void
    onComplete: () => void
  },
  options?: { stepMs?: number },
): JobSimulationHandle {
  const stepMs = options?.stepMs ?? 900
  let index = 0
  let cancelled = false
  const steps: JobStep[] = STEP_DEFS.map((s, i) => ({
    key: s.key,
    label: s.label,
    status: i === 0 ? "active" : "pending",
  }))

  handlers.onEvent({
    type: "JOB_CREATED",
    jobId: `job_${documentId}`,
    documentId,
    progress: 0,
    message: `Job criado para ${documentName}.`,
    at: new Date().toISOString(),
  })

  const timer = setInterval(() => {
    if (cancelled) return
    const def = STEP_DEFS[index]
    steps[index] = { ...steps[index], status: "done" }
    const isLast = index === STEP_DEFS.length - 1
    if (!isLast) steps[index + 1] = { ...steps[index + 1], status: "active" }

    const progress = Math.round(((index + 1) / STEP_DEFS.length) * 100)

    handlers.onEvent({
      type: def.event,
      jobId: `job_${documentId}`,
      documentId,
      progress,
      message: stepMessage(def.key, documentName),
      at: new Date().toISOString(),
    })

    handlers.onUpdate({
      id: `job_${documentId}`,
      documentId,
      documentName,
      progress,
      currentStep: isLast ? "Concluído" : STEP_DEFS[index + 1].label,
      status: isLast ? "completed" : "processing",
      steps: steps.map((s) => ({ ...s })),
    })

    index += 1
    if (index >= STEP_DEFS.length) {
      clearInterval(timer)
      handlers.onComplete()
    }
  }, stepMs)

  return {
    cancel: () => {
      cancelled = true
      clearInterval(timer)
    },
  }
}

function stepMessage(key: string, name: string): string {
  switch (key) {
    case "queued":
      return `${name} entrou na fila de processamento.`
    case "extraction":
      return "Texto extraído com sucesso. 0 falhas de OCR."
    case "sections":
      return "14 seções e 96 cláusulas mapeadas."
    case "llm":
      return "Riscos candidatos identificados e classificados."
    case "evidence":
      return "Cada risco vinculado à sua cláusula e página de origem."
    case "rules":
      return "Cláusulas confrontadas com os limites da política."
    case "decision":
      return "Recomendação e score de risco consolidados."
    default:
      return "Processando…"
  }
}
