import type { Analysis, AnalysisSummary, AnalyzedDocument } from "@/types"
import { backendAdapter } from "@/lib/backend-adapter"

export async function listAnalyses(): Promise<AnalysisSummary[]> { return backendAdapter.listAnalyses() }
export async function getAnalysis(id: string): Promise<Analysis | null> { return backendAdapter.getAnalysis(id) }
export function pickHeadlineDocument(documents: AnalyzedDocument[]): AnalyzedDocument { return [...documents].sort((a, b) => b.decision.riskScore.value - a.decision.riskScore.value)[0] }
