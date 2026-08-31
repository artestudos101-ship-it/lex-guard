import { NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  question: z.string().trim().min(2).max(2000),
  analysis: z.object({ title: z.string(), policyName: z.string(), summary: z.string().optional(), riskScore: z.number(), recommendation: z.string(), evidences: z.array(z.object({ label: z.string(), page: z.number().nullable(), excerpt: z.string() })).optional(), conflicts: z.array(z.object({ title: z.string(), description: z.string(), severity: z.string() })).optional() }),
  document: z.object({ name: z.string().min(1), mimeType: z.literal("application/pdf"), data: z.string().min(1) }).optional(),
})

export async function POST(request: Request) {
  try {
    const { question, analysis, document } = schema.parse(await request.json())
    const key = process.env.GEMINI_API_KEY
    if (!key) return NextResponse.json({ error: "GEMINI_API_KEY não configurada no servidor." }, { status: 503 })
    const context = JSON.stringify({ title: analysis.title, policy: analysis.policyName, summary: analysis.summary, score: analysis.riskScore, recommendation: analysis.recommendation, evidences: analysis.evidences, conflicts: analysis.conflicts })
    const parts: Array<Record<string, unknown>> = [{ text: `Responda em português, de forma objetiva, usando somente este contexto de análise. Se não houver evidência suficiente, diga isso claramente. Contexto: ${context}\nPergunta: ${question}` }]
    if (document) parts.push({ inline_data: { mime_type: document.mimeType, data: document.data } })
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { temperature: 0.2 } }), signal: AbortSignal.timeout(60000) })
    const body = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } }
    if (!response.ok) return NextResponse.json({ error: body.error?.message || "O Gemini recusou a pergunta." }, { status: 502 })
    const answer = body.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join(" ").trim()
    if (!answer) return NextResponse.json({ error: "O Gemini retornou uma resposta vazia." }, { status: 502 })
    return NextResponse.json({ answer, source: "gemini" })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Pergunta ou contexto inválido." }, { status: 400 })
    return NextResponse.json({ error: "Falha ao consultar o Gemini." }, { status: 500 })
  }
}
