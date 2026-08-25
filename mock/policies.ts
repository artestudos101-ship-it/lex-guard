import type { RiskPolicy } from "@/types"

export const MOCK_POLICIES: RiskPolicy[] = [
  {
    id: "pol_pme",
    name: "Padrão PME",
    description:
      "Perfil equilibrado para empresas de médio porte. Tolerância moderada a prazos curtos e garantias contratuais.",
    status: "active",
    version: "v3.2",
    updatedAt: "2025-08-18T13:20:00.000Z",
    rules: {
      minDeadlineDays: 10,
      maxPenaltyPct: 10,
      maxGuaranteePct: 3,
      maxValueBRL: 5_000_000,
      requiresTechnicalQualification: false,
    },
    history: [
      { version: "v3.2", updatedAt: "2025-08-18T13:20:00.000Z", note: "Garantia máxima ajustada para 3%." },
      { version: "v3.1", updatedAt: "2025-06-02T10:00:00.000Z", note: "Prazo mínimo elevado para 10 dias." },
      { version: "v3.0", updatedAt: "2025-03-11T09:30:00.000Z", note: "Revisão anual da política." },
    ],
  },
  {
    id: "pol_conservadora",
    name: "Conservadora",
    description:
      "Baixa tolerância a risco. Exige qualificação técnica e restringe garantias e multas de forma rígida.",
    status: "active",
    version: "v2.0",
    updatedAt: "2025-07-30T16:45:00.000Z",
    rules: {
      minDeadlineDays: 15,
      maxPenaltyPct: 8,
      maxGuaranteePct: 2,
      maxValueBRL: 3_000_000,
      requiresTechnicalQualification: true,
    },
    history: [
      { version: "v2.0", updatedAt: "2025-07-30T16:45:00.000Z", note: "Qualificação técnica passou a ser obrigatória." },
      { version: "v1.4", updatedAt: "2025-04-19T11:15:00.000Z", note: "Valor máximo reduzido para R$ 3M." },
    ],
  },
  {
    id: "pol_alta_margem",
    name: "Alta Margem",
    description:
      "Perfil agressivo para oportunidades de alto valor. Aceita prazos curtos e garantias elevadas em troca de margem.",
    status: "draft",
    version: "v0.9",
    updatedAt: "2025-08-22T08:05:00.000Z",
    rules: {
      minDeadlineDays: 7,
      maxPenaltyPct: 15,
      maxGuaranteePct: 5,
      maxValueBRL: 12_000_000,
      requiresTechnicalQualification: false,
    },
    history: [{ version: "v0.9", updatedAt: "2025-08-22T08:05:00.000Z", note: "Rascunho inicial." }],
  },
]
