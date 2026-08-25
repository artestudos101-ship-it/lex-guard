"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { generateReport, listReports } from "@/services/report-service"
import type { DecisionPackageType } from "@/types"
import { queryKeys } from "./query-keys"

export function useReports() {
  return useQuery({
    queryKey: queryKeys.reports,
    queryFn: listReports,
  })
}

export function useGenerateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ analysisId, type }: { analysisId: string; type: DecisionPackageType }) =>
      generateReport(analysisId, type),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.reports })
    },
  })
}
