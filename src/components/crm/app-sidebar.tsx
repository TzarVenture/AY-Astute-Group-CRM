import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, UserPlus, Package, PhoneCall, BarChart3, Settings, Receipt, CreditCard, Sparkles, MessageCircle, Mail, Bot, GitMerge
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useRole, ROLE_MENU } from "@/lib/role-context";

const ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Telesales Journey", url: "/telesales", icon: GitMerge },
  { title: "Services", url: "/services", icon: Package },
  { title: "Follow Ups", url: "/followups", icon: PhoneCall },
  { title: "Invoices", url: "/invoices", icon: Receipt },
  { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Future Modules", url: "/future", icon: Sparkles },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role } = useRole();
  const allowed = ROLE_MENU[role];

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-sm">
            <span className="font-display text-sm font-bold">A</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display text-sm font-bold leading-tight">AY Astute Group</p>
              <p className="truncate text-[10px] font-semibold text-primary">MOE Auditor · FTA Agency No. 1002345678</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ITEMS.filter((i) => (allowed as readonly string[]).includes(i.title)).map((item) => {
                const active = pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url as any} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        {!collapsed ? (
          <div className="rounded-xl bg-primary-soft/60 p-3 text-xs">
            <p className="font-semibold text-primary">Need help?</p>
            <p className="mt-0.5 text-muted-foreground">Chat with our success team.</p>
          </div>
        ) : (
          <div className="h-8" />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
