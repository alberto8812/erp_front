"use client"

import Link from "next/link"
import { Bell, ChevronDown, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Settings } from "lucide-react"
import { signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onMenuClick: () => void
  onCollapseToggle: () => void
  collapsed: boolean
  userName?: string
  userEmail?: string
  roles?: string[]
}

export function DashboardHeader({
  onMenuClick,
  onCollapseToggle,
  collapsed,
  userName,
  userEmail,
  roles
}: HeaderProps) {
  const isSysAdmin = roles?.includes("sysAdmin") ?? false
  const roleBadge = isSysAdmin ? "Admin" : "ERP"

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <header className="z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/80 px-6">
      <div className="flex items-center gap-2">
        {/* Mobile menu toggle */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Desktop collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={onCollapseToggle}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notificaciones</span>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 gap-2 px-2 text-muted-foreground hover:text-foreground"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground leading-none">
                  {userName ?? "Usuario"}
                </span>
                <span className="text-[10px] text-primary font-medium">
                  {roleBadge}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName ?? "Usuario"}</p>
                <p className="text-xs text-muted-foreground leading-none">{userEmail ?? ""}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ redirectTo: "/" })}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
