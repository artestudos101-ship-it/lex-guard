"use client"

import Link from "next/link"
import { useState } from "react"
import { Activity, ArrowRight, CheckCircle2, Clock3, FileSearch, Files, Plus, ShieldAlert, Sparkles, UploadCloud } from "lucide-react"
import { AppShell } from "@/components/shell/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const analyses = [
  { title: "Concorrência 014/2026 — Serviços de TI", agency: "Secretaria de Administração · DF", status: "Em revisão", tone: "warning", score: 68, updated: "há 12 min", id: "AN-2026-014" },
  { title: "Pregão Eletrônico 087/2026 — Facilities", agency: "Prefeitura de Belo Horizonte · MG", status: "Concluída", tone: "success", score: 24, updated: "ontem", id: "AN-2026-009" },
  { title: "Edital 221/2026 — Infraestrutura", agency: "Tribunal Regional · SP", status: "Aguardando evidências", tone: "info", score: 51, updated: "há 2 dias", id: "AN-2026-006" },
]

const toneClass = { warning: "bg-warning-soft text-warning-foreground", success: "bg-success-soft text-success-foreground", info: "bg-info-soft text-info-foreground" }

export default function Home() {
  const [uploaded, setUploaded] = useState(false)
  return (
    <AppShell title="Painel de decisão" description="Visão geral do seu portfólio de análises">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
        <section className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-end md:p-8">
          <div className="flex max-w-2xl flex-col gap-3">
            <Badge variant="outline" className="w-fit gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"><Sparkles data-icon="inline-start" /> Operação demo ativa</Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-4xl">Decida com evidências, não com suposições.</h2>
            <p className="max-w-xl text-pretty text-sm leading-6 text-muted-foreground">O LexGuard transforma editais complexos em sinais de risco, conflitos de política e um pacote de decisão rastreável.</p>
          </div>
          <Button size="lg" render={<Link href="/analyses/new" />}><Plus data-icon="inline-start" /> Nova análise <ArrowRight data-icon="inline-end" /></Button>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[{ label: "Análises em andamento", value: "04", detail: "+2 nesta semana", icon: Activity }, { label: "Risco médio do portfólio", value: "42/100", detail: "↓ 8 pontos vs. mês anterior", icon: ShieldAlert }, { label: "Evidências processadas", value: "1.284", detail: "98,4% com confiança alta", icon: Files }, { label: "Tempo médio de decisão", value: "18 min", detail: "↓ 32% vs. fluxo manual", icon: Clock3 }].map((metric) => <Card key={metric.label}><CardContent className="flex items-start justify-between p-5"><div className="flex flex-col gap-2"><span className="text-xs font-medium text-muted-foreground">{metric.label}</span><strong className="text-2xl tracking-tight">{metric.value}</strong><span className="text-xs text-success">{metric.detail}</span></div><metric.icon className="size-5 text-primary" /></CardContent></Card>)}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b"><div><CardTitle className="text-base">Análises recentes</CardTitle><p className="mt-1 text-sm text-muted-foreground">Acompanhe a fila de decisões do seu time.</p></div><Button variant="ghost" size="sm" render={<Link href="/analyses" />}>Ver todas <ArrowRight data-icon="inline-end" /></Button></CardHeader>
            <CardContent className="p-0"><div className="flex flex-col">{analyses.map((item) => <Link href={`/analyses/${item.id}`} key={item.id} className="group flex flex-col gap-3 border-b p-5 transition-colors last:border-0 hover:bg-muted/40 md:flex-row md:items-center md:justify-between"><div className="flex min-w-0 items-start gap-3"><div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><FileSearch className="size-4" /></div><div className="flex min-w-0 flex-col gap-1"><span className="truncate text-sm font-medium">{item.title}</span><span className="text-xs text-muted-foreground">{item.agency}</span><span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">{item.id} · atualizado {item.updated}</span></div></div><div className="flex items-center gap-4 pl-12 md:pl-0"><Badge className={toneClass[item.tone as keyof typeof toneClass]} variant="secondary">{item.status}</Badge><div className="flex min-w-28 flex-col gap-1"><div className="flex justify-between text-[10px] font-medium"><span>Risco</span><span>{item.score}/100</span></div><Progress value={item.score} className="h-1.5" /></div><ArrowRight className="hidden size-4 text-muted-foreground transition-transform group-hover:translate-x-1 md:block" /></div></Link>)}</div></CardContent>
          </Card>

          <Card className="overflow-hidden"><CardHeader><CardTitle className="text-base">Comece uma análise</CardTitle><p className="text-sm leading-6 text-muted-foreground">Carregue o edital e deixe o copiloto organizar o contexto.</p></CardHeader><CardContent className="flex flex-col gap-4"><button type="button" onClick={() => setUploaded(true)} className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/30 px-5 text-center transition-colors hover:border-primary hover:bg-primary/5"><div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"><UploadCloud className="size-5" /></div><span className="text-sm font-medium">{uploaded ? "Arquivo pronto para análise" : "Arraste PDFs ou selecione arquivos"}</span><span className="text-xs text-muted-foreground">Até 3 arquivos · PDF · 50 MB por arquivo</span></button><Button variant="outline" render={<Link href="/analyses/new" />}>Abrir fluxo completo <ArrowRight data-icon="inline-end" /></Button></CardContent></Card>
        </div>

        <Card><CardHeader className="border-b"><CardTitle className="text-base">Atividade do time</CardTitle></CardHeader><CardContent className="grid gap-4 p-5 md:grid-cols-3">{[{ text: "Marina revisou 3 achados críticos", time: "há 8 min", icon: ShieldAlert }, { text: "Pacote de decisão gerado", time: "há 42 min", icon: CheckCircle2 }, { text: "Novo edital processado", time: "ontem às 16:24", icon: FileSearch }].map((event) => <div key={event.text} className="flex gap-3"><event.icon className="mt-0.5 size-4 shrink-0 text-primary" /><div className="flex flex-col gap-1"><span className="text-sm">{event.text}</span><span className="text-xs text-muted-foreground">{event.time}</span></div></div>)}</CardContent></Card>
      </div>
    </AppShell>
  )
}
