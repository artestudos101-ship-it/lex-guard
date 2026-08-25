import type { RiskPolicy } from "@/types"
import { MOCK_POLICIES } from "@/mock/policies"
import type { PolicyFormValues } from "@/lib/validation"
import { delay } from "./util"

// In-memory store so edits persist across navigation within a session.
let store: RiskPolicy[] = MOCK_POLICIES.map((p) => ({ ...p, rules: { ...p.rules } }))

export async function listPolicies(): Promise<RiskPolicy[]> {
  return delay(
    store.map((p) => ({ ...p, rules: { ...p.rules } })),
    400,
  )
}

export async function getPolicy(id: string): Promise<RiskPolicy | null> {
  const found = store.find((p) => p.id === id) ?? null
  return delay(found ? { ...found, rules: { ...found.rules } } : null, 300)
}

export async function savePolicy(id: string, values: PolicyFormValues): Promise<RiskPolicy> {
  const idx = store.findIndex((p) => p.id === id)
  const now = new Date().toISOString()
  if (idx === -1) {
    const created: RiskPolicy = {
      id: `pol_${Date.now()}`,
      name: values.name,
      description: values.description ?? "",
      status: "draft",
      version: "v0.1",
      updatedAt: now,
      rules: { ...values.rules },
      custom: true,
      history: [{ version: "v0.1", updatedAt: now, note: "Política criada." }],
    }
    store = [created, ...store]
    return delay(created, 500)
  }
  const prev = store[idx]
  const nextVersion = bumpVersion(prev.version)
  const updated: RiskPolicy = {
    ...prev,
    name: values.name,
    description: values.description ?? prev.description,
    rules: { ...values.rules },
    version: nextVersion,
    updatedAt: now,
    history: [{ version: nextVersion, updatedAt: now, note: "Regras atualizadas." }, ...(prev.history ?? [])],
  }
  store[idx] = updated
  return delay({ ...updated, rules: { ...updated.rules } }, 500)
}

function bumpVersion(version: string): string {
  const match = version.match(/^v(\d+)\.(\d+)$/)
  if (!match) return "v1.0"
  const major = Number(match[1])
  const minor = Number(match[2]) + 1
  return `v${major}.${minor}`
}
