import { MOCK_AUTH } from "@/types/organization"
export const authService = { login: MOCK_AUTH.login, logout: MOCK_AUTH.logout, session: async () => MOCK_AUTH.login() }
export default authService
