import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Send, FileText, Plus, CheckCircle2, Eye, MousePointer } from "lucide-react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/crm/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/email")({
  head: () => ({
    meta: [{ title: "Email Automation & Templates — AY Astute Group CRM" }],
  }),
  component: EmailAutomationPage,
});

function EmailAutomationPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Email Automation & Customizable Templates"
        subtitle="Standardized email communications, dynamic merge tokens, and real-time open/click tracking."
        actions={
          <Button className="rounded-xl" onClick={() => toast.success("Opening template builder...")}>
            <Plus className="mr-1.5 h-4 w-4" /> Create Template
          </Button>
        }
      />

      <SectionCard title="Email Log & Event Delivery Analytics">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient & Company</TableHead>
              <TableHead>Template Used</TableHead>
              <TableHead>Sent Time</TableHead>
              <TableHead>Delivery Status</TableHead>
              <TableHead>Open Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { to: "Tariq Al Mansoori", company: "Apex Global", template: "Corporate Tax Proposal Delivery", sent: "Today, 10:15 AM", status: "Delivered", opened: "Opened (2x)", click: "Clicked Link" },
              { to: "Fatima Al Zaabi", company: "Emirates Logistics", template: "Meeting Confirmation & Calendar Invite", sent: "Today, 09:30 AM", status: "Delivered", opened: "Opened", click: "No click" },
              { to: "Alexander Petrov", company: "Nordic Tech", template: "Thank You & Meeting Notes Summary", sent: "Yesterday", status: "Delivered", opened: "Opened (4x)", click: "Downloaded PDF" },
            ].map((e, i) => (
              <TableRow key={i} className="hover:bg-accent/40">
                <TableCell>
                  <p className="font-bold text-foreground">{e.to}</p>
                  <p className="text-xs text-muted-foreground">{e.company}</p>
                </TableCell>
                <TableCell className="text-xs font-medium text-primary">{e.template}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{e.sent}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-success-soft text-success text-[10px]">{e.status}</Badge>
                </TableCell>
                <TableCell className="text-xs">
                  <span className="font-semibold text-success flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {e.opened}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">{e.click}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" onClick={() => toast.info(`Resending email to ${e.to}...`)}>
                    Resend Email
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
