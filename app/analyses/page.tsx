"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, FileText, MessageSquare, Plus, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { AppShell } from "@/components/shell/app-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AnalysisCard } from "@/features/analyses/components/analysis-card"
import { AnalysisFilters, defaultAnalysisFilters, type AnalysisFilterState } from "@/features/analyses/components/analysis-filters"
import { AnalysisChat } from "@/features/analyses/components/analysis-chat"
import { DecisionContext } from "@/features/analyses/components/decision-context"
import { AnalysisSearch } from "@/features/analyses/components/analysis-search"
import { runtimeFromMock } from "@/features/analyses/analysis-data"
import { getRuntimeAnalysis, hydrateRuntime, listRuntimeAnalyses, subscribeRuntime } from "@/services/analysis-runtime"
import { startAnalysisRuntime } from "@/services/analysis-orchestrator"
import { MOCK_ANALYSES } from "@/mock/analyses"
import type { RuntimeAnalysis } from "@/types/analysis-runtime"

function loadAnalyses() {
  hydrateRuntime()
  const mocks = MOCK_ANALYSES.map(runtimeFromMock)
  const dynamic = listRuntimeAnalyses()
  const merged = new Map<string, RuntimeAnalysis>()
  mocks.forEach((item) => merged.set(item.id, item))
  dynamic.forEach((item) => merged.set(item.id, item))
  return [...merged.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export default function AnalysesPage() {
  const [analyses, setAnalyses] = useState<RuntimeAnalysis[]>(loadAnalyses)
  const [selectedId, setSelectedId] = useState<string>(analyses[0]?.id ?? "")
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<AnalysisFilterState>(defaultAnalysisFilters)
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [conversationsOpen, setConversationsOpen] = useState(true)
  const [contextOpen, setContextOpen] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const initial: AnalysisFilterState = {
      statuses: params.get("status")?.split(",").filter(Boolean) ?? [],
      recommendations: params.get("recommendation")?.split(",").filter(Boolean) ?? [],
      responsible: params.get("responsible") ?? "",
      team: params.get("team") ?? "",
    }
    setFilters(initial)
    const requestedAnalysis = params.get("analysis")
    if (requestedAnalysis) setSelectedId(requestedAnalysis)
    setAnalyses(loadAnalyses())
    const unsubscribe = subscribeRuntime(() => setAnalyses(loadAnalyses()))
    return () => { unsubscribe() }
  }, [])

  useEffect(() => {
    if (!analyses.some((item) => item.id === selectedId)) setSelectedId(analyses[0]?.id ?? "")
  }, [analyses, selectedId])

  function applyFilters(next: AnalysisFilterState) {
    setFilters(next)
    const params = new URLSearchParams()
    if (next.statuses.length) params.set("status", next.statuses.join(","))
    if (next.recommendations.length) params.set("recommendation", next.recommendations.join(","))
    if (next.responsible) params.set("responsible", next.responsible)
    if (next.team) params.set("team", next.team)
    window.history.replaceState(null, "", params.toString() ? `/analyses?${params.toString()}` : "/analyses")
  }

  const visible = useMemo(() => analyses.filter((analysis) => {
    if (hidden.has(analysis.id)) return false
    const normalized = query.toLocaleLowerCase("pt-BR").trim()
    const matchesQuery = !normalized || `${analysis.title} ${analysis.orgao} ${analysis.id} ${analysis.policyName} ${analysis.responsible} ${analysis.documentNames.join(" ")}`.toLocaleLowerCase("pt-BR").includes(normalized)
    const matchesStatus = !filters.statuses.length || filters.statuses.includes(analysis.status)
    const matchesRec = !filters.recommendations.length || filters.recommendations.includes(analysis.recommendation)
    const matchesResponsible = !filters.responsible || analysis.responsible === filters.responsible
    return matchesQuery && matchesStatus && matchesRec && matchesResponsible
  }), [analyses, filters, hidden, query])

  const selected = visible.find((item) => item.id === selectedId) ?? visible[0]

  function handleStart(id: string) {
    startAnalysisRuntime(id)
    toast.success("Análise iniciada", { description: "O progresso aparecerá no card e na conversa." })
  }

  function handleAction(action: "assign" | "share" | "archive" | "delete" | "package", analysis: RuntimeAnalysis) {
    if (action === "archive" || action === "delete") {
      setHidden((current) => new Set(current).add(analysis.id))
      toast.success(action === "archive" ? "Análise arquivada" : "Análise excluída")
      return
    }
    if (action === "share") {
      navigator.clipboard?.writeText(`${window.location.origin}/analyses/${analysis.id}`).then(() => toast.success("Link copiado"))
      return
    }
    if (action === "package") {
      const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${analysis.id}-pacote-de-decisao.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Pacote gerado")
      return
    }
    toast.success("Responsável atualizado", { description: `${analysis.responsible} permanece como responsável. A integração com usuários reais ficará no backend.` })
  }

  return <AppShell title="Minhas análises" action={<Button size="sm" render={<Link href="/analyses/new" />}><Plus data-icon="inline-start" /> Nova análise</Button>}>
    <div className="mx-auto flex max-w-[1550px] flex-col gap-5">
      <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Workspace central</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Minhas análises</h2></div>
      <div className={`grid min-h-[32rem] overflow-hidden rounded-xl md:h-[calc(100vh-12.5rem)] md:min-h-0 border bg-card shadow-sm transition-[grid-template-columns] duration-300 ease-in-out ${conversationsOpen && contextOpen ? "lg:grid-cols-[56px_minmax(0,1fr)_56px] xl:grid-cols-[300px_minmax(0,1fr)_300px]" : conversationsOpen ? "lg:grid-cols-[56px_minmax(0,1fr)_56px] xl:grid-cols-[300px_minmax(0,1fr)_56px]" : contextOpen ? "lg:grid-cols-[56px_minmax(0,1fr)_56px] xl:grid-cols-[56px_minmax(0,1fr)_300px]" : "lg:grid-cols-[56px_minmax(0,1fr)_56px]"}`}>
        {conversationsOpen ? <aside className="flex min-h-0 flex-col overflow-hidden border-b transition-[width,opacity] duration-300 ease-in-out lg:border-b-0 lg:border-r"><div className="border-b p-3"><div className="flex items-center gap-2"><div className="min-w-0 flex-1 lg:max-xl:hidden"><p className="text-sm font-semibold">Conversas</p><p className="text-xs text-muted-foreground">{visible.length} análises visíveis</p></div><Sparkles className="size-4 text-primary" /><Button variant="ghost" size="icon-sm" aria-label="Recolher conversas" onClick={() => setConversationsOpen(false)}><ChevronLeft /></Button></div><div className="mt-3 lg:max-xl:hidden"><AnalysisSearch analyses={analyses} value={query} onValueChange={setQuery} /></div></div><ScrollArea className="min-h-0 flex-1 lg:max-xl:hidden"><div className="flex flex-col gap-1 p-2">{visible.map((analysis) => <button key={analysis.id} type="button" onClick={() => setSelectedId(analysis.id)} className={`rounded-lg p-3 text-left transition-colors ${analysis.id === selected?.id ? "bg-primary/10" : "hover:bg-muted/50"}`}><div className="flex items-start gap-3"><div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-primary"><MessageSquare className="size-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{analysis.title}</p><p className="mt-1 truncate text-xs text-muted-foreground">{analysis.orgao}</p><div className="mt-2 flex gap-2"><Badge variant="outline" className="text-[10px]">{analysis.status === "processing" ? `${analysis.progress}%` : analysis.status === "completed" ? "Concluída" : "Na fila"}</Badge><span className="font-mono text-[10px] text-muted-foreground">{analysis.id}</span></div></div></div></button>)}</div></ScrollArea></aside> : <div className="flex min-h-0 items-start justify-center border-b p-2 lg:border-b-0 lg:border-r"><Button variant="ghost" size="icon" aria-label="Abrir conversas" onClick={() => setConversationsOpen(true)}><MessageSquare /></Button></div>}
        <main className="min-w-0 min-h-0 overflow-hidden"><div className="flex h-full min-h-0 flex-col"><div className="flex shrink-0 items-center justify-between gap-3 border-b p-3"><div><p className="text-sm font-semibold">Conversa</p><p className="text-xs text-muted-foreground">Chat direto sobre a análise selecionada</p></div><AnalysisFilters value={filters} onChange={applyFilters} /></div>{selected ? <AnalysisChat analysis={selected} /> : <div className="flex min-h-0 flex-1 items-center justify-center p-6"><Card><CardContent className="flex min-h-72 flex-col items-center justify-center gap-3 text-center"><FileText className="size-8 text-muted-foreground" /><CardTitle>Nenhuma análise encontrada</CardTitle><p className="max-w-md text-sm text-muted-foreground">Ajuste a busca/filtros ou inicie uma nova análise.</p><Button render={<Link href="/analyses/new" />}><Plus data-icon="inline-start" /> Nova análise</Button></CardContent></Card></div>}</div></main>
        {contextOpen ? <aside className="flex min-h-0 flex-col overflow-hidden border-t bg-muted/10 transition-[width,opacity] duration-300 ease-in-out lg:border-l lg:border-t-0"><div className="flex items-center gap-2 border-b p-3"><FileText className="size-4 shrink-0 text-primary" /><div className="min-w-0 flex-1 lg:max-xl:hidden"><p className="text-sm font-semibold">Contexto</p><p className="text-xs text-muted-foreground">Resumo da decisão</p></div><Button variant="ghost" size="icon-sm" aria-label="Recolher contexto" onClick={() => setContextOpen(false)}><ChevronRight /></Button></div><ScrollArea className="min-h-0 flex-1 lg:max-xl:hidden"><div className="p-3">{selected ? <DecisionContext analysis={selected} /> : null}</div></ScrollArea></aside> : <div className="flex min-h-0 items-start justify-center border-t p-2 lg:border-l lg:border-t-0"><Button variant="ghost" size="icon" aria-label="Abrir contexto" onClick={() => setContextOpen(true)}><FileText /></Button></div>}
      </div>
    </div>
  </AppShell>
}

export const dynamic = "force-dynamic"
