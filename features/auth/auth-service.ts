import { DEMO_TENANT, DEMO_USER, MOCK_AUTH, mockDelay, API_ADAPTER, type Session } from "@/types/organization"
import { api } from "@/lib/api-client"
import type { RegisterInput } from "./types"

const COOKIE = "lexguard_mock_session"

type ApiSession = { user: { id: string; name: string; email: string; role?: string }; tenant: { id: string; name: string; plan: string } }

function toSession(data: ApiSession | { id: string; name: string; email: string; tenant_id: string; role: string }): Session {
  const user = "user" in data ? data.user : data
  const tenant = "tenant" in data ? data.tenant : { id: data.tenant_id, name: "Organização", plan: "mvp" }
  const initials = user.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()
  return { user: { ...DEMO_USER, id: user.id, name: user.name, email: user.email, initials, role: (user.role === "owner" ? "admin" : user.role ?? "reviewer") as Session["user"]["role"] }, tenant: { ...DEMO_TENANT, id: tenant.id, name: tenant.name, plan: tenant.plan, initials } }
}

function setSession(session: Session | null) {
  document.cookie = session ? `${COOKIE}=active; path=/; max-age=604800; SameSite=Lax` : `${COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

export const authService = {
  async login(email: string, password: string) {
    if (!email || password.length < 8) throw new Error("Informe um e-mail e uma senha válida.")
    if (API_ADAPTER.mode === "api") {
      const data = await api.post<{ user: { id: string; name: string; email: string }; tenant: { id: string; name: string; plan: string } }>("/api/v1/auth/login", { email, password })
      const session = toSession(data)
      setSession(session)
      return session
    }
    const session = await MOCK_AUTH.login()
    setSession(session)
    return session
  },
  async register(input: RegisterInput) {
    if (!input.name || !input.email || input.password.length < 8) throw new Error("Confira os dados da conta.")
    if (API_ADAPTER.mode === "api") {
      const data = await api.post<{ user: { id: string; name: string; email: string }; tenant: { id: string; name: string; plan: string } }>("/api/v1/auth/register", input)
      const session = toSession(data)
      setSession(session)
      return session
    }
    const session = await mockDelay({ user: { ...DEMO_USER, id: "usr-new", name: input.name, email: input.email, initials: input.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() }, tenant: { ...DEMO_TENANT, id: "tenant-new", name: input.organization || "Nova Empresa Ltda.", plan: "Ambiente padrão" } })
    setSession(session)
    return session
  },
  async logout() {
    if (API_ADAPTER.mode === "api") await api.post("/api/v1/auth/logout", {})
    else await MOCK_AUTH.logout()
    setSession(null)
  },
  async getSession() {
    if (API_ADAPTER.mode === "api") {
      try { return toSession(await api.get<{ id: string; name: string; email: string; tenant_id: string; role: string }>("/api/v1/me")) } catch { return null }
    }
    return document.cookie.includes(`${COOKIE}=active`) ? MOCK_AUTH.login() : null
  },
  async forgotPassword(email: string) { if (!email) throw new Error("Informe seu e-mail."); await mockDelay(true) },
}
export default authService
