"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { FileText, Search, ShieldCheck, UserRound } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { RuntimeAnalysis } from "@/types/analysis-runtime"

interface SearchItem { id: string; label: string; group: "Análises" | "Documentos" | "Órgãos" | "Responsáveis" | "Políticas"; analysisId: string; meta: string }

export function AnalysisSearch({ analyses, value, onValueChange }: { analyses: RuntimeAnalysis[]; value: string; onValueChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const items = useMemo<SearchItem[]>(() => analyses.flatMap((analysis) => [
    { id: `${analysis.id}:analysis`, label: analysis.title, group: "Análises", analysisId: analysis.id, meta: analysis.orgao },
    ...analysis.documentNames.map((name) => ({ id: `${analysis.id}:${name}`, label: name, group: "Documentos" as const, analysisId: analysis.id, meta: analysis.title })),
    { id: `${analysis.id}:orgao`, label: analysis.orgao, group: "Órgãos", analysisId: analysis.id, meta: analysis.title },
    { id: `${analysis.id}:responsible`, label: analysis.responsible, group: "Responsáveis", analysisId: analysis.id, meta: analysis.title },
    { id: `${analysis.id}:policy`, label: analysis.policyName, group: "Políticas", analysisId: analysis.id, meta: analysis.title },
  ]), [analyses])
  const filtered = useMemo(() => {
    const normalized = value.trim().toLocaleLowerCase("pt-BR")
    if (!normalized) return []
    return items.filter((item) => `${item.label} ${item.meta} ${item.analysisId}`.toLocaleLowerCase("pt-BR").includes(normalized)).slice(0, 8)
  }, [items, value])
  useEffect(() => setActive(0), [value])

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!filtered.length) return
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((current) => Math.min(current + 1, filtered.length - 1)) }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((current) => Math.max(current - 1, 0)) }
    if (event.key === "Enter") { event.preventDefault(); window.location.href = `/analyses/${filtered[active].analysisId}` }
    if (event.key === "Escape") setOpen(false)
  }

  return <div className="relative flex-1"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input value={value} onChange={(event) => { onValueChange(event.target.value); setOpen(true) }} onFocus={() => setOpen(true)} onKeyDown={onKeyDown} placeholder="Buscar análise, documento, órgão, pessoa ou política" className="pl-9" aria-autocomplete="list" />{open && filtered.length ? <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border bg-popover p-1 shadow-xl">
    {filtered.map((item, index) => <Link key={item.id} href={`/analyses/${item.analysisId}`} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${index === active ? "bg-accent" : "hover:bg-accent/70"}`}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">{item.group === "Políticas" ? <ShieldCheck className="size-4" /> : item.group === "Responsáveis" ? <UserRound className="size-4" /> : <FileText className="size-4" />}</div>
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{highlight(item.label, value)}</p><p className="truncate text-xs text-muted-foreground">{item.meta}</p></div><Badge variant="outline" className="shrink-0 text-[10px]">{item.group}</Badge>
    </Link>)}
  </div> : null}</div>
}

function highlight(text: string, query: string) {
  if (!query) return text
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const parts = text.split(new RegExp(`(${safe})`, "ig"))
  return parts.map((part, index) => part.toLocaleLowerCase("pt-BR") === query.toLocaleLowerCase("pt-BR") ? <mark key={index} className="rounded bg-primary/15 px-0.5 text-inherit">{part}</mark> : part)
}
