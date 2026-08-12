import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/crm/primitives";
import { FOLLOWUPS } from "@/data/crm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";

export const Route = createFileRoute("/_app/followups")({
  head: () => ({ meta: [{ title: "Follow Ups — AY Astute Group CRM" }] }),
  component: FollowUpsPage,
});

const BUCKETS = ["Today", "Tomorrow", "This Week", "Overdue", "Completed", "All"] as const;

function FollowUpsPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Follow Ups"
        subtitle="Everything that needs a call, message, or check-in."
        actions={<Button className="rounded-xl"><Plus className="mr-1.5 h-4 w-4" />Schedule follow-up</Button>}
      />
      <Tabs defaultValue="Today">
        <TabsList className="rounded-xl">
          {BUCKETS.map((b) => (
            <TabsTrigger key={b} value={b} className="rounded-lg">{b}</TabsTrigger>
          ))}
        </TabsList>
        {BUCKETS.map((b) => {
          const rows = b === "All" ? FOLLOWUPS : FOLLOWUPS.filter((f) => f.bucket === b);
          return (
            <TabsContent key={b} value={b} className="mt-4">
              <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Scheduled Time</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Assigned Caller</TableHead>
                      <TableHead>Reminder</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Follow-up</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">Nothing scheduled here.</TableCell></TableRow>
                    ) : rows.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell><p className="text-sm font-medium">{f.customer}</p><p className="font-mono text-[11px] text-muted-foreground">{f.customerId}</p></TableCell>
                        <TableCell className="text-xs">{f.time}</TableCell>
                        <TableCell className="text-xs">{f.purpose}</TableCell>
                        <TableCell className="text-xs">{f.caller}</TableCell>
                        <TableCell><span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px]"><Bell className="h-3 w-3" />{f.reminder}</span></TableCell>
                        <TableCell><StatusBadge status={f.status} /></TableCell>
                        <TableCell className="text-xs">{f.nextFollowUp}</TableCell>
                        <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground">{f.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
