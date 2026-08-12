import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CUSTOMERS, TIMELINE_EVENTS, DOCUMENT_TYPES, NOTES_DUMMY } from "@/data/crm";
import { PageHeader, SectionCard, StatusBadge } from "@/components/crm/primitives";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Phone, Mail, ArrowLeft, Upload, Eye, FileText, Send } from "lucide-react";

export const Route = createFileRoute("/_app/customers/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id} — Client — AY Astute Group CRM` }] }),
  component: CustomerDetail,
  notFoundComponent: () => <div className="p-10 text-center text-muted-foreground">Customer not found.</div>,
});

function CustomerDetail() {
  const { id } = Route.useParams();
  const c = CUSTOMERS.find((x) => x.id === id);
  if (!c) throw notFound();

  return (
    <div className="mx-auto max-w-[1400px]">
      <Link to="/customers" className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to customers
      </Link>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <Avatar className="h-20 w-20 shrink-0"><AvatarImage src={c.avatar} /><AvatarFallback>{c.name[0]}</AvatarFallback></Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-bold">{c.name}</h1>
              <StatusBadge status={c.status} />
              <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs">{c.id}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{c.jobTitle} @ {c.company}</p>

            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-xs md:grid-cols-4">
              {[
                ["Phone", c.mobile], ["Email", c.email], ["Nationality", c.nationality], ["TRN", c.trn],
                ["Engagement", c.engagementType], ["Country", c.country], ["City", c.city], ["Lead Source", c.leadSource],
                ["Relationship Partner", c.caller], ["Onboarded", c.createdDate], ["Active Engagement", c.service], ["Renewal", c.expiry],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</p>
                  <p className="mt-0.5 font-medium text-foreground">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button className="rounded-xl bg-success text-success-foreground hover:bg-success/90"><MessageCircle className="mr-1.5 h-4 w-4" />WhatsApp</Button>
            <Button variant="outline" className="rounded-xl"><Phone className="mr-1.5 h-4 w-4" />Call</Button>
            <Button variant="outline" className="rounded-xl"><Mail className="mr-1.5 h-4 w-4" />Email</Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-lg">Timeline</TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg">Documents</TabsTrigger>
          <TabsTrigger value="notes" className="rounded-lg">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SectionCard title="Summary" className="lg:col-span-2">
              <p className="text-sm text-muted-foreground">
                {c.name} is a {c.jobTitle.toLowerCase()} at {c.company} residing in {c.city}. Currently subscribed to <span className="font-semibold text-foreground">{c.service}</span> valid until {c.expiry}.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[{ l: "Lifetime value", v: "AED 42,300" }, { l: "Open invoices", v: "1" }, { l: "Services", v: "3" }, { l: "Follow-ups", v: "7" }].map((s) => (
                  <div key={s.l} className="rounded-xl border p-3">
                    <p className="text-[11px] uppercase text-muted-foreground">{s.l}</p>
                    <p className="mt-1 font-display text-xl font-bold">{s.v}</p>
                  </div>
                ))}
              </div>

              {/* Client Onboarding & Operations Handover Widget */}
              <div className="mt-6 rounded-xl border p-4 bg-success-soft/20 border-success/30">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <p className="font-display text-sm font-bold text-success">
                    ✓ Client Onboarding & Operations Handover Status
                  </p>
                  <span className="rounded-full bg-success text-success-foreground px-2 py-0.5 text-[10px] font-bold">
                    Completed 7/7
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-success font-medium">✓ 1. Welcome Email Sent</div>
                  <div className="flex items-center gap-1.5 text-success font-medium">✓ 2. Signed Engagement Emailed to Operations</div>
                  <div className="flex items-center gap-1.5 text-success font-medium">✓ 3. Kick Off Meeting Conducted</div>
                  <div className="flex items-center gap-1.5 text-success font-medium">✓ 4. Invoice Request Generated</div>
                  <div className="flex items-center gap-1.5 text-success font-medium">✓ 5. Advance Payment Collected (AED)</div>
                  <div className="flex items-center gap-1.5 text-success font-medium">✓ 6. Payment Receipt Issued</div>
                  <div className="flex items-center gap-1.5 text-success font-medium sm:col-span-2">✓ 7. Operations Team Execution Takeover Active</div>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Next actions">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" /> Send FY 2026 audit renewal proposal</li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-warning" /> Collect bank confirmations and related-party schedule</li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success" /> Schedule quarterly check-in</li>
              </ul>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <SectionCard title="Activity Timeline">
            <ol className="relative space-y-5 border-l pl-6">
              {TIMELINE_EVENTS.map((e, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full border bg-card text-primary text-[10px] font-bold">{i + 1}</span>
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-semibold">{e.type}</p>
                    <span className="text-xs text-muted-foreground">{e.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{e.detail}</p>
                </li>
              ))}
            </ol>
          </SectionCard>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DOCUMENT_TYPES.map((d) => (
              <div key={d.type} className="rounded-2xl border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><FileText className="h-5 w-5" /></div>
                  <StatusBadge status={d.status} />
                </div>
                <p className="mt-3 font-semibold">{d.type}</p>
                <p className="text-xs text-muted-foreground">Expiry: {d.expiry}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 rounded-lg"><Upload className="mr-1 h-3.5 w-3.5" />Upload</Button>
                  <Button size="sm" variant="outline" className="flex-1 rounded-lg"><Eye className="mr-1 h-3.5 w-3.5" />Preview</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <SectionCard title="Notes">
            <div className="mb-5 rounded-xl border bg-background p-3">
              <Textarea placeholder="Write a note about this customer…" className="min-h-[80px] resize-none border-0 focus-visible:ring-0" />
              <div className="mt-2 flex justify-end">
                <Button size="sm" className="rounded-lg"><Send className="mr-1.5 h-3.5 w-3.5" />Add Note</Button>
              </div>
            </div>
            <ol className="space-y-4">
              {NOTES_DUMMY.map((n) => (
                <li key={n.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{n.author}</p>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{n.text}</p>
                </li>
              ))}
            </ol>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
