import { createFileRoute } from "@tanstack/react-router";
import {
  UserPlus, ThumbsUp, Phone, ThumbsDown, PhoneMissed, TrendingUp,
  AlertTriangle, Clock3, CalendarClock, ShieldCheck, Award, Building2
} from "lucide-react";
import { KpiCard, PageHeader, SectionCard } from "@/components/crm/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AY Astute Group CRM" },
      { name: "description", content: "Executive operations dashboard for AY Astute Group." },
    ],
  }),
  component: Dashboard,
});

const KPIS = [
  { label: "Today's Leads", value: 45, tone: "primary" as const, icon: UserPlus, delta: "Daily inbound queue" },
  { label: "Interested", value: 12, tone: "success" as const, icon: ThumbsUp, delta: "26.6% conversion intent" },
  { label: "Today's Follow-ups", value: 18, tone: "primary" as const, icon: Phone, delta: "Scheduled for callers" },
  { label: "Not Interested", value: 8, tone: "danger" as const, icon: ThumbsDown, delta: "17.7% of today's leads" },
  { label: "Callback Pending", value: 6, tone: "warning" as const, icon: PhoneMissed, delta: "Requires rep assignment" },
  { label: "Converted / Ready", value: 5, tone: "success" as const, icon: TrendingUp, delta: "Ready for meeting / deal" },
];

const MONTHLY_REVENUE = [
  { month: "Aug", revenue: 210000 },
  { month: "Sep", revenue: 285000 },
  { month: "Oct", revenue: 340000 },
  { month: "Nov", revenue: 310000 },
  { month: "Dec", revenue: 420000 },
  { month: "Jan", revenue: 390000 },
  { month: "Feb", revenue: 480000 },
];

const LEAD_SOURCES = [
  { source: "Google Ads", count: 42, color: "var(--color-primary)" },
  { source: "Referrals", count: 28, color: "var(--color-success)" },
  { source: "LinkedIn", count: 18, color: "var(--color-secondary)" },
  { source: "Exhibitions", count: 12, color: "var(--color-warning)" },
  { source: "Website", count: 10, color: "var(--color-chart-4)" },
];

const RECENT_ACTIVITIES = [
  { time: "09:10 AM", text: "Caller-A: Lead Created (Apex Global Trading)" },
  { time: "09:20 AM", text: "Caller-B: Follow-up Completed (Emirates Logistics)" },
  { time: "09:45 AM", text: "Caller-C: Service Renewed (Royal Crest Real Estate)" },
  { time: "10:00 AM", text: "Payment Received — AED 26,250 (Capital Health UAE)" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Real-time operational snapshot of customer lifecycle, sales, and audit engagements."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Exported report!")}>
            Export Executive Report
          </Button>
        }
      />

      {/* Brand Credentials Top Header */}
      <div className="mb-6 rounded-2xl border bg-gradient-to-r from-primary/10 via-card to-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
              AY
            </div>
            <div>
              <p className="font-display font-bold text-foreground">AY Astute Group (AY CA Auditing LLC · Astute Tax Consultancy LLC)</p>
              <p className="text-xs text-muted-foreground">
                MOE Approved Registered Auditor · FTA Approved Tax Agency No. 1002345678 · FinAce Belgium SAP Partner
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs border-primary/40 font-semibold">
              Dubai & Abu Dhabi Offices
            </Badge>
            <Badge variant="secondary" className="text-xs text-success bg-success-soft font-semibold">
              UAE E-Invoicing Ready
            </Badge>
          </div>
        </div>
      </div>

      {/* Executive 6 KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Monthly Revenue Trend (AED)" description="Billed revenue from audit & tax client retainers">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_REVENUE}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Lead Source Distribution" description="This month's acquisition channels">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={LEAD_SOURCES} dataKey="count" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {LEAD_SOURCES.map((s) => (
                    <Cell key={s.source} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 space-y-1">
            {LEAD_SOURCES.slice(0, 3).map((s) => (
              <div key={s.source} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.source}
                </span>
                <span className="font-semibold">{s.count} leads</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Bottom Row: Activity Feed & Renewal Alert Badges */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Activity Feed */}
        <SectionCard className="lg:col-span-2" title="Real-Time Activity Feed" description="Live operational updates across all teams">
          <div className="space-y-2.5">
            {RECENT_ACTIVITIES.map((act) => (
              <div key={act.time} className="flex items-center justify-between rounded-xl border p-3 text-xs bg-card">
                <span className="font-bold text-primary font-mono">{act.time}</span>
                <span className="text-foreground font-medium flex-1 ml-3">{act.text}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Contract Renewal & Expiry Alerts */}
        <SectionCard title="Contract Renewal & Expiry Alerts" description="Contract renewal & escalation queue">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border p-3 border-warning/40 bg-warning-soft/30">
              <div className="flex items-center gap-2.5">
                <CalendarClock className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-bold text-xs">11 Renewals Due</p>
                  <p className="text-[10px] text-muted-foreground">Within next 30 days</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-warning-soft text-warning font-bold">
                Orange Alert
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-3 border-destructive/40 bg-destructive-soft/30">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="font-bold text-xs">15 Services Expired</p>
                  <p className="text-[10px] text-muted-foreground">Requires recovery call</p>
                </div>
              </div>
              <Badge variant="destructive" className="font-bold">
                Red Alert
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-3 border-destructive/40 bg-destructive-soft/30">
              <div className="flex items-center gap-2.5">
                <Clock3 className="h-5 w-5 text-destructive" />
                <div>
                  <p className="font-bold text-xs">3 Follow-ups Overdue</p>
                  <p className="text-[10px] text-muted-foreground">Escalated to Team Leader</p>
                </div>
              </div>
              <Badge variant="destructive" className="font-bold">
                Escalated
              </Badge>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
