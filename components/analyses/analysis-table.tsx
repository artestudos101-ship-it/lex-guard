"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { RecommendationBadge } from "@/components/decision/decision-badges"
import { formatCurrencyBRL, formatRelative } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { AnalysisSummary, RiskScore } from "@/types"

const BAND_DOT: Record<RiskScore["band"], string> = {
  low: "bg-success",
  medium: "bg-warning",
  high: "bg-critical",
}

function bandOf(score: number): RiskScore["band"] {
  if (score >= 67) return "high"
  if (score >= 40) return "medium"
  return "low"
}

export function AnalysisTable({
  rows,
  isLoading,
}: {
  rows?: AnalysisSummary[]
  isLoading?: boolean
}) {
  if (isLoading || !rows) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">Edital</th>
            <th className="hidden px-4 py-2.5 font-medium md:table-cell">Valor</th>
            <th className="px-4 py-2.5 font-medium">Risco</th>
            <th className="px-4 py-2.5 font-medium">Recomendação</th>
            <th className="hidden px-4 py-2.5 font-medium lg:table-cell">Atualizado</th>
            <th className="px-4 py-2.5" aria-hidden />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const band = bandOf(row.riskScore)
            return (
              <tr key={row.id} className="group border-b transition-colors last:border-b-0 hover:bg-muted/40">
                <td className="px-4 py-3">
                  <Link href={`/analyses/${row.id}`} className="flex flex-col gap-0.5">
                    <span className="font-medium text-foreground">{row.title}</span>
                    <span className="text-xs text-muted-foreground">{row.orgao}</span>
                  </Link>
                </td>
                <td className="hidden px-4 py-3 font-mono text-xs tabular-nums text-muted-foreground md:table-cell">
                  {formatCurrencyBRL(row.valueBRL)}
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full", BAND_DOT[band])} aria-hidden />
                    <span className="font-mono tabular-nums text-foreground">{row.riskScore}</span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <RecommendationBadge recommendation={row.recommendation} />
                </td>
                <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                  {formatRelative(row.updatedAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/analyses/${row.id}`}
                    className="inline-flex items-center text-muted-foreground transition-colors group-hover:text-foreground"
                    aria-label={`Abrir ${row.title}`}
                  >
                    <ChevronRight className="size-4" />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
