import { NextResponse } from "next/server"
import { z } from "zod"

const requestSchema = z.object({
  title: z.string().min(3).max(200),
  policy: z.string().min(1).max(200),
  documents: z.array(z.object({
    name: z.string().min(1).max(200),
    mimeType: z.literal("application/pdf"),
    data: z.string().min(1),
  })).min(1).max(3),
})

const responseSchema = z.object({
  recommendation: z.enum(["APPROVE", "REVIEW", "REJECT"]),
  riskScore: z.number().int().min(0).max(100),
  evidenceQuality: z.enum(["Alta", "Média", "Baixa"]),
  conflicts: z.array(z.object({ title: z.string(), description: z.string(), severity: z.enum(["high", "medium", "low"]) })).default([]),
  evidence: z.array(z.object({ label: z.string(), page: z.number().int().positive().nullable(), excerpt: z.string() })).default([]),
  summary: z.string(),
})

const fallbackSchema = z.object({
  recommendation: z.string(), riskScore: z.number(), evidenceQuality: z.string(), conflicts: z.array(z.any()).optional(), evidence: z.array(z.any()).optional(), summary: z.string(),
})

export async function POST(request: Request) {
  try {
    const payload = requestSchema.parse(await request.json())
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY não configurada no servidor." }, { status: 503 })
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"
    const prompt = `Você é o motor de análise jurídica do Lex Guard. Analise os PDFs anexados contra a política "${payload.policy}" e responda SOMENTE JSON válido. Não invente páginas: use null quando não houver página verificável. O JSON deve conter recommendation (APPROVE, REVIEW ou REJECT), riskScore (0-100), evidenceQuality (Alta, Média ou Baixa), conflicts (array de {title,description,severity}), evidence (array de {label,page,excerpt}) e summary. Seja objetivo e deixe claro quando a evidência for insuficiente. Título: ${payload.title}`
    const contents = [{ role: "user", parts: [{ text: prompt }, ...payload.documents.map((document) => ({ inline_data: { mime_type: document.mimeType, data: document.data } }))] }]
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contents, generationConfig: { temperature: 0.1, responseMimeType: "application/json" } }), signal: AbortSignal.timeout(90000) })
    if (!response.ok) return NextResponse.json({ error: "O Gemini não conseguiu processar os documentos.", detail: await response.text() }, { status: 502 })
    const result = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
    const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim()
    if (!text) return NextResponse.json({ error: "Resposta vazia do Gemini." }, { status: 502 })
    const parsed = responseSchema.safeParse(JSON.parse(text))
    if (!parsed.success) {
      const relaxed = fallbackSchema.parse(JSON.parse(text))
      return NextResponse.json({ ...relaxed, conflicts: relaxed.conflicts ?? [], evidence: relaxed.evidence ?? [], source: "gemini" })
    }
    return NextResponse.json({ ...parsed.data, source: "gemini" })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Dados de análise inválidos.", issues: error.issues }, { status: 400 })
    return NextResponse.json({ error: "Falha ao executar a análise." }, { status: 500 })
  }
}
