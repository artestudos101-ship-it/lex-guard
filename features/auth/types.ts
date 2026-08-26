import type { Session, Tenant, User } from "@/types/organization"

export type AuthStatus = "loading" | "authenticated" | "unauthenticated"
export type RegisterInput = { name: string; email: string; password: string; organization: string; role: string }
export type AuthContextValue = { status: AuthStatus; session: Session | null; login: (email: string, password: string) => Promise<Session>; register: (input: RegisterInput) => Promise<Session>; logout: () => Promise<void>; forgotPassword: (email: string) => Promise<void> }
export type { Session, Tenant, User }
