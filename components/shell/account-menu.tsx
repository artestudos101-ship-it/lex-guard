"use client"

import Link from "next/link"
import { Bell, Command, LogOut, Moon, Search, Settings2, Sun, UserRound } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DEMO_USER, NOTIFICATION_COUNT } from "@/types/organization"
import { useAuth } from "@/features/auth/auth-provider"

export function AccountMenu() {
  const { logout } = useAuth()
  return <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="ghost" className="h-auto w-full justify-start gap-2 px-2 py-1.5" aria-label="Abrir menu da conta" />}>
      <Avatar size="sm"><AvatarFallback className="bg-primary/10 text-primary">{DEMO_USER.initials}</AvatarFallback></Avatar>
      <span className="hidden max-w-28 truncate text-left text-xs font-medium md:block">{DEMO_USER.name}</span>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-64">
      <DropdownMenuGroup><DropdownMenuLabel><div className="flex items-center gap-3 py-1"><Avatar><AvatarFallback className="bg-primary/10 text-primary">{DEMO_USER.initials}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate text-sm font-semibold">{DEMO_USER.name}</p><p className="truncate text-xs text-muted-foreground">{DEMO_USER.email}</p></div></div></DropdownMenuLabel></DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem render={<Link href="/search" />}><Search />Busca global<Command className="ml-auto" /></DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/notifications" />}><Bell />Notificações<span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{NOTIFICATION_COUNT}</span></DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/settings" />}><Settings2 />Configurações</DropdownMenuItem>
        <DropdownMenuItem><Moon />Tema<span className="ml-auto text-xs text-muted-foreground">Sistema</span></DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem render={<Link href="/profile" />}><UserRound />Conta e perfil</DropdownMenuItem>
      <DropdownMenuItem variant="destructive" onClick={() => void logout()}><LogOut />Sair da conta</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}

export function ThemeToggle() { return <Button variant="ghost" size="icon" aria-label="Alternar tema"><Sun /><span className="sr-only">Alternar tema</span></Button> }
