import { NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  title: z.string().min(1).max(200),
  documentText: z.string().max(50000).optional().default(""),
  identifiers: z.object({ cnpj: z.string().optional(), editalNumber: z.string().optional(), pncpId: z.string().optional() }).optional(),
})

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json())
    const cnpj = input.identifiers?.cnpj?.replace(/\D/g, "")
    const pncpId = input.identifiers?.pncpId?.trim()
    const [pncp, receita, compras] = await Promise.all([
      pncpId ? fetch(`https://pncp.gov.br/api/consulta/v1/contratacoes/${encodeURIComponent(pncpId)}`, { signal: AbortSignal.timeout(8000) }).then(async (res) => ({ status: res.ok ? "verified" as const : "not_found" as const, detail: res.ok ? "Registro encontrado no PNCP." : "Identificador não encontrado no PNCP." })).catch(() => ({ status: "unavailable" as const, detail: "PNCP indisponível para consulta." })) : Promise.resolve({ status: "unavailable" as const, detail: "Informe o identificador PNCP para consultar a publicação." }),
      cnpj && cnpj.length === 14 ? fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, { signal: AbortSignal.timeout(8000) }).then(async (res) => ({ status: res.ok ? "verified" as const : "not_found" as const, detail: res.ok ? "CNPJ encontrado na base pública consultada." : "CNPJ não encontrado na base pública consultada." })).catch(() => ({ status: "unavailable" as const, detail: "Base pública de CNPJ indisponível para consulta." })) : Promise.resolve({ status: "unavailable" as const, detail: "Informe um CNPJ válido para consultar dados públicos." }),
      fetch("https://www.gov.br/compras/pt-br", { signal: AbortSignal.timeout(8000) }).then(async (res) => ({ status: res.ok ? "verified" as const : "unavailable" as const, detail: res.ok ? "Portal Compras.gov.br acessível para conferência manual." : "Portal Compras.gov.br não respondeu." })).catch(() => ({ status: "unavailable" as const, detail: "Portal Compras.gov.br indisponível para consulta." })),
    ])
    const checks = [
      { source: "PNCP" as const, ...pncp, url: "https://www.pncp.gov.br/app/editais" },
      { source: "Receita Federal" as const, ...receita, url: "https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp" },
      { source: "Compras.gov.br" as const, ...compras, url: "https://www.gov.br/compras/pt-br" },
    ]
    const suspicious = /pix|senha|urgente|depósito|deposito|whatsapp|conta pessoal|fora do portal/i.test(input.documentText)
    return NextResponse.json({ title: input.title, checks, scamSignals: suspicious ? [{ severity: "high", detail: "O conteúdo contém sinais de fraude ou desvio do canal oficial; não prossiga sem validação humana." }] : [], source: "public-sources" })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Dados de validação inválidos.", issues: error.issues }, { status: 400 })
    return NextResponse.json({ error: "Falha na validação pública." }, { status: 500 })
  }
}
