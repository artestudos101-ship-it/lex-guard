import { z } from "zod"

export const policyRulesSchema = z.object({
  minDeadlineDays: z.coerce
    .number({ message: "Informe um número" })
    .int("Use dias inteiros")
    .min(1, "Mínimo de 1 dia")
    .max(120, "Máximo de 120 dias"),
  maxPenaltyPct: z.coerce
    .number({ message: "Informe um número" })
    .min(0, "Não pode ser negativo")
    .max(100, "Máximo de 100%"),
  maxGuaranteePct: z.coerce
    .number({ message: "Informe um número" })
    .min(0, "Não pode ser negativo")
    .max(100, "Máximo de 100%"),
  maxValueBRL: z.coerce
    .number({ message: "Informe um valor" })
    .min(0, "Não pode ser negativo"),
  requiresTechnicalQualification: z.boolean(),
})

export const policyFormSchema = z.object({
  name: z.string().min(3, "Mínimo de 3 caracteres").max(80, "Máximo de 80 caracteres"),
  description: z.string().max(240, "Máximo de 240 caracteres").optional().default(""),
  rules: policyRulesSchema,
})

export type PolicyFormValues = z.infer<typeof policyFormSchema>

const ACCEPTED = ["application/pdf"]

export const uploadFileSchema = z.object({
  name: z.string().min(1),
  type: z.string().refine((t) => ACCEPTED.includes(t), "Apenas arquivos PDF são aceitos"),
  size: z
    .number()
    .max(50 * 1024 * 1024, "Arquivo excede o limite de 50 MB"),
})

export const createAnalysisSchema = z.object({
  policyId: z.string().min(1, "Selecione uma política de risco"),
  documentIds: z.array(z.string()).min(1, "Envie ao menos um documento"),
})

export type CreateAnalysisValues = z.infer<typeof createAnalysisSchema>

export const feedbackSchema = z.object({
  findingId: z.string(),
  verdict: z.enum(["confirm", "reject"]),
  note: z.string().max(500, "Máximo de 500 caracteres").optional(),
})

export type FeedbackValues = z.infer<typeof feedbackSchema>
