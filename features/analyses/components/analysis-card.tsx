"use client"

import Link from "next/link"
import { ArrowUpRight, CheckCircle2, FileText, MoreHorizontal, Play, RefreshCw, ShieldAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { RuntimeAnalysis } from "@/types/analysis-runtime"

const recommendationLabel: Record<string, string> = {
  ADVANCE: "Avançar",
  REVIEW: "Revisar",
  NOT_PRIORITY: "Não priorizar",
}

const statusLabel: Record<string, string> = {
  queued: "Na fila",
  processing: "Em análise",
  completed: "Concluída",
  failed: "Falha",
}

export function AnalysisCard({
  analysis,
  onStart,
  onRetry,
  onAction,
}: {
  analysis: RuntimeAnalysis
  onStart?: () => void
  onRetry?: () => void
  onAction?: (action: "assign" | "share" | "archive" | "delete" | "package") => void
}) {
  const processing = analysis.status === "processing" || analysis.status === "queued"
  return (
    <Card className="overflow-hidden border-border/80 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <CardHeader className="border-b pb-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{analysis.title}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{analysis.orgao} · {analysis.id}</p>
              </div>
              <Badge variant="secondary">{statusLabel[analysis.status]}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span>{analysis.documentNames.length} documento{analysis.documentNames.length === 1 ? "" : "s"}</span>
              <span>•</span>
              <span>{analysis.responsible}</span>
              <span>•</span>
              <span>{analysis.policyName}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Mais opções" />}><MoreHorizontal /></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAction?.("assign")}>Atribuir</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction?.("share")}>Compartilhar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction?.("package")}>Gerar pacote</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction?.("archive")}>Arquivar</DropdownMenuItem>
              <DropdownMenuItem className="text-critical" onClick={() => onAction?.("delete")}>Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-5">
        {processing ? (
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Análise em andamento</p>
                <p className="mt-1 text-xs text-muted-foreground">{analysis.currentStep}</p>
              </div>
              <span className="font-mono text-sm font-semibold text-primary">{analysis.progress}%</span>
            </div>
            <Progress value={analysis.progress} className="mt-3" />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {analysis.blocks.slice(0, 6).map((block) => (
                <div key={block.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                  {block.status === "completed" ? <CheckCircle2 className="size-3.5 text-success" /> : block.status === "active" ? <span className="size-2.5 rounded-full bg-primary" /> : <span className="size-2.5 rounded-full border border-border" />}
                  <span className={block.status === "active" ? "text-foreground" : ""}>{block.title}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span>{analysis.documentNames.length} documentos</span>
              <span>•</span>
              <span>{analysis.evidenceCount} evidências</span>
              <span>•</span>
              <span>{analysis.conflictCount} conflitos</span>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-4">
            <Metric label="Risco" value={`${analysis.riskScore}/100`} icon={<ShieldAlert className="size-4" />} />
            <Metric label="Recomendação" value={recommendationLabel[analysis.recommendation] ?? analysis.recommendation} />
            <Metric label="Evidências" value={String(analysis.evidenceCount)} />
            <Metric label="Conflitos" value={String(analysis.conflictCount)} />
          </div>
        )}
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Última atividade</span>{" "}{new Date(analysis.updatedAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}
          </div>
          <div className="flex items-center gap-2">
            {analysis.status === "failed" ? (
              <Button variant="outline" size="sm" onClick={onRetry}><RefreshCw data-icon="inline-start" /> Tentar novamente</Button>
            ) : analysis.status === "queued" ? (
              <Button size="sm" onClick={onStart}><Play data-icon="inline-start" /> Iniciar análise</Button>
            ) : null}
            <Link href={`/analyses/${analysis.id}`} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-muted"><ArrowUpRight data-icon="inline-start" /> Abrir análise</Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div className="rounded-lg border bg-background p-3"><div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">{icon}{label}</div><p className="mt-1 truncate text-sm font-semibold">{value}</p></div>
}
