import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "success" | "warning" | "danger" | "primary" | "muted" | "info";

const TONE_MAP: Record<Tone, string> = {
  success: "bg-success-soft text-success border-success/20",
  warning: "bg-warning-soft text-warning border-warning/20",
  danger: "bg-destructive-soft text-destructive border-destructive/20",
  primary: "bg-primary-soft text-primary border-primary/20",
  muted: "bg-muted text-muted-foreground border-border",
  info: "bg-accent text-accent-foreground border-border",
};

const STATUS_TONE: Record<string, Tone> = {
  // Success / High Intent
  Active: "success",
  Verified: "success",
  Paid: "success",
  Completed: "success",
  Converted: "success",
  Renewed: "success",
  Interested: "success",
  "Appointment Fixed": "success",
  "Existing Client": "success",

  // Warning / In-progress
  Pending: "warning",
  "Pending Docs": "warning",
  Expiring: "warning",
  Callback: "warning",
  "Call Back": "warning",
  "Hot Follow-up": "warning",
  Partial: "warning",
  Scheduled: "warning",
  Uploaded: "warning",

  // Danger / Negative
  Expired: "danger",
  Overdue: "danger",
  Missed: "danger",
  "Not Interested": "danger",
  Closed: "danger",
  DND: "danger",

  // Primary / Actionable
  New: "primary",
  Called: "primary",
  Renewal: "primary",
  "Future Follow-up": "primary",

  // Info / Informational
  Prospect: "info",
  "Already Contacted": "info",
  "Not Contacted": "muted",
  Optional: "muted",
  Inactive: "muted",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = STATUS_TONE[status] ?? "muted";
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
      TONE_MAP[tone],
      className,
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full",
        tone === "success" && "bg-success",
        tone === "warning" && "bg-warning",
        tone === "danger" && "bg-destructive",
        tone === "primary" && "bg-primary",
        tone === "info" && "bg-secondary",
        tone === "muted" && "bg-muted-foreground",
      )} />
      {status}
    </span>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionCard({ title, description, action, children, className }: { title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border bg-card shadow-sm", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            {title && <h2 className="font-display text-base font-semibold">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export function KpiCard({ label, value, delta, tone = "primary", icon: Icon }: { label: string; value: string | number; delta?: string; tone?: Tone; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">{value}</p>
          {delta && <p className="mt-1 text-xs text-muted-foreground">{delta}</p>}
        </div>
        {Icon && (
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", TONE_MAP[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
    </div>
  );
}

export function EmptyState({ title, description, icon: Icon }: { title: string; description?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-14 text-center">
      {Icon && <Icon className="mb-3 h-8 w-8 text-muted-foreground" />}
      <p className="font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

export function FuturePlaceholder({ title, icon: Icon }: { title: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card to-primary-soft/40 p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">Future Integration</p>
      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary">
        Coming in Phase 2
      </div>
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
    </div>
  );
}
