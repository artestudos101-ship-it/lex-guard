import type { Analysis, AnalyzedDocument, Finding, PolicyConflict } from "@/types"
import { MOCK_DOCUMENTS } from "./documents"

// ---------------------------------------------------------------------------
// Alpha — baixo risco → AVANÇAR
// ---------------------------------------------------------------------------
const ALPHA_FINDINGS: Finding[] = [
  {
    id: "f_alpha_1",
    title: "Prazo de proposta confortável",
    severity: "info",
    quality: "E1",
    what: "O edital concede 14 dias úteis para elaboração da proposta.",
    where: { page: 9, clause: "Cláusula 6.1" },
    quote:
      "O prazo para apresentação das propostas será de 14 (quatorze) dias úteis contados da publicação deste edital.",
    why: "O prazo supera o mínimo definido na política (10 dias), reduzindo o risco de proposta apressada.",
    impact: "Baixo — margem operacional adequada para preparo técnico e comercial.",
    recommendedAction: "Nenhuma ação necessária. Fator favorável à participação.",
    confirmed: true,
    policyConflict: { criterion: "Prazo mínimo", policyValue: "≥ 10 dias", editalValue: "14 dias", status: "ok" },
  },
  {
    id: "f_alpha_2",
    title: "Garantia contratual dentro do limite",
    severity: "low",
    quality: "E1",
    what: "Garantia de execução fixada em 2% do valor global.",
    where: { page: 18, clause: "Cláusula 12.4" },
    quote:
      "A garantia de execução contratual corresponderá a 2% (dois por cento) do valor global do contrato.",
    why: "Abaixo do teto de 3% da política vigente.",
    impact: "Baixo — exposição financeira controlada.",
    recommendedAction: "Manter. Sem necessidade de ressalva.",
    confirmed: true,
    policyConflict: { criterion: "Garantia máxima", policyValue: "≤ 3%", editalValue: "2%", status: "ok" },
  },
]

const ALPHA_COMPARISON: PolicyConflict[] = [
  { criterion: "Prazo mínimo", policyValue: "≥ 10 dias", editalValue: "14 dias", status: "ok" },
  { criterion: "Multa máxima", policyValue: "≤ 10%", editalValue: "6%", status: "ok" },
  { criterion: "Garantia máxima", policyValue: "≤ 3%", editalValue: "2%", status: "ok" },
  { criterion: "Valor máximo", policyValue: "≤ R$ 5M", editalValue: "R$ 2,4M", status: "ok" },
]

const ALPHA: AnalyzedDocument = {
  document: MOCK_DOCUMENTS.doc_alpha,
  decision: {
    recommendation: "ADVANCE",
    riskScore: { value: 28, band: "low" },
    evidenceQuality: "Alta",
    conflictsCount: 0,
    mainRisk: "Nenhum risco crítico identificado. Condições compatíveis com a política Padrão PME.",
    factors: [
      { severity: "info", label: "Prazo de 14 dias acima do mínimo" },
      { severity: "low", label: "Garantia de 2% dentro do limite" },
      { severity: "info", label: "Valor de R$ 2,4M dentro do teto" },
    ],
  },
  findings: ALPHA_FINDINGS,
  policyComparison: ALPHA_COMPARISON,
}

// ---------------------------------------------------------------------------
// Beta — risco médio → REVISAR
// ---------------------------------------------------------------------------
const BETA_FINDINGS: Finding[] = [
  {
    id: "f_beta_1",
    title: "Garantia contratual elevada",
    severity: "critical",
    quality: "E2",
    what: "O edital exige garantia de execução de 5% do valor total do contrato.",
    where: { page: 37, clause: "Cláusula 14.2" },
    quote:
      "A CONTRATADA prestará garantia correspondente a 5% (cinco por cento) do valor total do contrato, no prazo de 10 (dez) dias úteis contados da assinatura.",
    why: "A política Padrão PME limita a garantia a 3%. O percentual exigido imobiliza capital de giro acima do tolerado.",
    impact: "Alto — impacto direto no fluxo de caixa e no custo de oportunidade da operação.",
    recommendedAction:
      "Avaliar viabilidade de seguro-garantia e revisar precificação. Requer validação humana antes de decidir.",
    confirmed: false,
    policyConflict: { criterion: "Garantia máxima", policyValue: "≤ 3%", editalValue: "5%", status: "violation" },
  },
  {
    id: "f_beta_2",
    title: "Prazo de proposta reduzido",
    severity: "medium",
    quality: "E2",
    what: "Apenas 8 dias úteis para apresentação da proposta.",
    where: { page: 11, clause: "Cláusula 5.1" },
    quote:
      "O prazo para apresentação das propostas será de 8 (oito) dias úteis, contados da publicação, em razão da urgência justificada.",
    why: "Abaixo do mínimo de 10 dias definido na política, elevando o risco de erro na composição de custos.",
    impact: "Médio — exige mobilização acelerada da equipe técnica e comercial.",
    recommendedAction: "Confirmar disponibilidade de equipe. Considerar pedido de esclarecimento sobre o prazo.",
    confirmed: false,
    policyConflict: { criterion: "Prazo mínimo", policyValue: "≥ 10 dias", editalValue: "8 dias", status: "violation" },
  },
  {
    id: "f_beta_3",
    title: "Multa moratória compatível",
    severity: "low",
    quality: "E1",
    what: "Multa moratória de 8% sobre a obrigação em atraso.",
    where: { page: 38, clause: "Cláusula 15.1" },
    quote: "A multa moratória será de 8% (oito por cento) sobre o valor da obrigação em atraso.",
    why: "Dentro do teto de 10% da política.",
    impact: "Baixo — penalidade previsível e gerenciável.",
    recommendedAction: "Manter em observação. Sem impedimento.",
    confirmed: true,
    policyConflict: { criterion: "Multa máxima", policyValue: "≤ 10%", editalValue: "8%", status: "ok" },
  },
]

const BETA_COMPARISON: PolicyConflict[] = [
  { criterion: "Prazo mínimo", policyValue: "≥ 10 dias", editalValue: "8 dias", status: "violation" },
  { criterion: "Multa máxima", policyValue: "≤ 10%", editalValue: "8%", status: "ok" },
  { criterion: "Garantia máxima", policyValue: "≤ 3%", editalValue: "5%", status: "violation" },
  { criterion: "Valor máximo", policyValue: "≤ R$ 5M", editalValue: "R$ 3,2M", status: "ok" },
]

const BETA: AnalyzedDocument = {
  document: MOCK_DOCUMENTS.doc_beta,
  decision: {
    recommendation: "REVIEW",
    riskScore: { value: 54, band: "medium" },
    evidenceQuality: "Média",
    conflictsCount: 2,
    mainRisk: "Garantia contratual de 5% excede o limite da política e imobiliza capital de giro.",
    factors: [
      { severity: "critical", label: "Garantia de 5% acima do teto de 3%" },
      { severity: "medium", label: "Prazo de 8 dias abaixo do mínimo" },
      { severity: "low", label: "Multa de 8% dentro do limite" },
    ],
  },
  findings: BETA_FINDINGS,
  policyComparison: BETA_COMPARISON,
}

// ---------------------------------------------------------------------------
// Gamma — risco alto → NÃO PRIORITÁRIO
// ---------------------------------------------------------------------------
const GAMMA_FINDINGS: Finding[] = [
  {
    id: "f_gamma_1",
    title: "Multa por inexecução total excessiva",
    severity: "critical",
    quality: "E3",
    what: "Multa por inexecução total pode alcançar 18% do valor contratado.",
    where: { page: 44, clause: "Cláusula 18.3" },
    quote:
      "A multa por inexecução total poderá alcançar 18% (dezoito por cento) do valor contratado, aplicável de forma cumulativa com demais sanções.",
    why: "Muito acima do teto de 10% da política. Combinada à cumulatividade, cria exposição punitiva desproporcional.",
    impact: "Crítico — risco financeiro severo em caso de qualquer descumprimento.",
    recommendedAction: "Não priorizar sem revisão jurídica aprofundada. Requer validação humana obrigatória.",
    confirmed: false,
    policyConflict: { criterion: "Multa máxima", policyValue: "≤ 10%", editalValue: "18%", status: "violation" },
  },
  {
    id: "f_gamma_2",
    title: "Garantia contratual muito elevada",
    severity: "critical",
    quality: "E3",
    what: "Garantia de execução de 7%, exigida cumulativamente à garantia da proposta.",
    where: { page: 29, clause: "Cláusula 11.2" },
    quote:
      "A garantia de execução será equivalente a 7% (sete por cento) do valor global, exigida cumulativamente à garantia da proposta.",
    why: "Mais que o dobro do teto de 3%. A cumulatividade agrava a imobilização de capital.",
    impact: "Crítico — barreira financeira significativa à participação.",
    recommendedAction: "Não priorizar. Reavaliar somente com estrutura de capital dedicada.",
    confirmed: false,
    policyConflict: { criterion: "Garantia máxima", policyValue: "≤ 3%", editalValue: "7%", status: "violation" },
  },
  {
    id: "f_gamma_3",
    title: "Prazo de proposta crítico",
    severity: "medium",
    quality: "E2",
    what: "Somente 5 dias úteis para apresentação da proposta.",
    where: { page: 7, clause: "Cláusula 4.1" },
    quote:
      "O prazo para apresentação das propostas será de 5 (cinco) dias úteis, considerada a natureza emergencial da contratação.",
    why: "Metade do mínimo da política. Inviabiliza análise técnica adequada para um edital deste porte.",
    impact: "Alto — alta probabilidade de erro material na proposta.",
    recommendedAction: "Não recomendável dado o valor e a complexidade do objeto.",
    confirmed: false,
    policyConflict: { criterion: "Prazo mínimo", policyValue: "≥ 10 dias", editalValue: "5 dias", status: "violation" },
  },
]

const GAMMA_COMPARISON: PolicyConflict[] = [
  { criterion: "Prazo mínimo", policyValue: "≥ 10 dias", editalValue: "5 dias", status: "violation" },
  { criterion: "Multa máxima", policyValue: "≤ 10%", editalValue: "18%", status: "violation" },
  { criterion: "Garantia máxima", policyValue: "≤ 3%", editalValue: "7%", status: "violation" },
  { criterion: "Valor máximo", policyValue: "≤ R$ 5M", editalValue: "R$ 8,5M", status: "violation" },
]

const GAMMA: AnalyzedDocument = {
  document: MOCK_DOCUMENTS.doc_gamma,
  decision: {
    recommendation: "NOT_PRIORITY",
    riskScore: { value: 81, band: "high" },
    evidenceQuality: "Baixa",
    conflictsCount: 4,
    mainRisk: "Multa de 18% e garantia de 7% cumulativas criam exposição financeira incompatível com a política.",
    factors: [
      { severity: "critical", label: "Multa de 18% muito acima do teto" },
      { severity: "critical", label: "Garantia de 7% cumulativa" },
      { severity: "medium", label: "Prazo de 5 dias crítico" },
      { severity: "critical", label: "Valor de R$ 8,5M acima do teto" },
    ],
  },
  findings: GAMMA_FINDINGS,
  policyComparison: GAMMA_COMPARISON,
}

export const MOCK_ANALYSES: Analysis[] = [
  {
    id: "an_demo",
    title: "Lote de editais — Agosto/2025",
    orgao: "Múltiplos órgãos",
    valueBRL: 14_100_000,
    status: "completed",
    createdAt: "2025-08-23T12:00:00.000Z",
    updatedAt: "2025-08-23T12:14:00.000Z",
    policyId: "pol_pme",
    policyName: "Padrão PME",
    documents: [ALPHA, BETA, GAMMA],
  },
  {
    id: "an_saude",
    title: "Pregão Eletrônico 112/2025",
    orgao: "Secretaria de Estado da Saúde",
    valueBRL: 3_200_000,
    status: "completed",
    createdAt: "2025-08-21T09:30:00.000Z",
    updatedAt: "2025-08-21T09:42:00.000Z",
    policyId: "pol_pme",
    policyName: "Padrão PME",
    documents: [BETA],
  },
  {
    id: "an_infra",
    title: "Concorrência 009/2025 — Infraestrutura",
    orgao: "Departamento Nacional de Infraestrutura",
    valueBRL: 8_500_000,
    status: "completed",
    createdAt: "2025-08-19T15:10:00.000Z",
    updatedAt: "2025-08-19T15:31:00.000Z",
    policyId: "pol_conservadora",
    policyName: "Conservadora",
    documents: [GAMMA],
  },
]

export const DEMO_ANALYSIS_ID = "an_demo"
