import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatusBadge } from "@/components/crm/primitives";
import { USERS_LIST, AUDIT_LOG, SERVICE_CATALOGUE } from "@/data/crm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — AY Astute Group CRM" }] }),
  component: Settings,
});

const TABS = ["Role Management", "Users", "Permissions", "Notification Rules", "Service Catalogue", "Pricing", "Audit Log", "System Preferences"];

function Settings() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Settings" subtitle="Configure your workspace, users, permissions, and preferences." />

      <Tabs defaultValue="Role Management">
        <TabsList className="flex-wrap gap-1 rounded-xl">
          {TABS.map((t) => <TabsTrigger key={t} value={t} className="rounded-lg">{t}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="Role Management" className="mt-4">
          <SectionCard title="Roles" description="Define access levels for your team">
            <Table>
              <TableHeader><TableRow><TableHead>Role</TableHead><TableHead>Members</TableHead><TableHead>Modules</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {[{ r: "Admin", m: 2, mod: "All modules" }, { r: "Manager", m: 3, mod: "All except Audit / Roles" }, { r: "Team Leader", m: 4, mod: "Ops modules" }, { r: "Caller", m: 8, mod: "Leads, Customers, Follow-ups" }].map((x) => (
                  <TableRow key={x.r}>
                    <TableCell className="font-medium">{x.r}</TableCell>
                    <TableCell>{x.m}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{x.mod}</TableCell>
                    <TableCell className="text-right"><Button size="sm" variant="outline" className="h-8 rounded-lg">Edit</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Users" className="mt-4">
          <SectionCard title="Team members" action={<Button size="sm" className="rounded-lg"><Plus className="mr-1.5 h-4 w-4" />Invite user</Button>}>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {USERS_LIST.map((u) => (
                  <TableRow key={u.email}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.email}</TableCell>
                    <TableCell className="text-xs">{u.role}</TableCell>
                    <TableCell><StatusBadge status={u.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Permissions" className="mt-4">
          <SectionCard title="Module permissions">
            <div className="space-y-3">
              {["Customers", "Leads", "Services", "Follow-ups", "Reports", "Invoices"].map((m) => (
                <div key={m} className="grid grid-cols-5 items-center gap-3 rounded-xl border p-3 text-sm">
                  <p className="font-medium">{m}</p>
                  {["View", "Create", "Edit", "Delete"].map((a) => (
                    <label key={a} className="flex items-center gap-2 text-xs"><Switch defaultChecked={a !== "Delete"} /> {a}</label>
                  ))}
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Notification Rules" className="mt-4">
          <SectionCard title="Alerts & reminders">
            <div className="space-y-3">
              {["Renewal 30 days before expiry", "Missed follow-up alert", "New lead assignment", "Payment received receipt", "Document expiry reminder"].map((n) => (
                <div key={n} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                  <span>{n}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <label className="flex items-center gap-1.5"><Switch defaultChecked /> Email</label>
                    <label className="flex items-center gap-1.5"><Switch defaultChecked /> WhatsApp</label>
                    <label className="flex items-center gap-1.5"><Switch /> SMS</label>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Service Catalogue" className="mt-4">
          <SectionCard title="Services offered" action={<Button size="sm" className="rounded-lg"><Plus className="mr-1.5 h-4 w-4" />Add service</Button>}>
            <Table>
              <TableHeader><TableRow><TableHead>Service</TableHead><TableHead>Description</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {SERVICE_CATALOGUE.map((s) => (
                  <TableRow key={s.name}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="max-w-[320px] text-xs text-muted-foreground">{s.desc}</TableCell>
                    <TableCell className="text-xs">{s.price}</TableCell>
                    <TableCell><StatusBadge status="Active" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Pricing" className="mt-4">
          <SectionCard title="Pricing rules">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {["Statutory Audit", "Corporate Tax Filing", "VAT Return Filing", "Transfer Pricing"].map((s) => (
                <div key={s} className="rounded-xl border p-4">
                  <p className="font-semibold">{s}</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div><Label className="text-[11px]">Base price (AED)</Label><Input className="mt-1 h-9 rounded-lg" defaultValue="12500" /></div>
                    <div><Label className="text-[11px]">VAT %</Label><Input className="mt-1 h-9 rounded-lg" defaultValue="5" /></div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Audit Log" className="mt-4">
          <SectionCard title="Recent activity">
            <Table>
              <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {AUDIT_LOG.map((a, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs">{a.time}</TableCell>
                    <TableCell className="text-xs font-medium">{a.user}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.action}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        <TabsContent value="System Preferences" className="mt-4">
          <SectionCard title="Workspace preferences">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><Label>Company name</Label><Input className="mt-1 rounded-lg" defaultValue="AY Astute Group" /></div>
              <div><Label>Default currency</Label><Input className="mt-1 rounded-lg" defaultValue="AED" /></div>
              <div><Label>Timezone</Label><Input className="mt-1 rounded-lg" defaultValue="Asia/Dubai (GMT+4)" /></div>
              <div><Label>Fiscal year start</Label><Input className="mt-1 rounded-lg" defaultValue="January" /></div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" className="rounded-lg">Cancel</Button>
              <Button className="rounded-lg">Save preferences</Button>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
