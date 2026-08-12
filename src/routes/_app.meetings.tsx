import { createFileRoute } from "@tanstack/react-router";
import { Bot, FileText, Sparkles, CheckCircle2, Search, Play, Volume2 } from "lucide-react";
import { PageHeader, SectionCard, KpiCard } from "@/components/crm/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/meetings")({
  head: () => ({
    meta: [{ title: "AI Meeting Assistant — AY Astute Group CRM" }],
  }),
  component: AIMeetingsPage,
});

function AIMeetingsPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="AI Meeting Assistant Integration & KYC Auto-Extraction"
        subtitle="Automatic meeting recording, transcription, summary linking, and KYC form auto-population."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Meetings Transcribed" value="142" tone="primary" icon={Bot} delta="100% auto-linked to CRM" />
        <KpiCard label="KYC Fields Auto-Filled" value="890" tone="success" icon={Sparkles} delta="Zero manual data entry" />
        <KpiCard label="Hours Saved" value="185 hrs" tone="success" icon={CheckCircle2} delta="Telesales efficiency" />
      </div>

      <div className="mt-6">
        <SectionCard title="Recent AI Meeting Summaries & Transcripts">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meeting Topic & Client</TableHead>
                <TableHead>AI Assistant</TableHead>
                <TableHead>Date & Duration</TableHead>
                <TableHead>Auto-Extracted KYC Data</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { title: "Corporate Tax Consultation", client: "Tariq Al Mansoori (Apex Global)", bot: "Read AI Assistant", date: "Today, 11:00 AM (42 mins)", kyc: "Turnover: AED 5M · First Audit Year: 2025 · Tax Residency: UAE" },
                { title: "Statutory Audit Kickoff", client: "Fatima Al Zaabi (Emirates Logistics)", bot: "Otter.ai Bot", date: "Yesterday, 02:00 PM (35 mins)", kyc: "Free Zone: DAFZA · 25 Employees · Audit Due: Dec 2025" },
              ].map((m, i) => (
                <TableRow key={i} className="hover:bg-accent/40">
                  <TableCell>
                    <p className="font-bold text-foreground">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.client}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs font-semibold">{m.bot}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{m.date}</TableCell>
                  <TableCell className="text-xs font-mono text-primary max-w-[280px]">{m.kyc}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" onClick={() => toast.info("Opening AI full transcript...")}>
                      <FileText className="mr-1 h-3.5 w-3.5" /> View Transcript
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>
    </div>
  );
}
