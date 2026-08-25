/**
 * Feature flags. Reads an optional JSON blob from the `FEATURES` env var and
 * falls back to sane defaults so new capabilities can be rolled out gradually.
 */
export interface FeatureFlags {
  demoMode: boolean
  multiDocumentAnalysis: boolean
  policyEditor: boolean
  feedback: boolean
  reports: boolean
}

const DEFAULT_FLAGS: FeatureFlags = {
  demoMode: true,
  multiDocumentAnalysis: true,
  policyEditor: true,
  feedback: true,
  reports: true,
}

function parseFlags(): FeatureFlags {
  const raw = process.env.FEATURES
  if (!raw) return DEFAULT_FLAGS
  try {
    const parsed = JSON.parse(raw) as Partial<FeatureFlags>
    return { ...DEFAULT_FLAGS, ...parsed }
  } catch {
    return DEFAULT_FLAGS
  }
}

export const FEATURES: FeatureFlags = parseFlags()
