import type { Analysis } from "@/types/analysis"
import type { RuntimeAnalysis } from "@/types/analysis-runtime"
import type { AnalysisBlock } from "@/types/analysis-block"

export function runtimeFromMock(analysis: Analysis): RuntimeAnalysis {
  const primary = [...analysis.documents].sort((a, b) => b.decision.riskScore.value - a.decision.riskScore.value)[0]
  return {
    id: analysis.id,
    title: analysis.title,
    orgao: analysis.orgao,
    valueBRL: analysis.valueBRL,
    recommendation: primary.decision.recommendation,
    riskScore: primary.decision.riskScore.value,
    evidenceQuality: primary.decision.evidenceQuality,
    status: analysis.status,
    updatedAt: analysis.updatedAt,
    policyName: analysis.policyName,
    documentNames: analysis.documents.map((item) => item.document.name),
    responsible: analysis.id === "an_saude" ? "Ana Silva" : "Marina Costa",
    progress: analysis.status === "completed" ? 100 : 72,
    currentStep: analysis.status === "completed" ? "Decisão consolidada" : "Evidências sendo validadas",
    evidenceCount: analysis.documents.reduce((sum, item) => sum + item.findings.length, 0),
    conflictCount: analysis.documents.reduce((sum, item) => sum + item.decision.conflictsCount, 0),
    blocks: buildMockBlocks(analysis),
    events: [],
    jobs: [],
  }
}

function buildMockBlocks(analysis: Analysis): AnalysisBlock[] {
  const primary = [...analysis.documents].sort((a, b) => b.decision.riskScore.value - a.decision.riskScore.value)[0]
  const evidence = primary.findings.slice(0, 3)
  const ts = new Date(analysis.updatedAt).toISOString()
  return [
    { id: `${analysis.id}:document`, type: "document", step: 1, title: "Documento recebido", iconName: "FileInput", status: "completed", timestamp: ts, description: `${analysis.documents.length} documento(s) foram recebidos e preparados para análise.`, documents: analysis.documents.map((item) => ({ id: item.document.id, label: item.document.name, kind: "document" })), actions: ["document"] },
    { id: `${analysis.id}:extraction`, type: "extraction", step: 2, title: "Extração documental", iconName: "FileText", status: "completed", timestamp: ts, description: "Texto e metadados foram extraídos dos documentos vinculados.", metadata: { "Páginas processadas": String(analysis.documents.reduce((s, item) => s + (item.document.pages ?? 0), 0)), "Método": "PDF nativo", "Qualidade": primary.decision.evidenceQuality } },
    { id: `${analysis.id}:section`, type: "section", step: 3, title: "Seções relevantes encontradas", iconName: "ScanSearch", status: "completed", timestamp: ts, description: "Habilitação, prazos, garantias, penalidades e pagamento foram identificados.", metadata: { Seções: "14", Cláusulas: "96" }, actions: ["document"] },
    { id: `${analysis.id}:variable`, type: "variable", step: 4, title: "Variáveis críticas identificadas", iconName: "Braces", status: "completed", timestamp: ts, description: "Variáveis críticas foram extraídas e associadas às evidências.", metadata: { Prazo: primary.policyComparison[0]?.editalValue ?? "—", Garantia: primary.policyComparison[2]?.editalValue ?? "—", Multa: primary.policyComparison[1]?.editalValue ?? "—", Valor: `R$ ${(analysis.valueBRL / 1000000).toFixed(1).replace('.', ',')}M` } },
    { id: `${analysis.id}:evidence`, type: "evidence", step: 5, title: "Evidências encontradas", iconName: "Quote", status: "completed", timestamp: ts, description: `${primary.findings.length} findings foram vinculados à página e cláusula de origem.`, evidences: evidence.map((item) => ({ id: item.id, label: `${item.title} · p. ${item.where.page} · ${item.where.clause}`, kind: "evidence" })), actions: ["evidence", "document"] },
    { id: `${analysis.id}:policy`, type: "policy", step: 6, title: "Política da empresa aplicada", iconName: "ShieldCheck", status: "completed", timestamp: ts, description: `Política ${analysis.policyName} confrontada com as evidências encontradas.`, policy: { id: analysis.policyId, label: analysis.policyName, kind: "policy" }, rules: primary.policyComparison.map((item, index) => ({ id: `rule-${index}`, label: `R-${String(index + 1).padStart(3, '0')} · ${item.criterion}`, kind: "rule" })) },
    { id: `${analysis.id}:risk`, type: "risk", step: 7, title: "Risco identificado", iconName: "TriangleAlert", status: primary.decision.conflictsCount ? "warning" : "completed", timestamp: ts, description: primary.decision.mainRisk, metadata: { Impacto: primary.decision.riskScore.band === "high" ? "Crítico" : primary.decision.riskScore.band === "medium" ? "Alto" : "Moderado", Conflitos: String(primary.decision.conflictsCount), "Evidência": evidence[0] ? `Página ${evidence[0].where.page}` : "—" }, actions: ["evidence", "policy"] },
    { id: `${analysis.id}:decision`, type: "decision", step: 8, title: "Recomendação preliminar", iconName: "Scale", status: "completed", timestamp: ts, description: "A evidência disponível sustenta a recomendação indicada, sujeita à validação humana.", metadata: { Recomendação: primary.decision.recommendation === "ADVANCE" ? "AVANÇAR" : primary.decision.recommendation === "NOT_PRIORITY" ? "NÃO PRIORIZAR" : "REVISAR", "Risk Score": `${primary.decision.riskScore.value}/100`, Motivos: `${primary.decision.conflictsCount} conflitos` }, actions: ["decision"] },
    { id: `${analysis.id}:consolidation`, type: "consolidation", step: 9, title: "Decisão consolidada", iconName: "CheckCircle2", status: "completed", timestamp: ts, description: primary.decision.mainRisk, metadata: { "Principais fatores": primary.decision.factors.map((factor) => factor.label).join(" · ") }, actions: ["decision"] },
  ]
}
