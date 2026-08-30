"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, FileSearch, FileStack, Gauge, LayoutDashboard, ShieldCheck, Users, UsersRound } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { AccountMenu } from "./account-menu"
import { LexGuardMark } from "@/components/brand/lexguard-logo"
import { DEMO_TENANT, PRODUCT_TAGLINE, PRODUCT_NAME } from "@/types/organization"

const GROUPS = [
  { label: "Visão geral", items: [{ title: "Painel", href: "/dashboard", icon: LayoutDashboard }] },
  { label: "Execução", items: [{ title: "Minhas análises", href: "/analyses", icon: FileSearch }, { title: "Pacotes de decisão", href: "/reports", icon: FileStack }] },
  { label: "Governança", items: [{ title: "Políticas de risco", href: "/policies", icon: ShieldCheck }, { title: "Avaliação", href: "/evaluation", icon: Gauge }] },
  { label: "Equipe", items: [{ title: "Times", href: "/teams", icon: UsersRound }, { title: "Usuários", href: "/users", icon: Users }, { title: "Atividade", href: "/activity", icon: Activity }] },
]

function isActive(pathname: string, href: string) { return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`) }

export function AppSidebar() {
  const pathname = usePathname()
  return <Sidebar collapsible="icon">
    <SidebarHeader>
      <div className="flex items-center gap-2.5 px-1 py-1.5"><LexGuardMark className="size-8 shrink-0" /><div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden"><span className="text-sm font-semibold tracking-tight">{PRODUCT_NAME}</span><span className="text-xs text-sidebar-foreground/60">{PRODUCT_TAGLINE}</span></div></div>
      <div className="mx-1 flex items-center gap-2 rounded-md border border-sidebar-border/70 bg-sidebar-accent/50 p-2 group-data-[collapsible=icon]:hidden"><div className="flex size-7 items-center justify-center rounded bg-sidebar-primary/20 text-[10px] font-semibold text-sidebar-primary">{DEMO_TENANT.initials}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{DEMO_TENANT.name}</p><p className="text-[10px] text-sidebar-foreground/60">{DEMO_TENANT.plan}</p></div></div>
    </SidebarHeader>
    <SidebarContent>{GROUPS.map((group) => <SidebarGroup key={group.label}><SidebarGroupLabel>{group.label}</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{group.items.map((item) => <SidebarMenuItem key={item.href}><SidebarMenuButton isActive={isActive(pathname, item.href)} tooltip={item.title} render={<Link href={item.href}><item.icon /><span>{item.title}</span>{item.title === "Atividade" ? <span className="ml-auto text-[10px] text-sidebar-foreground/50">248</span> : null}</Link>} /></SidebarMenuItem>)}</SidebarMenu></SidebarGroupContent></SidebarGroup>)}</SidebarContent>
    <SidebarFooter><AccountMenu /></SidebarFooter>
  </Sidebar>
}
