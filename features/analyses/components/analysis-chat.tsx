"use client"

import Link from "next/link"
import { FileText, Paperclip, Send, Sparkles, ArrowUpRight, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { RuntimeAnalysis } from "@/types/analysis-runtime"

export function AnalysisChat({ analysis, onOpenContext }: { analysis: RuntimeAnalysis; onOpenContext?: () => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex min-h-16 shrink-0 items-center gap-3 border-b px-4 py-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold">{analysis.title}</h2>
            <Badge variant="outline" className="shrink-0 text-[10px]">
              {analysis.status === "processing" ? `${analysis.progress}%` : analysis.status === "completed" ? "Concluída" : "Em análise"}
            </Badge>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">{analysis.orgao} · {analysis.id}</p>
        </div>
        <Link href={`/analyses/${analysis.id}`} onClick={onOpenContext} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-muted">
          <ArrowUpRight data-icon="inline-start" /> Abrir contexto
        </Link>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 md:px-8">
          <div className="flex justify-center">
            <Badge variant="outline" className="gap-1.5 text-[10px]"><FileText data-icon="inline-start" /> Contexto da análise disponível</Badge>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <div className="max-w-2xl rounded-2xl rounded-tl-sm border bg-card p-4 shadow-sm">
              <p className="text-sm leading-6">
                A análise está vinculada a {analysis.documentNames.length} documento{analysis.documentNames.length === 1 ? "" : "s"} e à política <strong>{analysis.policyName}</strong>. Posso responder sobre evidências, riscos, conflitos e recomendação usando o contexto disponível.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg border bg-muted/20 p-3"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Risco</p><p className="mt-1 font-mono text-lg font-semibold">{analysis.riskScore}/100</p></div>
                <div className="rounded-lg border bg-muted/20 p-3"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Evidências</p><p className="mt-1 font-mono text-lg font-semibold">{analysis.evidenceCount}</p></div>
                <div className="rounded-lg border bg-muted/20 p-3"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Conflitos</p><p className="mt-1 font-mono text-lg font-semibold">{analysis.conflictCount}</p></div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" render={<Link href={`/analyses/${analysis.id}#evidence`} />}><ShieldAlert data-icon="inline-start" /> Ver evidências</Button>
                <Button variant="outline" size="sm" render={<Link href={`/analyses/${analysis.id}#decision`} />}>Ver decisão</Button>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-end gap-3">
            <div className="max-w-xl rounded-2xl rounded-tr-sm bg-primary p-4 text-primary-foreground shadow-sm">
              <p className="text-sm leading-6">Quais pontos devo validar primeiro?</p>
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">MC</div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Sparkles className="size-4" /></div>
            <div className="max-w-2xl rounded-2xl rounded-tl-sm border bg-card p-4 shadow-sm">
              <p className="text-sm leading-6">Comece pelos conflitos de maior impacto. Nesta análise, a garantia contratual e o prazo de proposta merecem a primeira revisão.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" render={<Link href={`/analyses/${analysis.id}#evidence`} />}><ShieldAlert data-icon="inline-start" /> Abrir evidências</Button>
                <Button variant="outline" size="sm" render={<Link href={`/analyses/${analysis.id}#document`} />}><FileText data-icon="inline-start" /> Abrir documento</Button>
              </div>
            </div>
          </div>

          <Separator />
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{analysis.documentNames.length} documentos</Badge>
            <Badge variant="outline">{analysis.evidenceCount} evidências</Badge>
            <Badge variant="outline">Política {analysis.policyName}</Badge>
          </div>
        </div>
      </ScrollArea>

      <footer className="shrink-0 border-t bg-background p-3 md:p-4">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-2 shadow-sm">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" aria-label="Anexar documento"><Paperclip /></Button>
            <textarea aria-label="Mensagem para a análise" placeholder="Pergunte sobre evidências, risco ou política..." className="min-h-10 max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground" />
            <Button size="icon" aria-label="Enviar mensagem"><Send /></Button>
          </div>
          <p className="px-2 pt-1 text-[10px] text-muted-foreground">As respostas usam os documentos, evidências e políticas vinculados à análise.</p>
        </div>
      </footer>
    </div>
  )
}
