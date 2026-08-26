import Link from "next/link"
import { ArrowRight, CheckCircle2, FileCheck2, FileText, Search, ShieldCheck, Sparkles, UsersRound } from "lucide-react"
import { AppShell } from "@/components/shell/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const modules: Record<string, { title: string; description: string; eyebrow: string; items: string[]; icon: typeof FileText }> = {
  policies: { title: "Políticas de risco", description: "Transforme critérios jurídicos em regras operacionais para cada decisão.", eyebrow: "Governança", items: ["Garantias e habilitação", "Conflitos de prazo", "Critérios de contratação direta", "Alçadas de aprovação"], icon: ShieldCheck },
  reports: { title: "Pacotes de decisão", description: "Relatórios rastreáveis, prontos para revisão executiva e compartilhamento.", eyebrow: "Saída", items: ["Resumo executivo", "Achados priorizados", "Evidências por página", "Trilha de aprovação"], icon: FileCheck2 },
  evaluation: { title: "Avaliação do copiloto", description: "Acompanhe precisão, cobertura e qualidade das evidências do LexGuard.", eyebrow: "Qualidade", items: ["Precisão por política", "Cobertura de cláusulas", "Confiança das evidências", "Feedback dos revisores"], icon: Sparkles },
  search: { title: "Busca global", description: "Encontre análises, políticas, evidências e pessoas dentro do tenant.", eyebrow: "Descoberta", items: ["Busca por edital ou órgão", "Filtro por risco", "Evidências citadas", "Pessoas e times"], icon: Search },
  notifications: { title: "Notificações", description: "Acompanhe tarefas, menções e eventos importantes da operação.", eyebrow: "Colaboração", items: ["Menções em achados", "Análises atribuídas", "Pacotes concluídos", "Falhas de processamento"], icon: UsersRound },
  settings: { title: "Configurações", description: "Administre preferências do tenant, políticas e controles de acesso.", eyebrow: "Administração", items: ["Preferências do tenant", "Papéis e permissões", "Integrações", "Retenção e auditoria"], icon: FileText },
}

export function OperationalModule({ name }: { name: string }) {
  const module = modules[name] ?? modules.settings
  const Icon = module.icon
  const destination = name === "policies" ? "/policies" : "/analyses"
  return <AppShell title={module.title} description={module.description}>
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-3"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">LexGuard · {module.eyebrow}</p><h2 className="text-balance text-3xl font-semibold tracking-[-0.04em]">{module.title}</h2><p className="max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">{module.description}</p></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{module.items.map((item, index) => <Card key={item} className="transition-colors hover:border-primary/40"><CardContent className="flex min-h-36 flex-col justify-between gap-5 p-5"><div className="flex items-center justify-between"><div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary"><Icon /></div><Badge variant="outline">{index === 0 ? "Ativo" : "Configurável"}</Badge></div><p className="text-sm font-medium">{item}</p></CardContent></Card>)}</div>
      <Card><CardHeader className="border-b"><CardTitle className="text-base">Pronto para operação</CardTitle><p className="text-sm text-muted-foreground">Esta área já está estruturada para receber dados reais, permissões e eventos do tenant.</p></CardHeader><CardContent className="flex flex-col gap-3 p-5">{module.items.slice(0, 3).map((item) => <div key={item} className="flex items-center gap-3 text-sm"><CheckCircle2 className="size-4 text-success" />{item}<Button variant="ghost" size="sm" className="ml-auto" render={<Link href={destination} />}>Abrir <ArrowRight data-icon="inline-end" /></Button></div>)}</CardContent></Card>
    </div>
  </AppShell>
}
