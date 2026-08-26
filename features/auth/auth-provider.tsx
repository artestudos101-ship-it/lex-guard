"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import authService from "./auth-service"
import type { AuthContextValue, RegisterInput } from "./types"

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading")
  const [session, setSession] = useState<AuthContextValue["session"]>(null)
  useEffect(() => { authService.getSession().then((current) => { setSession(current); setStatus(current ? "authenticated" : "unauthenticated") }) }, [])
  async function login(email: string, password: string) { const next = await authService.login(email, password); setSession(next); setStatus("authenticated"); return next }
  async function register(input: RegisterInput) { const next = await authService.register(input); setSession(next); setStatus("authenticated"); return next }
  async function logout() { await authService.logout(); setSession(null); setStatus("unauthenticated"); router.push("/login") }
  async function forgotPassword(email: string) { await authService.forgotPassword(email) }
  return <AuthContext.Provider value={{ status, session, login, register, logout, forgotPassword }}>{children}</AuthContext.Provider>
}

export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used inside AuthProvider"); return value }
export function useCurrentUser() { return useAuth().session?.user ?? null }
export function useCurrentTenant() { return useAuth().session?.tenant ?? null }
