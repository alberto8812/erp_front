"use client";

import type React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { FlotingChat } from "@/app/chatbot/ui/FlotingChat";

interface DashboardShellProps {
  children: React.ReactNode;
  roles?: string[];
  userName?: string;
  userEmail?: string;
}

export function DashboardShell({ children, roles, userName, userEmail }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        onClose={() => setSidebarOpen(false)}
        pathname={pathname}
        roles={roles}
        userName={userName}
        userEmail={userEmail}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <FlotingChat />
        <DashboardHeader
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onCollapseToggle={() => setSidebarCollapsed((v) => !v)}
          collapsed={sidebarCollapsed}
          userName={userName}
          userEmail={userEmail}
          roles={roles}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
