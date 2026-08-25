"use client"

import { useQuery } from "@tanstack/react-query"
import { getAnalysis, listAnalyses } from "@/services/analysis-service"
import { queryKeys } from "./query-keys"

export function useAnalyses() {
  return useQuery({
    queryKey: queryKeys.analyses,
    queryFn: listAnalyses,
  })
}

export function useAnalysis(id: string) {
  return useQuery({
    queryKey: queryKeys.analysis(id),
    queryFn: () => getAnalysis(id),
    enabled: Boolean(id),
  })
}
