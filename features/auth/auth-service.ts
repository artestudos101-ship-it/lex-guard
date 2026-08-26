import { backendAdapter } from "@/lib/backend-adapter"
import type { RegisterInput } from "./types"
import type { Session } from "@/types/organization"

export const authService = {
  async login(email: string, password: string): Promise<Session> { if (!email || password.length < 8) throw new Error("Informe um e-mail e uma senha válida."); return backendAdapter.login(email, password) },
  async register(input: RegisterInput): Promise<Session> { if (!input.name || !input.email || input.password.length < 8) throw new Error("Confira os dados da conta."); return backendAdapter.register(input) },
  async logout() { return backendAdapter.logout() },
  async getSession() { return backendAdapter.getSession() },
  async forgotPassword(email: string) { if (!email) throw new Error("Informe seu e-mail."); return backendAdapter.forgotPassword(email) },
}
export default authService
