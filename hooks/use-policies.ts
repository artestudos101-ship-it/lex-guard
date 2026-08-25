"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getPolicy, listPolicies, savePolicy } from "@/services/policy-service"
import type { PolicyFormValues } from "@/lib/validation"
import { queryKeys } from "./query-keys"

export function usePolicies() {
  return useQuery({
    queryKey: queryKeys.policies,
    queryFn: listPolicies,
  })
}

export function usePolicy(id: string) {
  return useQuery({
    queryKey: queryKeys.policy(id),
    queryFn: () => getPolicy(id),
    enabled: Boolean(id),
  })
}

export function useSavePolicy(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (values: PolicyFormValues) => savePolicy(id, values),
    onSuccess: (policy) => {
      qc.invalidateQueries({ queryKey: queryKeys.policies })
      qc.setQueryData(queryKeys.policy(policy.id), policy)
    },
  })
}
