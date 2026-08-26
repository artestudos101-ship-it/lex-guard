"use client"

import { CheckCircle2, ShieldAlert, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RuntimeAnalysis } from "@/types/analysis-runtime"

export function DecisionContext({ analysis }: { analysis: RuntimeAnalysis }) {
  const recommendation = analysis.recommendation === "ADVANCE" ? "AVANÇAR" : analysis.recommendation === "NOT_PRIORITY" ? "NÃO PRIORIZAR" : "REVISAR"
  return <div className="flex flex-col gap-4">
    <Card><CardHeader><CardTitle className="text-sm">Decision Context</CardTitle></CardHeader><CardContent className="flex flex-col gap-4">
      <div><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Recomendação</p><Badge className="mt-2 bg-warning-soft text-warning-foreground" variant="secondary">{recommendation}</Badge></div>
      <div className="rounded-xl border bg-muted/20 p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Risk Score</p><p className="mt-1 font-mono text-2xl font-semibold">{analysis.riskScore}/100</p></div><div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldAlert className="size-5" /></div></div><div className="mt-3 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${analysis.riskScore}%` }} /></div></div>
      <div><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Principais riscos</p><div className="mt-2 space-y-2"><RiskItem text="Garantia acima do limite da política" /><RiskItem text="Prazo abaixo do mínimo definido" /></div></div>
      <div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Política</p><p className="mt-1 text-sm font-medium">{analysis.policyName}</p></div><Badge variant="outline">3 regras</Badge></div>
      <div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Conflitos</p><p className="mt-1 text-sm font-medium">{analysis.conflictCount}</p></div><div><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Evidências</p><p className="mt-1 text-sm font-medium">{analysis.evidenceCount}</p></div></div>
      <div className="flex items-center gap-2 rounded-lg border p-3"><Users className="size-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Responsável</p><p className="text-sm font-medium">{analysis.responsible}</p></div></div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="size-4 text-success" />Configuração controlada pelo administrador.</div>
    </CardContent></Card>
  </div>
}
function RiskItem({ text }: { text: string }) { return <div className="flex items-center gap-2 rounded-lg border p-2.5"><span className="size-2.5 rounded-full bg-critical" /><span className="text-xs">{text}</span></div> }
