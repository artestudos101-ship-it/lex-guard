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
    const checks = [
      { source: "PNCP" as const, status: input.identifiers?.pncpId ? "warning" as const : "unavailable" as const, detail: input.identifiers?.pncpId ? "Identificador recebido; confirme o registro no PNCP antes da decisão." : "Informe o identificador PNCP para validar o edital publicamente.", url: "https://www.pncp.gov.br/app/editais" },
      { source: "Receita Federal" as const, status: input.identifiers?.cnpj ? "warning" as const : "unavailable" as const, detail: input.identifiers?.cnpj ? "CNPJ recebido; confirme o cadastro na fonte oficial." : "Informe o CNPJ para validar a parte contratante.", url: "https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp" },
      { source: "Compras.gov.br" as const, status: input.identifiers?.editalNumber ? "warning" as const : "unavailable" as const, detail: input.identifiers?.editalNumber ? "Número recebido; confirme a publicação e seus anexos no portal oficial." : "Informe o número do edital para comparar a publicação oficial.", url: "https://www.gov.br/compras/pt-br" },
    ]
    const suspicious = /pix|senha|urgente|depósito|deposito|whatsapp|conta pessoal|fora do portal/i.test(input.documentText)
    return NextResponse.json({ title: input.title, checks, scamSignals: suspicious ? [{ severity: "high", detail: "O conteúdo contém sinais de fraude ou desvio do canal oficial; não prossiga sem validação humana." }] : [], source: "public-sources" })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Dados de validação inválidos.", issues: error.issues }, { status: 400 })
    return NextResponse.json({ error: "Falha na validação pública." }, { status: 500 })
  }
}
