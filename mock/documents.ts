import type { DocumentPage, EditalDocument } from "@/types"

const SECTIONS = [
  "Do Objeto",
  "Da Participação",
  "Do Credenciamento",
  "Da Proposta de Preços",
  "Da Habilitação Jurídica",
  "Da Qualificação Técnica",
  "Da Qualificação Econômico-Financeira",
  "Do Julgamento",
  "Dos Recursos",
  "Das Garantias Contratuais",
  "Das Sanções Administrativas",
  "Da Execução do Contrato",
  "Do Reajuste e Repactuação",
  "Das Disposições Finais",
]

function sectionTitle(page: number): string {
  return `${SECTIONS[page % SECTIONS.length]} — Seção ${Math.ceil(page / 3)}`
}

function filler(page: number): string[] {
  return [
    `Item ${page}.1 — O presente instrumento convocatório reger-se-á pelas disposições da Lei nº 14.133/2021 e demais normas correlatas, observados os princípios da isonomia, da legalidade e da vinculação ao instrumento convocatório.`,
    `Item ${page}.2 — Os licitantes deverão manter, durante toda a execução contratual, todas as condições de habilitação e qualificação exigidas neste edital, sob pena das sanções previstas na seção própria.`,
    `Item ${page}.3 — Quaisquer pedidos de esclarecimento deverão ser encaminhados ao pregoeiro por meio eletrônico, no prazo estabelecido, não suspendendo os prazos deste certame salvo decisão fundamentada da Administração.`,
  ]
}

/**
 * Builds a full page list of `total` pages and overlays authored pages that
 * contain the exact clauses referenced by the findings.
 */
function buildPages(total: number, authored: Record<number, DocumentPage>): DocumentPage[] {
  const pages: DocumentPage[] = []
  for (let p = 1; p <= total; p++) {
    pages.push(authored[p] ?? { page: p, title: sectionTitle(p), paragraphs: filler(p) })
  }
  return pages
}

// --- Alpha: low risk edital ---------------------------------------------------
const ALPHA_CONTENT = buildPages(24, {
  9: {
    page: 9,
    title: "Do Prazo de Entrega das Propostas",
    paragraphs: [
      "Cláusula 6.1 — O prazo para apresentação das propostas será de 14 (quatorze) dias úteis contados da publicação deste edital, assegurando ampla competitividade ao certame.",
      "Cláusula 6.2 — A sessão pública de abertura ocorrerá em data e horário divulgados no portal, admitida a participação por meio eletrônico.",
    ],
  },
  18: {
    page: 18,
    title: "Das Garantias Contratuais",
    paragraphs: [
      "Cláusula 12.4 — A garantia de execução contratual corresponderá a 2% (dois por cento) do valor global do contrato, em qualquer das modalidades admitidas em lei.",
      "Cláusula 12.5 — A multa por inexecução parcial limitar-se-á a 6% (seis por cento) do valor da parcela inadimplida.",
    ],
  },
})

// --- Beta: medium risk edital (matches the evidence example, clause 14.2 p.37)
const BETA_CONTENT = buildPages(42, {
  11: {
    page: 11,
    title: "Do Prazo de Entrega das Propostas",
    paragraphs: [
      "Cláusula 5.1 — O prazo para apresentação das propostas será de 8 (oito) dias úteis, contados da publicação, em razão da urgência justificada nos autos do processo administrativo.",
      "Cláusula 5.2 — Não serão aceitas propostas apresentadas fora do prazo estipulado no item anterior.",
    ],
  },
  37: {
    page: 37,
    title: "Das Garantias Contratuais",
    paragraphs: [
      "Cláusula 14.2 — A CONTRATADA prestará garantia correspondente a 5% (cinco por cento) do valor total do contrato, no prazo de 10 (dez) dias úteis contados da assinatura, sob pena de aplicação das sanções cabíveis.",
      "Cláusula 14.3 — A garantia responderá pelo integral cumprimento das obrigações contratuais, inclusive multas e encargos trabalhistas eventualmente não adimplidos.",
    ],
  },
  38: {
    page: 38,
    title: "Das Sanções Administrativas",
    paragraphs: [
      "Cláusula 15.1 — A multa moratória será de 8% (oito por cento) sobre o valor da obrigação em atraso, sem prejuízo das demais penalidades legais.",
    ],
  },
})

// --- Gamma: high risk edital --------------------------------------------------
const GAMMA_CONTENT = buildPages(56, {
  7: {
    page: 7,
    title: "Do Prazo de Entrega das Propostas",
    paragraphs: [
      "Cláusula 4.1 — O prazo para apresentação das propostas será de 5 (cinco) dias úteis, considerada a natureza emergencial da contratação.",
    ],
  },
  29: {
    page: 29,
    title: "Das Garantias Contratuais",
    paragraphs: [
      "Cláusula 11.2 — A garantia de execução será equivalente a 7% (sete por cento) do valor global, exigida cumulativamente à garantia da proposta.",
    ],
  },
  44: {
    page: 44,
    title: "Das Sanções Administrativas",
    paragraphs: [
      "Cláusula 18.3 — A multa por inexecução total poderá alcançar 18% (dezoito por cento) do valor contratado, aplicável de forma cumulativa com demais sanções.",
      "Cláusula 18.4 — A Administração poderá reter pagamentos a título de garantia adicional a seu exclusivo critério.",
    ],
  },
})

interface MockDocumentRecord extends EditalDocument {
  content: DocumentPage[]
}

export const MOCK_DOCUMENTS: Record<string, MockDocumentRecord> = {
  doc_alpha: {
    id: "doc_alpha",
    name: "Edital-PE-047-2025-Alpha.pdf",
    sizeBytes: 3_640_000,
    pages: 24,
    status: "ready",
    orgao: "Prefeitura Municipal de Sorocaba",
    content: ALPHA_CONTENT,
  },
  doc_beta: {
    id: "doc_beta",
    name: "Edital-PE-112-2025-Beta.pdf",
    sizeBytes: 7_210_000,
    pages: 42,
    status: "ready",
    orgao: "Secretaria de Estado da Saúde",
    content: BETA_CONTENT,
  },
  doc_gamma: {
    id: "doc_gamma",
    name: "Edital-CC-009-2025-Gamma.pdf",
    sizeBytes: 11_980_000,
    pages: 56,
    status: "ready",
    orgao: "Departamento Nacional de Infraestrutura",
    content: GAMMA_CONTENT,
  },
}
