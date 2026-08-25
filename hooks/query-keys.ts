export const queryKeys = {
  policies: ["policies"] as const,
  policy: (id: string) => ["policy", id] as const,
  analyses: ["analyses"] as const,
  analysis: (id: string) => ["analysis", id] as const,
  document: (id: string) => ["document", id] as const,
  documentPage: (id: string, page: number) => ["document", id, "page", page] as const,
  reports: ["reports"] as const,
  dashboardMetrics: ["dashboard", "metrics"] as const,
  activity: ["dashboard", "activity"] as const,
  evaluation: ["dashboard", "evaluation"] as const,
}
