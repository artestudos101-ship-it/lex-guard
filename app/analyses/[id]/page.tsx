"use client"

import Link from "next/link"
import { use, useState } from "react"
import { ArrowLeft, Check, CheckCircle2, FileText, MessageSquare, Send, ShieldAlert, Sparkles } from "lucide-react"
import { AppShell } from "@/components/shell/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useAnalysisStore } from "@/lib/analysis-store"

export default function AnalysisConversation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { analyses, update } = useAnalysisStore()
  const analysis = analyses.find((item) => item.id === id) ?? analyses[0]
  const [confirmed, setConfirmed] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<string[]>([])
  if (!analysis) return null
  const document = analysis.documents[0]
  const blocks = [
    { label: "Objetivo e contexto", icon: FileText, text: `Escopo definido para ${analysis.title}, sob responsabilidade de ${analysis.owner}.` },
    { label: "Documentos vinculados", icon: FileText, text: `${analysis.documents.length} documento(s) foram vinculados ao fluxo e estão disponíveis para consulta.` },
    { label: "Evidências encontradas", icon: Sparkles, text: document?.decision.mainRisk ?? "Nenhum risco relevante identificado nos documentos vinculados." },
    { label: "Comparação com política", icon: ShieldAlert, text: `${document?.decision.conflictsCount ?? 0} conflito(s) encontrados contra a política ${analysis.policyName}.` },
    { label: "Recomendação", icon: CheckCircle2, text: document?.decision.recommendation === "ADVANCE" ? "Avançar para a próxima etapa." : "Revisar com validação humana antes de decidir." },
  ]
  const send = () => { if (!message.trim()) return; setMessages((current) => [...current, message.trim()]); setMessage("") }
  return <AppShell title="Conversa de decisão" description={`${analysis.id} · evidências e justificativas auditáveis`}><main className="mx-auto flex max-w-5xl flex-col gap-6"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" render={<Link href="/analyses" />} aria-label="Voltar"><ArrowLeft /></Button><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Conversa de decisão</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{analysis.title}</h2><p className="mt-1 text-sm text-muted-foreground">{analysis.orgao} · {analysis.policyName}</p></div></div><Card><CardContent className="flex flex-col gap-4 p-5"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Execução observável</p><p className="text-xs text-muted-foreground">{analysis.completedSteps} de {analysis.steps.length} etapas concluídas</p></div><span className="font-mono text-sm text-primary">{analysis.progress}%</span></div><Progress value={analysis.progress} /></CardContent></Card><div className="flex flex-col gap-4">{blocks.map(({ label, icon: Icon, text }, index) => <Card key={label}><CardHeader className="flex flex-row items-start gap-3 space-y-0"><div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></div><div className="flex-1"><CardTitle className="text-sm">{label}</CardTitle><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div><Badge variant="outline">Etapa {index + 1}</Badge></CardHeader><CardContent className="flex items-center justify-between border-t bg-muted/20 px-5 py-3"><span className="text-xs text-muted-foreground">Justificativa auditável · fonte: documento vinculado</span>{index >= 2 ? <Button size="sm" variant={confirmed.includes(label) ? "secondary" : "outline"} onClick={() => setConfirmed((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label])}>{confirmed.includes(label) ? <><Check data-icon="inline-start" /> Confirmado</> : "Confirmar achado"}</Button> : null}</CardContent></Card>)}</div><Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><MessageSquare className="size-4 text-primary" /> Pergunte sobre esta decisão</CardTitle></CardHeader><CardContent className="flex flex-col gap-3"><div className="flex gap-2"><Input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) send() }} placeholder="Ex.: qual evidência gerou o maior risco?" aria-label="Mensagem para a análise" /><Button onClick={send} aria-label="Enviar mensagem"><Send /></Button></div>{messages.map((item, index) => <div key={`${item}-${index}`} className="rounded-lg bg-muted p-3 text-sm">{item}</div>)}</CardContent></Card><Button variant="outline" onClick={() => update(analysis.id, { status: "completed", progress: 100, completedSteps: analysis.steps.length })}>Marcar análise como concluída</Button></main></AppShell>
}

