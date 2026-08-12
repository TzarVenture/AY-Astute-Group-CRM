import { Search, Bell, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRole, type Role } from "@/lib/role-context";
import { NOTIFICATIONS } from "@/data/crm";

const ROLES: Role[] = ["Admin", "Manager", "Team Leader", "Caller"];

export function TopNav() {
  const { role, setRole } = useRole();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur">
      <SidebarTrigger className="shrink-0" />
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search customers, leads, invoices…" className="h-10 rounded-xl pl-9" />
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden items-center gap-2 rounded-xl border bg-background px-3 py-2 text-xs font-medium hover:bg-accent sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-success" />
            Viewing as <span className="text-primary">{role}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Role preview</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ROLES.map((r) => (
              <DropdownMenuItem key={r} onClick={() => setRole(r)}>
                {r}
                {role === r && <span className="ml-auto text-primary">•</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger className="relative flex h-10 w-10 items-center justify-center rounded-xl border bg-background hover:bg-accent">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-xs text-muted-foreground">You have {NOTIFICATIONS.length} unread updates</p>
            </div>
            <div className="max-h-80 overflow-auto">
              {NOTIFICATIONS.map((n, i) => (
                <div key={i} className="border-b p-3 last:border-0 hover:bg-accent">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.detail}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl border bg-background p-1 pr-3 hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://i.pravatar.cc/80?img=15" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold leading-tight">Sana Al Hashimi</p>
              <p className="text-[10px] text-muted-foreground">{role}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
