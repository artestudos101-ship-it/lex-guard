"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, ChevronRight, Eye, FileText, Filter, Layers3, Package, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Search, ShieldCheck, SlidersHorizontal } from "lucide-react"
import { AppShell } from "@/components/shell/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalysisConversation } from "./analysis-conversation"
import { DecisionContext } from "./decision-context"
import { getRuntimeAnalysis, hydrateRuntime, subscribeRuntime } from "@/services/analysis-runtime"
import { MOCK_ANALYSES } from "@/mock/analyses"
import { runtimeFromMock } from "../analysis-data"
import type { AnalysisBlock } from "@/types/analysis-block"
import type { RuntimeAnalysis } from "@/types/analysis-runtime"

const filterOptions = ["Todos", "Evidências", "Riscos", "Políticas", "Decisão"] as const
const modes = ["Documento", "Processo", "Decisão"] as const

export function AnalysisWorkspace({ analysisId }: { analysisId: string }) {
  const [runtimeVersion, setRuntimeVersion] = useState(0)
  const [focus, setFocus] = useState<(typeof modes)[number]>("Processo")
  const [filter, setFilter] = useState<(typeof filterOptions)[number]>("Todos")
  const [page, setPage] = useState(37)
  const [highlight, setHighlight] = useState<string | null>(null)
  const [showDocument, setShowDocument] = useState(true)
  const [showDecision, setShowDecision] = useState(false)
  useEffect(() => { hydrateRuntime(); const unsubscribe = subscribeRuntime(() => setRuntimeVersion((v) => v + 1)); return () => { unsubscribe() } }, [])
  const analysis: RuntimeAnalysis | null = useMemo(() => getRuntimeAnalysis(analysisId) ?? (() => { const found = MOCK_ANALYSES.find((item) => item.id === analysisId); return found ? runtimeFromMock(found) : null })(), [analysisId, runtimeVersion])

  useEffect(() => { if (analysis?.status === "completed") setShowDecision(true) }, [analysis?.status])

  if (!analysis) return <AppShell title="Análise" description="Análise não encontrada"><div className="mx-auto max-w-3xl p-6"><Card><CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 text-center"><h2 className="text-lg font-semibold">Análise não encontrada</h2><p className="text-sm text-muted-foreground">O identificador não corresponde a uma análise disponível.</p><Button render={<Link href="/analyses" />}>Voltar para minhas análises</Button></CardContent></Card></div></AppShell>

  const docPages = analysis.documentNames.map((name, index) => ({ name, pages: index === 0 ? 42 : index === 1 ? 37 : 29 }))
  const activeFinding = highlight ?? "Garantia contratual elevada"
  return <AppShell title="Analysis Workspace" description={`${analysis.id} · processo observável`}>
    <div className="flex h-[calc(100vh-7rem)] min-h-[680px] flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="flex flex-wrap items-center gap-3 border-b px-4 py-3"><Button variant="ghost" size="sm" render={<Link href="/analyses" />}><ArrowLeft data-icon="inline-start" /> Minhas análises</Button><Separator orientation="vertical" className="hidden h-6 sm:block" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{analysis.title}</p><p className="truncate text-xs text-muted-foreground">{analysis.orgao} · {analysis.id}</p></div><Badge variant="secondary">{analysis.status === "completed" ? "Concluída" : "Em análise"}</Badge><Button variant="outline" size="sm"><ShieldCheck data-icon="inline-start" /> {analysis.policyName}</Button><div className="ml-auto flex items-center gap-1">{!showDocument ? <Button variant="ghost" size="icon" onClick={() => setShowDocument(true)} aria-label="Mostrar documento"><PanelLeftOpen /></Button> : null}{analysis.status === "completed" && !showDecision ? <Button variant="ghost" size="icon" onClick={() => setShowDecision(true)} aria-label="Mostrar decisão"><PanelRightOpen /></Button> : null}</div><Button variant="outline" size="icon" aria-label="Gerar pacote"><Package /></Button></header>
      <div className="border-b px-4 py-2"><div className="flex flex-wrap items-center justify-between gap-3"><Tabs value={focus} onValueChange={(v) => setFocus(v as typeof focus)}><TabsList>{modes.map((mode) => <TabsTrigger key={mode} value={mode}>{mode}</TabsTrigger>)}</TabsList></Tabs><div className="flex flex-wrap items-center gap-2">{filterOptions.map((option) => <Button key={option} size="sm" variant={filter === option ? "secondary" : "ghost"} onClick={() => setFilter(option)}>{option}</Button>)}</div></div></div>
      <div className={`grid min-h-0 flex-1 ${showDocument && showDecision ? "lg:grid-cols-[1.1fr_1fr_.65fr]" : showDocument ? "lg:grid-cols-[1.1fr_1fr]" : showDecision ? "lg:grid-cols-[1fr_.7fr]" : "lg:grid-cols-1"}`}>
        <section className={`min-h-0 border-b lg:border-b-0 lg:border-r ${showDocument ? "" : "hidden"}`}><div className="flex items-center gap-3 border-b p-3"><BookOpen className="size-4 text-primary" /><div className="flex-1"><p className="text-sm font-semibold">Documento</p><p className="text-[10px] text-muted-foreground">PDF + evidências sincronizadas</p></div><Button variant="ghost" size="icon" onClick={() => setShowDocument(false)} aria-label="Ocultar documento"><PanelLeftClose /></Button><Button variant="ghost" size="icon"><Search /></Button></div><ScrollArea className="h-full"><div className="p-4"><div className="mb-3 flex flex-wrap gap-2">{docPages.map((doc) => <Badge key={doc.name} variant="outline">{doc.name} · {doc.pages}p</Badge>)}</div><div className="rounded-xl border bg-[#f5f6f8] p-4 text-slate-900 dark:bg-[#1b2330] dark:text-slate-100"><div className="flex items-center justify-between border-b pb-3 text-[10px] text-muted-foreground"><span>Página {page}</span><span>Zoom 100%</span></div><div className="mx-auto mt-5 min-h-[520px] max-w-2xl rounded-lg bg-background p-6 shadow-sm"><p className="font-serif text-xs uppercase tracking-wide text-muted-foreground">Cláusula 14.2 · Garantia de execução</p><p className={`mt-5 rounded-md p-3 text-sm leading-7 ${activeFinding ? "bg-critical/10 ring-1 ring-critical/30" : ""}`}><strong>A CONTRATADA prestará garantia correspondente a 5% (cinco por cento) do valor total do contrato.</strong> A garantia deverá ser apresentada no prazo previsto neste edital.</p><p className="mt-5 text-sm leading-7 text-muted-foreground">O percentual encontrado excede o limite de 3% definido na política Padrão PME e foi classificado como ponto de atenção para revisão.</p><div className="mt-8 flex items-center gap-2 text-[10px] text-muted-foreground"><span className="rounded bg-critical/15 px-2 py-1 text-critical">E2 · Evidência parcial</span><span>Finding {highlight ? "selecionado" : ""}</span></div></div></div></div></ScrollArea></section>
        <section className="min-h-0 border-b lg:border-b-0 lg:border-r"><div className="flex items-center gap-3 border-b p-3"><Layers3 className="size-4 text-primary" /><div className="flex-1"><p className="text-sm font-semibold">Processo / Conversa</p><p className="text-[10px] text-muted-foreground">Somente eventos observáveis</p></div><Badge variant="outline">{analysis.blocks.length} etapas</Badge></div><ScrollArea className="h-full"><div className="p-4"><AnalysisConversation blocks={analysis.blocks} filter={filter} onNavigateToEvidence={(block) => { setHighlight(block.title); setPage(block.type === "evidence" || block.type === "risk" ? 37 : page); }} /></div></ScrollArea></section>
        <aside className={`min-h-0 bg-muted/10 ${showDecision ? "" : "hidden"}`}><ScrollArea className="h-full"><div className="p-4"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold">Decisão</p><Button variant="ghost" size="icon" onClick={() => setShowDecision(false)} aria-label="Ocultar decisão"><PanelRightClose /></Button></div><DecisionContext analysis={analysis} /><Card className="mt-4"><CardHeader><CardTitle className="text-sm">Contexto vinculado</CardTitle></CardHeader><CardContent className="space-y-3 text-xs text-muted-foreground"><div className="flex items-center justify-between"><span>Documentos</span><span className="font-medium text-foreground">{analysis.documentNames.length}</span></div><div className="flex items-center justify-between"><span>Regras</span><span className="font-medium text-foreground">3</span></div><div className="flex items-center justify-between"><span>Versão da política</span><span className="font-medium text-foreground">v3.2</span></div><Separator /><p>Configuração controlada pelo administrador. Alterações no conjunto de documentos e regras não fazem parte da análise em execução.</p></CardContent></Card></div></ScrollArea></aside>
      </div>
    </div>
  </AppShell>
}
