"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { useAuth } from "@/features/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const { login } = useAuth(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [showPassword, setShowPassword] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false)
  async function submit(event: React.FormEvent) { event.preventDefault(); setError(""); setLoading(true); try { await login(email, password); window.location.href = "/" } catch (exception) { setError(exception instanceof Error ? exception.message : "Não foi possível entrar.") } finally { setLoading(false) } }
  async function demo() { setEmail("marina.costa@empresa-demo.com"); setPassword("lexguard-demo") ; setLoading(true); try { await login("marina.costa@empresa-demo.com", "lexguard-demo"); window.location.href = "/" } finally { setLoading(false) } }
  return <main className="flex min-h-screen items-center justify-center bg-background p-4"><Card className="w-full max-w-md"><CardHeader className="gap-4"><div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"><ShieldCheck className="size-5" /></div><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">LexGuard · Copiloto de risco</p><CardTitle className="mt-2 text-2xl">Entre na sua conta</CardTitle><p className="mt-2 text-sm text-muted-foreground">Transforme editais em decisões rastreáveis.</p></div></CardHeader><CardContent><form className="flex flex-col gap-5" onSubmit={submit}><div className="flex flex-col gap-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div><div className="flex flex-col gap-2"><div className="flex items-center justify-between"><Label htmlFor="password">Senha</Label><Link className="text-xs text-primary hover:underline" href="/forgot-password">Esqueci minha senha</Link></div><div className="relative"><Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required className="pr-10" /><button type="button" className="absolute right-3 top-2.5 text-muted-foreground" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>{error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}<Button type="submit" disabled={loading}>{loading ? "Entrando…" : "Entrar"}<ArrowRight data-icon="inline-end" /></Button><Button type="button" variant="outline" onClick={demo} disabled={loading}>Testar com conta de demonstração</Button><p className="text-center text-sm text-muted-foreground">Ainda não tem conta? <Link className="font-medium text-primary hover:underline" href="/register">Criar conta</Link></p></form></CardContent></Card></main>
}
