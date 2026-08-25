"use client"

import { useQuery } from "@tanstack/react-query"
import { getActivity, getDashboardMetrics, getEvaluationMetrics } from "@/services/dashboard-service"
import { queryKeys } from "./query-keys"

export function useDashboardMetrics() {
  return useQuery({ queryKey: queryKeys.dashboardMetrics, queryFn: getDashboardMetrics })
}

export function useActivity() {
  return useQuery({ queryKey: queryKeys.activity, queryFn: getActivity })
}

export function useEvaluationMetrics() {
  return useQuery({ queryKey: queryKeys.evaluation, queryFn: getEvaluationMetrics })
}
