"use client"

import { useEffect, useState } from "react"
import { Filter, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface AnalysisFilterState {
  statuses: string[]
  recommendations: string[]
  responsible: string
  team: string
}

export const defaultAnalysisFilters: AnalysisFilterState = { statuses: [], recommendations: [], responsible: "", team: "" }

export function AnalysisFilters({ value, onChange }: { value: AnalysisFilterState; onChange: (value: AnalysisFilterState) => void }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)
  useEffect(() => setDraft(value), [value])
  const active = value.statuses.length + value.recommendations.length + Number(Boolean(value.responsible)) + Number(Boolean(value.team))

  function toggle(list: string[], item: string) { return list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item] }
  return (
    <div className="relative">
      <Button variant={active ? "secondary" : "outline"} size="sm" onClick={() => setOpen((current) => !current)}><Filter data-icon="inline-start" /> Filtros{active ? <Badge className="ml-1 size-5 justify-center rounded-full p-0 text-[10px]">{active}</Badge> : null}</Button>
      {open ? <div className="absolute right-0 top-full z-30 mt-2 w-[340px] rounded-xl border bg-popover p-4 shadow-lg">
        <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Filtrar análises</p><p className="text-xs text-muted-foreground">Atualiza a lista e a URL.</p></div><Button variant="ghost" size="icon" onClick={() => setOpen(false)}><X /></Button></div>
        <div className="mt-4 space-y-5">
          <Group title="Status">{[["processing", "Em análise"], ["completed", "Concluída"], ["queued", "Na fila"], ["failed", "Falha"]].map(([value, label]) => <CheckRow key={value} label={label} checked={draft.statuses.includes(value)} onChange={() => setDraft({ ...draft, statuses: toggle(draft.statuses, value) })} />)}</Group>
          <Group title="Recomendação">{[["ADVANCE", "Avançar"], ["REVIEW", "Revisar"], ["NOT_PRIORITY", "Não priorizar"]].map(([value, label]) => <CheckRow key={value} label={label} checked={draft.recommendations.includes(value)} onChange={() => setDraft({ ...draft, recommendations: toggle(draft.recommendations, value) })} />)}</Group>
          <Group title="Responsável"><select value={draft.responsible} onChange={(e) => setDraft({ ...draft, responsible: e.target.value })} className="h-9 w-full rounded-md border bg-background px-3 text-sm"><option value="">Todos</option><option>Marina Costa</option><option>Roberto Demo</option><option>Ana Silva</option></select></Group>
          <Group title="Equipe"><select value={draft.team} onChange={(e) => setDraft({ ...draft, team: e.target.value })} className="h-9 w-full rounded-md border bg-background px-3 text-sm"><option value="">Todas</option><option>Comercial</option><option>Jurídico</option><option>Compliance</option></select></Group>
        </div>
        <div className="mt-5 flex justify-between border-t pt-4"><Button variant="ghost" onClick={() => { setDraft(defaultAnalysisFilters); onChange(defaultAnalysisFilters); setOpen(false) }}>Limpar</Button><Button onClick={() => { onChange(draft); setOpen(false) }}><SlidersHorizontal data-icon="inline-start" /> Aplicar filtros</Button></div>
      </div> : null}
    </div>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) { return <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p><div className="space-y-2">{children}</div></div> }
function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) { return <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={checked} onChange={onChange} className="size-4 accent-[--primary]" /><span>{label}</span></label> }
