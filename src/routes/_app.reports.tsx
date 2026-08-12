import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/crm/primitives";
import { MONTHLY_REVENUE, LEAD_SOURCE_COUNTS, CONVERSION_TREND } from "@/data/crm";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Phone, TrendingUp, DollarSign, RefreshCw, Radio, UserCheck, Globe, Package, FileSpreadsheet, FileText, Mail } from "lucide-react";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — AY Astute Group CRM" }] }),
  component: Reports,
});

const CARDS = [
  { title: "Calls Report", value: "3,482", delta: "+14%", icon: Phone },
  { title: "Conversion Report", value: "38%", delta: "+4 pts", icon: TrendingUp },
  { title: "Revenue Report", value: "AED 412K", delta: "+9%", icon: DollarSign },
  { title: "Renewal Report", value: "82%", delta: "+3 pts", icon: RefreshCw },
  { title: "Lead Source Report", value: "425", delta: "6 channels", icon: Radio },
  { title: "Caller Performance", value: "5 active", delta: "Priya #1", icon: UserCheck },
  { title: "Country Report", value: "18", delta: "Top: UAE", icon: Globe },
  { title: "Service Report", value: "8 services", delta: "Statutory Audit top", icon: Package },
];

function Reports() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Reports"
        subtitle="Deep insights into revenue, leads, and team performance."
        actions={<>
          <Button variant="outline" className="rounded-xl"><FileSpreadsheet className="mr-1.5 h-4 w-4" />Export Excel</Button>
          <Button variant="outline" className="rounded-xl"><FileText className="mr-1.5 h-4 w-4" />Export PDF</Button>
          <Button className="rounded-xl"><Mail className="mr-1.5 h-4 w-4" />Schedule Email</Button>
        </>}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {CARDS.map((c) => (
          <div key={c.title} className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><c.icon className="h-5 w-5" /></div>
              <span className="text-xs font-medium text-success">{c.delta}</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{c.title}</p>
            <p className="font-display text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Monthly Revenue">
          <div className="h-72">
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
        <SectionCard title="Lead Sources">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={LEAD_SOURCE_COUNTS} dataKey="count" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {LEAD_SOURCE_COUNTS.map((s) => <Cell key={s.source} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Conversion Trend">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CONVERSION_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Line dataKey="rate" stroke="var(--color-success)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Follow-up Calendar Heatmap" description="Last 12 weeks (UI preview)">
          <div className="grid grid-cols-12 gap-1.5">
            {Array.from({ length: 84 }).map((_, i) => {
              const intensity = (i * 37) % 5;
              const bg = ["bg-muted", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary"][intensity];
              return <div key={i} className={`aspect-square rounded ${bg}`} title={`Week ${Math.floor(i / 7) + 1}`} />;
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
            Less
            {["bg-muted", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary"].map((c) => <div key={c} className={`h-3 w-3 rounded ${c}`} />)}
            More
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
