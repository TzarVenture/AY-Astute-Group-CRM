import { createContext, useContext, useState, type ReactNode } from "react";

export type Role = "Admin" | "Manager" | "Team Leader" | "Caller";

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleContextValue>({
  role: "Admin",
  setRole: () => {},
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("Admin");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export const useRole = () => useContext(RoleContext);

export const ROLE_MENU: Record<Role, string[]> = {
  Admin: [
    "Dashboard",
    "Leads",
    "Customers",
    "Telesales Journey",
    "Services",
    "Follow Ups",
    "Invoices",
    "Payments",
    "Reports",
    "Settings",
    "Future Modules",
  ],
  Manager: [
    "Dashboard",
    "Leads",
    "Customers",
    "Telesales Journey",
    "Services",
    "Follow Ups",
    "Invoices",
    "Payments",
    "Reports",
    "Settings",
  ],
  "Team Leader": [
    "Dashboard",
    "Leads",
    "Customers",
    "Telesales Journey",
    "Follow Ups",
    "Reports",
  ],
  Caller: [
    "Dashboard",
    "Leads",
    "Customers",
    "Telesales Journey",
    "Follow Ups",
  ],
};
