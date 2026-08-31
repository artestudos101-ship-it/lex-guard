"use client"

import { useMemo, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Check, FileText, ShieldCheck, UploadCloud, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AppShell } from "@/components/shell/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { applyGeminiResult, createRuntimeAnalysis } from "@/services/analysis-runtime"
import { startAnalysisRuntime } from "@/services/analysis-orchestrator"
import { MOCK_POLICIES } from "@/mock/policies"
import { ExternalLink, Globe2 } from "lucide-react"

const steps = ["Documentos", "Política", "Revisão", "Processamento"]
const sampleDocuments = [
  { name: "Edital-PE-112-2025-Beta.pdf", pages: 37, size: "7,2 MB" },
  { name: "Termo-de-Referencia-112-2025.pdf", pages: 18, size: "2,1 MB" },
  { name: "Anexo-Tecnico-112-2025.pdf", pages: 29, size: "4,8 MB" },
]

export function NewAnalysis() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [documents, setDocuments] = useState<typeof sampleDocuments>([])
  const [realFiles, setRealFiles] = useState<File[]>([])
  const [isStarting, setIsStarting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [policyId, setPolicyId] = useState(MOCK_POLICIES[0]?.id ?? "pol_pme")
  const [title, setTitle] = useState("Pregão Eletrônico 112/2026")
  const selectedPolicy = useMemo(() => MOCK_POLICIES.find((policy) => policy.id === policyId) ?? MOCK_POLICIES[0], [policyId])

  function addDocument(document = sampleDocuments[documents.length]) {
    if (!document || documents.length >= 3) return
    setDocuments((current) => [...current, document])
    toast.success("Documento vinculado", { description: document.name })
  }

  function removeDocument(index: number) {
    setDocuments((current) => current.filter((_, i) => i !== index))
    setRealFiles((current) => current.filter((_, i) => i !== index))
  }

  function handleFiles(files: FileList | null) {
    const pdfs = Array.from(files ?? []).filter((file) => file.type === "application/pdf").slice(0, 3 - documents.length)
    if (!pdfs.length) { toast.error("Selecione um PDF válido"); return }
    setRealFiles((current) => [...current, ...pdfs])
    setDocuments((current) => [...current, ...pdfs.map((file) => ({ name: file.name, pages: 0, size: `${(file.size / 1024 / 1024).toFixed(1)} MB` }))])
    toast.success(`${pdfs.length} documento(s) vinculado(s)`)
  }

  async function start() {
    if (title.trim().length < 3) {
      toast.error("Dê um nome à análise", { description: "Use pelo menos 3 caracteres para identificar esta decisão." })
      setStep(0)
      return
    }
    if (!documents.length) {
      toast.error("Adicione um documento antes de iniciar")
      setStep(0)
      return
    }
    setIsStarting(true)
    const analysis = createRuntimeAnalysis({ title, orgao: "Secretaria de Estado da Saúde", policyId: selectedPolicy?.id ?? "pol_pme", policyName: selectedPolicy?.name ?? "Padrão PME", documentNames: documents.map((doc) => doc.name) })
    if (realFiles.length) {
      try {
        const encoded = await Promise.all(realFiles.map(async (file) => ({ name: file.name, mimeType: "application/pdf" as const, data: await fileToBase64(file) })))
        const response = await fetch("/api/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title, policy: selectedPolicy?.name ?? "Padrão PME", documents: encoded }) })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error ?? "Gemini indisponível")
        applyGeminiResult(analysis.id, result)
      } catch (error) { toast.error("Análise Gemini não concluída", { description: error instanceof Error ? error.message : "Verifique a configuração do servidor." }); setIsStarting(false); return }
    }
    startAnalysisRuntime(analysis.id)
    toast.success("Análise iniciada", { description: "O card será atualizado em Minhas análises." })
    router.push("/analyses")
  }

  const canContinue = step === 0 ? documents.length >= 1 : true
  return <AppShell title="Nova análise" description="Configure o contexto antes de iniciar o processamento">
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div><Button variant="ghost" size="sm" onClick={() => router.push("/analyses")}><ArrowLeft data-icon="inline-start" /> Minhas análises</Button><p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Fluxo guiado · {step + 1}/4</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Prepare uma nova decisão</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Os documentos e a política formam o contexto que será carregado na conversa e na decisão.</p></div>
      <div className="grid gap-2 md:grid-cols-4">{steps.map((label, index) => <div key={label} className={`flex items-center gap-2 rounded-md border p-3 text-xs ${index === step ? "border-primary bg-primary/5 text-primary" : index < step ? "border-success/40 bg-success-soft text-success-foreground" : "text-muted-foreground"}`}><span className="flex size-6 items-center justify-center rounded-full border font-mono">{index < step ? <Check className="size-3.5" /> : index + 1}</span>{label}</div>)}</div>
      <Card><CardHeader><CardTitle className="text-base">{steps[step]}</CardTitle><p className="text-sm text-muted-foreground">{step === 0 ? "Carregue de 1 a 3 documentos que farão parte do contexto." : step === 1 ? "Selecione a política que será confrontada com as evidências." : step === 2 ? "Confirme o escopo antes de iniciar. O processo será rastreável na conversa." : "O processamento será executado em jobs e aparecerá no card de Minhas análises."}</p></CardHeader><CardContent className="flex flex-col gap-5">
        {step === 0 ? <>
          <div className="flex flex-col gap-2"><label className="text-xs font-semibold" htmlFor="analysis-title">Nome da análise</label><Input id="analysis-title" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <input ref={fileInputRef} type="file" accept="application/pdf" multiple className="sr-only" onChange={(event) => handleFiles(event.target.files)} />
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/20 text-center"><div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"><UploadCloud /></div><span className="text-sm font-medium">{documents.length >= 3 ? "Limite de 3 documentos atingido" : "Adicionar documento"}</span><span className="text-xs text-muted-foreground">Envie um PDF real para o Gemini ou use um documento demonstrativo para testar o fluxo.</span><div className="flex flex-wrap justify-center gap-2"><Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={documents.length >= 3}>Enviar PDF real</Button><Button type="button" variant="secondary" size="sm" onClick={() => addDocument()} disabled={documents.length >= 3}>Usar demonstrativo</Button></div></div>
          <div className="grid gap-3 md:grid-cols-3">{documents.map((doc, index) => <div key={doc.name} className="rounded-lg border p-3"><div className="flex items-start gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><FileText className="size-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{doc.name}</p><p className="mt-1 text-xs text-muted-foreground">{doc.pages} páginas · {doc.size}</p><Badge className="mt-2" variant="secondary"><Check data-icon="inline-start" /> Válido</Badge></div><Button variant="ghost" size="icon" onClick={() => removeDocument(index)} aria-label={`Remover ${doc.name}`}><X /></Button></div></div>)}</div>
        </> : step === 1 ? <div className="grid gap-3 md:grid-cols-3">{MOCK_POLICIES.map((policy) => <button key={policy.id} type="button" onClick={() => setPolicyId(policy.id)} className={`rounded-xl border p-4 text-left transition-colors ${policy.id === policyId ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/30"}`}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{policy.name}</p><p className="mt-1 text-xs text-muted-foreground">Versão {policy.version}</p></div><ShieldCheck className="size-4 text-primary" /></div><div className="mt-4 grid gap-2 text-xs text-muted-foreground"><span>Prazo: ≥ {policy.rules.minDeadlineDays} dias</span><span>Garantia: ≤ {policy.rules.maxGuaranteePct}%</span><span>Multa: ≤ {policy.rules.maxPenaltyPct}%</span></div>{policy.sources?.length ? <div className="mt-4 border-t pt-3"><p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"><Globe2 className="size-3" /> Fontes jurídicas públicas</p><div className="mt-2 flex flex-col gap-1">{policy.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-left text-[11px] text-primary hover:underline" onClick={(event) => event.stopPropagation()}>{source.label} <ExternalLink className="size-3" /></a>)}</div></div> : null}{policy.id === policyId ? <Badge className="mt-4">Selecionada</Badge> : null}</button>)}</div> : step === 2 ? <div className="space-y-3"><SummaryRow label="Documentos" value={`${documents.length}`} /><SummaryRow label="Política" value={`${selectedPolicy?.name} · ${selectedPolicy?.version}`} /><SummaryRow label="Nome" value={title} /><SummaryRow label="Contexto" value="Documento + evidência + política + decisão" /></div> : <div className="rounded-xl border bg-muted/20 p-5"><p className="text-sm font-semibold">Tudo pronto.</p><p className="mt-1 text-sm text-muted-foreground">Ao iniciar, o serviço mock criará os jobs, atualizará o card e preencherá a conversa progressivamente.</p></div>}
        <div className="flex items-center justify-between border-t pt-5"><Button variant="ghost" onClick={() => step === 0 ? router.push("/analyses") : setStep((current) => current - 1)}>Voltar</Button>{step < 3 ? <Button disabled={!canContinue} onClick={() => setStep((current) => current + 1)}>Continuar <ArrowRight data-icon="inline-end" /></Button> : <Button onClick={start} disabled={isStarting}>{isStarting ? "Processando documento..." : "Iniciar análise"} <ArrowRight data-icon="inline-end" /></Button>}</div>
      </CardContent></Card>
    </div>
  </AppShell>
}
async function fileToBase64(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer())
  let binary = ""
  const chunkSize = 0x8000
  for (let index = 0; index < bytes.length; index += chunkSize) binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  return btoa(binary)
}

function SummaryRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between rounded-lg border p-4"><span className="text-xs text-muted-foreground">{label}</span><span className="text-sm font-medium">{value}</span></div> }
