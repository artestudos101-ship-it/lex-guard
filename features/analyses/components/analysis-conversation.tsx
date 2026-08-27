"use client"

import { useMemo, useState } from "react"
import { ArrowRight, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ANALYSIS_STEP_ICONS } from "./analysis-icons"
import type { AnalysisBlock } from "@/types/analysis-block"

export function AnalysisConversation({ blocks, onNavigateToEvidence, filter = "Todos" }: { blocks: AnalysisBlock[]; onNavigateToEvidence?: (block: AnalysisBlock) => void; filter?: "Todos" | "Evidências" | "Riscos" | "Políticas" | "Decisão" }) {
  const [expanded, setExpanded] = useState<string | null>(() => blocks.find((block) => block.status === "active")?.id ?? blocks[0]?.id ?? null)
  const filtered = useMemo(() => blocks.filter((block) => {
    if (filter === "Todos") return true
    if (filter === "Evidências") return block.type === "evidence"
    if (filter === "Riscos") return block.type === "risk"
    if (filter === "Políticas") return block.type === "policy"
    if (filter === "Decisão") return block.type === "decision" || block.type === "consolidation"
    return true
  }), [blocks, filter])
  return <div className="flex flex-col gap-3">
    {filtered.map((block, index) => {
      const Icon = ANALYSIS_STEP_ICONS[block.iconName]
      const open = expanded === block.id
      return <div key={block.id} className="relative flex gap-3">
        <div className="flex w-7 shrink-0 flex-col items-center"><div className={cn("flex size-7 items-center justify-center rounded-full border", block.status === "completed" ? "border-success/40 bg-success-soft text-success-foreground" : block.status === "active" ? "border-primary/40 bg-primary/10 text-primary" : block.status === "warning" ? "border-warning/40 bg-warning-soft text-warning-foreground" : "border-border bg-muted text-muted-foreground")}><Icon className="size-3.5" /></div>{index < filtered.length - 1 ? <div className="mt-2 h-full min-h-5 w-px bg-border" /> : null}</div>
        <div className={cn("min-w-0 flex-1 rounded-xl border bg-card transition-colors", open ? "border-primary/30 shadow-sm" : "hover:border-border/80")}>
          <button type="button" className="flex w-full items-start gap-3 p-4 text-left" onClick={() => setExpanded(open ? null : block.id)} aria-expanded={open}>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold">{block.title}</h3><Badge variant="outline" className="text-[10px]">{block.status === "completed" ? "Concluído" : block.status === "active" ? "Em andamento" : block.status === "warning" ? "Revisão" : "Pendente"}</Badge></div><p className="mt-1 text-xs leading-5 text-muted-foreground">{block.description}</p></div>{open ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}</button>
          {open ? <div className="border-t px-4 pb-4 pt-3">
            {block.metadata ? <div className="grid gap-2 sm:grid-cols-2">{Object.entries(block.metadata).map(([label, value]) => <div key={label} className="rounded-lg border bg-muted/20 p-3"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>)}</div> : null}
            {block.evidences?.length ? <div className="mt-3 space-y-2"><p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Evidências vinculadas</p>{block.evidences.map((item) => <button key={item.id} type="button" className="flex w-full items-center gap-2 rounded-lg border p-3 text-left hover:bg-muted/40" onClick={() => onNavigateToEvidence?.(block)}><span className="flex size-7 items-center justify-center rounded-md bg-critical-soft text-critical">●</span><span className="flex-1 text-xs font-medium">{item.label}</span><ExternalLink className="size-3.5 text-muted-foreground" /></button>)}</div> : null}
            {block.rules?.length ? <div className="mt-3 flex flex-wrap gap-2">{block.rules.map((rule) => <Badge key={rule.id} variant="outline">{rule.label}</Badge>)}</div> : null}
            {block.policy ? <div className="mt-3 rounded-lg border bg-primary/5 p-3"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Política vinculada</p><p className="mt-1 text-sm font-medium">{block.policy.label}</p></div> : null}
            <Separator className="my-4" /><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[10px] text-muted-foreground">{new Date(block.timestamp).toISOString().slice(11, 16)}</span><div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => onNavigateToEvidence?.(block)}><ArrowRight data-icon="inline-start" /> Ver contexto</Button></div></div>
          </div> : null}
        </div>
      </div>
    })}
  </div>
}
