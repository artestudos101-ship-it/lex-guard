"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileSearch,
  LayoutDashboard,
  ShieldCheck,
  FileStack,
  Gauge,
  ScrollText,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV = [
  { title: "Painel", href: "/", icon: LayoutDashboard },
  { title: "Análises", href: "/analyses", icon: FileSearch },
  { title: "Políticas de risco", href: "/policies", icon: ShieldCheck },
  { title: "Pacotes de decisão", href: "/reports", icon: FileStack },
  { title: "Avaliação", href: "/evaluation", icon: Gauge },
]

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-1 py-1.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ScrollText className="size-4.5" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">LexGuard</span>
            <span className="text-xs text-sidebar-foreground/60">Copiloto de risco</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(pathname, item.href)}
                    tooltip={item.title}
                    render={
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="rounded-md border border-sidebar-border/60 bg-sidebar-accent/40 p-3 text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
          <p className="font-medium text-sidebar-foreground">Modo demonstração</p>
          <p className="mt-0.5 leading-relaxed">Dados simulados para avaliação do fluxo de decisão.</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
