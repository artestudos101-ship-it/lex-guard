"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, FileText, Paperclip, Send, ShieldAlert, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import type { RuntimeAnalysis } from "@/types/analysis-runtime"

type Message = { role: "user" | "assistant"; content: string }

export function AnalysisChat({ analysis, onOpenContext }: { analysis: RuntimeAnalysis; onOpenContext?: () => void }) {
  const [question, setQuestion] = useState("")
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [attachment, setAttachment] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function send() {
    const value = question.trim()
    if (!value || sending) return
    const uploaded = attachment
    setQuestion("")
    setMessages((current) => [...current, { role: "user", content: uploaded ? `${value}\n[Documento enviado: ${uploaded.name}]` : value }])
    setSending(true)
    try {
      const document = uploaded ? { name: uploaded.name, mimeType: "application/pdf" as const, data: await fileToBase64(uploaded) } : undefined
      const response = await fetch("/api/analyze/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: value, analysis, document }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Falha ao consultar o Gemini")
      setMessages((current) => [...current, { role: "assistant", content: result.answer }])
      setAttachment(null)
    } catch (error) {
      toast.error("Não foi possível responder", { description: error instanceof Error ? error.message : "Tente novamente." })
    } finally { setSending(false) }
  }

  return <div className="flex h-full min-h-0 flex-col bg-background">
    <header className="flex min-h-16 shrink-0 items-center gap-3 border-b px-4 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Sparkles className="size-4" /></div>
      <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="truncate text-sm font-semibold">{analysis.title}</h2><Badge variant="outline" className="shrink-0 text-[10px]">{analysis.status === "completed" ? "Concluída" : `${analysis.progress}%`}</Badge></div><p className="mt-1 truncate text-xs text-muted-foreground">{analysis.orgao} · {analysis.id}</p></div>
      <Link href={`/analyses/${analysis.id}`} onClick={onOpenContext} className="hidden h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-muted sm:inline-flex"><ArrowUpRight className="size-4" /> Abrir documento</Link>
    </header>
    <ScrollArea className="min-h-0 flex-1"><div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 md:px-8">
      <div className="flex justify-center"><Badge variant="outline" className="gap-1.5 text-[10px]"><FileText className="size-3" /> Resultado do documento e evidências</Badge></div>
      {analysis.status === "processing" ? <div className="flex items-start gap-3"><div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-primary"><Sparkles className="size-4 animate-pulse" /></div><div className="rounded-2xl rounded-tl-sm border bg-card p-4"><p className="text-sm font-medium">Processando documento com Gemini</p><p className="mt-1 text-xs text-muted-foreground">Extraindo conteúdo, confrontando a política e procurando riscos.</p><div className="mt-3 space-y-2">{analysis.blocks.slice(0, 4).map((block) => <div key={block.id} className="animate-pulse rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">{block.title}</div>)}</div></div></div> : <div className="flex items-start gap-3"><div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Sparkles className="size-4" /></div><div className="max-w-2xl rounded-2xl rounded-tl-sm border bg-card p-4 shadow-sm"><p className="text-sm leading-6">{analysis.summary || "A análise foi concluída. Faça uma pergunta para explorar o resultado."}</p><div className="mt-3 grid gap-2 sm:grid-cols-3"><div className="rounded-lg border bg-muted/20 p-3"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Risco</p><p className="mt-1 font-mono text-lg font-semibold">{analysis.riskScore}/100</p></div><div className="rounded-lg border bg-muted/20 p-3"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Evidências</p><p className="mt-1 font-mono text-lg font-semibold">{analysis.evidenceCount}</p></div><div className="rounded-lg border bg-muted/20 p-3"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Conflitos</p><p className="mt-1 font-mono text-lg font-semibold">{analysis.conflictCount}</p></div></div></div></div>}
      {analysis.evidences?.map((evidence) => <div key={evidence.id} className="flex items-start gap-3"><div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><FileText className="size-4" /></div><div className="max-w-2xl rounded-2xl rounded-tl-sm border bg-card p-4"><p className="text-xs font-semibold">Evidência encontrada{evidence.page ? ` · página ${evidence.page}` : ""}</p><p className="mt-2 text-sm leading-6">{evidence.excerpt}</p><p className="mt-2 text-xs text-muted-foreground">{evidence.label}</p></div></div>)}
      {analysis.conflicts?.map((conflict) => <div key={conflict.id} className="flex items-start gap-3"><div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-critical/10 text-critical"><ShieldAlert className="size-4" /></div><div className="max-w-2xl rounded-2xl rounded-tl-sm border border-critical/30 bg-critical/5 p-4"><p className="text-xs font-semibold">Risco: {conflict.title}</p><p className="mt-2 text-sm leading-6">{conflict.description}</p></div></div>)}
      {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : ""}`}><div className={`max-w-2xl whitespace-pre-wrap rounded-2xl p-4 text-sm leading-6 ${message.role === "user" ? "bg-primary text-primary-foreground" : "border bg-card"}`}>{message.content}</div></div>)}
      {sending ? <div className="text-xs text-muted-foreground">Gemini está analisando sua pergunta...</div> : null}
    </div></ScrollArea>
    <footer className="shrink-0 border-t bg-background p-3 md:p-4"><div className="mx-auto max-w-3xl rounded-2xl border bg-card p-2 shadow-sm"><div className="flex items-end gap-1 sm:gap-2"><input ref={fileInputRef} type="file" accept="application/pdf" className="sr-only" onChange={(event) => setAttachment(event.target.files?.[0] ?? null)} /><Button variant="ghost" size="icon" aria-label="Anexar nova versão do documento" onClick={() => fileInputRef.current?.click()}><Paperclip /></Button>{attachment ? <Badge variant="secondary" className="max-w-40 truncate">{attachment.name}</Badge> : null}<textarea value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); void send() } }} aria-label="Mensagem para a análise" placeholder="Pergunte sobre evidências, riscos ou política..." className="min-h-10 max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground" /><Button size="icon" aria-label="Enviar mensagem" disabled={sending || !question.trim()} onClick={() => void send()}><Send /></Button></div><p className="px-2 pt-1 text-[10px] text-muted-foreground">As respostas são geradas pelo Gemini com o contexto desta análise. Anexe uma nova versão para comparar no mesmo chat.</p></div></footer>
  </div>
}

async function fileToBase64(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => { const value = String(reader.result ?? ""); resolve(value.includes(",") ? value.slice(value.indexOf(",") + 1) : value) }
    reader.onerror = () => reject(new Error("O navegador não conseguiu ler o arquivo selecionado."))
    reader.readAsDataURL(file)
  })
}

export const __analysisChatTest = { fileToBase64 }
