import Link from "next/link"
import { Bell, Plus, Search } from "lucide-react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "./app-sidebar"
import { AccountMenu } from "./account-menu"
interface AppShellProps { children: React.ReactNode; title: string; description?: string; action?: React.ReactNode; cta?: string }
export function AppShell({ children, title, description, action }: AppShellProps) { return <SidebarProvider><AppSidebar /><SidebarInset><header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-sm md:px-6"><SidebarTrigger className="-ml-1" /><Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-5" /><div className="flex min-w-0 flex-col"><h1 className="truncate text-sm font-semibold tracking-tight md:text-base">{title}</h1>{description ? <p className="truncate text-xs text-muted-foreground">{description}</p> : null}</div><div className="ml-auto flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="Buscar" render={<Link href="/search" />}><Search /></Button><Button variant="ghost" size="icon" aria-label="Notificações" render={<Link href="/notifications" />}><Bell /><span className="absolute mb-5 ml-5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">3</span></Button>{action ?? <Button size="sm" render={<Link href="/analyses/new" />}><Plus data-icon="inline-start" /> Nova análise</Button>}<AccountMenu /></div></header><main className="flex-1 p-4 md:p-6">{children}</main></SidebarInset></SidebarProvider> }
