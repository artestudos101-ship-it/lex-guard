import { DEMO_TENANT, DEMO_USER, MOCK_AUTH, mockDelay, type Session } from "@/types/organization"
import type { RegisterInput } from "./types"

const COOKIE = "lexguard_mock_session"

function setSession(session: Session | null) {
  document.cookie = session ? `${COOKIE}=active; path=/; max-age=604800; SameSite=Lax` : `${COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

export const authService = {
  async login(email: string, password: string) {
    if (!email || password.length < 8) throw new Error("Informe um e-mail e uma senha válida.")
    const session = await MOCK_AUTH.login()
    setSession(session)
    return session
  },
  async register(input: RegisterInput) {
    if (!input.name || !input.email || input.password.length < 8) throw new Error("Confira os dados da conta.")
    const session = await mockDelay({ user: { ...DEMO_USER, id: "usr-new", name: input.name, email: input.email, initials: input.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() }, tenant: { ...DEMO_TENANT, id: "tenant-new", name: input.organization || "Nova Empresa Ltda.", plan: "Ambiente padrão" } })
    setSession(session)
    return session
  },
  async logout() { await MOCK_AUTH.logout(); setSession(null) },
  async getSession() { return document.cookie.includes(`${COOKIE}=active`) ? MOCK_AUTH.login() : null },
  async forgotPassword(email: string) { if (!email) throw new Error("Informe seu e-mail."); await mockDelay(true) },
}
export default authService
