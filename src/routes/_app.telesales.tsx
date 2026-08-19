import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitMerge, CheckCircle2, ArrowRight, Calendar, FileText, Send, Mail,
  CreditCard, DollarSign, Handshake, ChevronRight, UserPlus, Clock, Sparkles,
  Phone, MessageSquare, Play, RotateCcw, AlertCircle, ShieldCheck, Award,
  Eye, Filter, XCircle, RefreshCw, Layers, Check, Info, ArrowUpRight,
  TrendingUp, Target, BarChart3, Users, UserCheck
} from "lucide-react";
import { PageHeader, SectionCard, StatusBadge, KpiCard } from "@/components/crm/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { CUSTOMERS, ACTIVE_SERVICES, TELESALES_AGENT_METRICS, type Customer, type ServiceRow, type AgentPerformance, type CustomerNote } from "@/data/crm";

export const Route = createFileRoute("/_app/telesales")({
  head: () => ({
    meta: [
      { title: "Telesales Journey — AY Astute Group CRM" },
      { name: "description", content: "Interactive client presentation of the AY Telesales Workflow." },
    ],
  }),
  component: TelesalesJourneyPage,
});

export interface LeadWorkflowState {
  id: string;
  leadName: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  stage: number; // 1 to 6
  meetingAttended?: boolean;
  meetingCancelled?: boolean;
  cancellationReason?: string;
  rescheduledDate?: string;
  thankYouNoteSent?: boolean;
  thankYouContent?: string;
  proposalSent?: boolean;
  dealClosed?: boolean;
  dealLost?: boolean;
  lossReason?: string;
  calendarInviteSent?: boolean;
  meetingDate?: string;
  meetingTime?: string;
  meetingLocation?: string;
  attendees?: string;
  createdDate?: string; // YYYY-MM-DD
  executionStep?: number; // 1 to 7
}

const INITIAL_DEMO_LEADS: LeadWorkflowState[] = [
  {
    id: "tw-101",
    leadName: "Tariq Al Mansoori",
    company: "Apex Global Trading FZE",
    phone: "+971 50 123 4567",
    email: "tariq@apexglobal.ae",
    service: "Corporate Tax Filing & Audit",
    stage: 4, // Proposal stage
    meetingAttended: true,
    thankYouNoteSent: true,
    proposalSent: true,
    dealClosed: false,
    createdDate: "2026-08-15",
    meetingDate: "2026-08-16",
    meetingTime: "11:00 AM",
  },
  {
    id: "tw-102",
    leadName: "Fatima Al Zaabi",
    company: "Emirates Logistics Solutions",
    phone: "+971 52 987 6543",
    email: "fatima@emirateslogistics.ae",
    service: "Statutory Audit 2025",
    stage: 2, // Appointment Fixed
    meetingAttended: false,
    proposalSent: false,
    calendarInviteSent: true,
    meetingDate: "2026-08-18",
    meetingTime: "02:30 PM",
    createdDate: "2026-08-16",
  },
  {
    id: "tw-103",
    leadName: "Alexander Petrov",
    company: "Nordic Tech Ventures DMCC",
    phone: "+971 55 444 3322",
    email: "a.petrov@nordictech.io",
    service: "Transfer Pricing Documentation",
    stage: 5, // Negotiation / Closing
    meetingAttended: true,
    thankYouNoteSent: true,
    proposalSent: true,
    dealClosed: true,
    executionStep: 4, // Send Invoice Request
    createdDate: "2026-08-10",
  },
  {
    id: "tw-104",
    leadName: "Rashid Al Falasi",
    company: "Gulf Horizon Real Estate",
    phone: "+971 50 888 9911",
    email: "r.falasi@gulfhorizon.ae",
    service: "VAT Return Filing (Quarterly)",
    stage: 1, // Lead Call & Qualification
    createdDate: "2026-08-17",
  },
  {
    id: "tw-105",
    leadName: "Sarah Jenkins",
    company: "Horizon Retail Group LLC",
    phone: "+971 56 222 1100",
    email: "s.jenkins@horizonretail.ae",
    service: "Accounting & Bookkeeping",
    stage: 3, // Meeting Execution
    calendarInviteSent: true,
    meetingDate: "2026-08-17",
    meetingTime: "10:00 AM",
    createdDate: "2026-08-14",
  },
];

const WORKFLOW_STAGES = [
  {
    id: 1,
    title: "1. Lead & Contact",
    subtitle: "Lead Call & Qualification",
    icon: UserPlus,
    color: "border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400",
  },
  {
    id: 2,
    title: "2. Appointment",
    subtitle: "Book & Send Calendar Invite",
    icon: Calendar,
    color: "border-purple-500/30 bg-purple-500/5 text-purple-600 dark:text-purple-400",
  },
  {
    id: 3,
    title: "3. Meeting Execution",
    subtitle: "Attended / Cancelled & Thank You Note",
    icon: CheckCircle2,
    color: "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400",
  },
  {
    id: 4,
    title: "4. Proposal & Quote",
    subtitle: "Custom Quotation Sent",
    icon: FileText,
    color: "border-indigo-500/30 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400",
  },
  {
    id: 5,
    title: "5. Closing Outcome",
    subtitle: "Deal Closed (Won) vs Deal Lost",
    icon: Handshake,
    color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: 6,
    title: "6. Post-Close Handover",
    subtitle: "Operations & Ops Takeover",
    icon: ShieldCheck,
    color: "border-teal-500/30 bg-teal-500/5 text-teal-600 dark:text-teal-400",
  },
];

const POST_CLOSE_STEPS = [
  { step: 1, title: "1. Send Welcome Email", desc: "Automated client onboarding welcome email", icon: Mail },
  { step: 2, title: "2. Email Signed Engagement", desc: "Send engagement letter to audit/tax ops team", icon: FileText },
  { step: 3, title: "3. Kick Off Meeting", desc: "Schedule kickoff meeting with lead auditor & client", icon: Calendar },
  { step: 4, title: "4. Send Invoice Request", desc: "Generate advance billing request in finance", icon: CreditCard },
  { step: 5, title: "5. Collect Advance Payment", desc: "Verify bank transfer / cheque in AED", icon: DollarSign },
  { step: 6, title: "6. Issue Payment Receipt", desc: "Send official VAT payment receipt", icon: CheckCircle2 },
  { step: 7, title: "7. Operations Takeover", desc: "Handover complete — execution team begins work", icon: Award },
];

function TelesalesJourneyPage() {
  const [leads, setLeads] = useState<LeadWorkflowState[]>(INITIAL_DEMO_LEADS);
  const [selectedLead, setSelectedLead] = useState<LeadWorkflowState | null>(null);

  // View Switcher (Pipeline vs Performance Dashboard)
  const [activeView, setActiveView] = useState<"pipeline" | "performance">("pipeline");
  const [perfTimeframe, setPerfTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");

  // Lead Inspector Call Remarks Logger State
  const [inspCategory, setInspCategory] = useState<"Requirement Identified" | "Objection Raised" | "Agreed Action" | "Client Feedback">("Requirement Identified");
  const [inspText, setInspText] = useState("");
  const [inspFollowUp, setInspFollowUp] = useState("2026-08-25");
  const [leadNotesMap, setLeadNotesMap] = useState<Record<string, CustomerNote[]>>({
    "tw-101": [
      {
        id: "n-101",
        agent: "Priya Menon",
        timestamp: "17 Aug 2026, 02:15 PM",
        category: "Requirement Identified",
        text: "Discussed FY 2026 corporate tax retainer scope. Client requested formal quotation for group entity filing.",
        nextFollowUpDate: "2026-08-22",
      },
    ],
    "tw-102": [
      {
        id: "n-102",
        agent: "Priya Menon",
        timestamp: "16 Aug 2026, 11:30 AM",
        category: "Agreed Action",
        text: "Confirmed MS Teams meeting for 20th Aug at 11:00 AM with Audit Director.",
        nextFollowUpDate: "2026-08-20",
      },
    ],
  });

  // Filters State
  const [dateRange, setDateRange] = useState<string>("All"); // All, Today, This Week, This Month
  const [visibleStages, setVisibleStages] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // Modals State
  const [calendarModalLead, setCalendarModalLead] = useState<LeadWorkflowState | null>(null);
  const [thankYouModalLead, setThankYouModalLead] = useState<LeadWorkflowState | null>(null);
  const [cancellationModalLead, setCancellationModalLead] = useState<LeadWorkflowState | null>(null);
  const [dealLostModalLead, setDealLostModalLead] = useState<LeadWorkflowState | null>(null);
  const [customPreviewLead, setCustomPreviewLead] = useState<LeadWorkflowState | null>(null);
  const [lifecycleExplainerOpen, setLifecycleExplainerOpen] = useState<boolean>(false);

  // Calendar Modal Form State
  const [calDate, setCalDate] = useState("2026-08-20");
  const [calTime, setCalTime] = useState("11:00 AM");
  const [calType, setCalType] = useState("MS Teams Virtual Call");
  const [calAttendees, setCalAttendees] = useState("Priya Menon (Sales), K. Ali (Tax Partner)");

  // Thank You Note Form State
  const [tyNoteContent, setTyNoteContent] = useState("");

  // Cancellation & Loss Reasons
  const [cancelReason, setCancelReason] = useState("Client No-Show / Unavailable");
  const [lossReason, setLossReason] = useState("Price High / Budget Constraints");

  // Custom Preview State
  const [previewChannel, setPreviewChannel] = useState<"Email" | "WhatsApp" | "Proposal">("Email");
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");

  // Filtering leads by Date Range
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (dateRange === "Today") return l.createdDate === "2026-08-17";
      if (dateRange === "This Week") return (l.createdDate ?? "").startsWith("2026-08");
      if (dateRange === "This Month") return (l.createdDate ?? "").startsWith("2026-08");
      return true;
    });
  }, [leads, dateRange]);

  function advanceLeadStage(leadId: string, targetStage: number, updates?: Partial<LeadWorkflowState>) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: targetStage, ...updates } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, stage: targetStage, ...updates } : null));
    }
  }

  function advanceExecutionStep(leadId: string, currentStep: number) {
    const nextStep = currentStep + 1;
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, executionStep: nextStep } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, executionStep: nextStep } : null));
    }
    toast.success(`Executed Step ${nextStep}: ${POST_CLOSE_STEPS[nextStep - 1]?.title}`);
  }

  function handleMarkDealClosed(lead: LeadWorkflowState) {
    // 1. Advance lead to Stage 6 & Mark Deal Closed
    advanceLeadStage(lead.id, 6, {
      dealClosed: true,
      dealLost: false,
      executionStep: 1,
    });

    // 2. Auto-promote to Customers list mock
    const newCustomer: Customer = {
      id: `AY-${Math.floor(1000 + Math.random() * 9000)}`,
      name: lead.leadName,
      company: lead.company,
      email: lead.email,
      mobile: lead.phone,
      city: "Dubai",
      country: "UAE",
      status: "Active",
      service: lead.service,
      expiry: "2027-08-31",
      caller: "Priya Menon",
      nationality: "UAE",
      trn: "100299887700003",
      engagementType: "Corporate Tax",
      jobTitle: "Managing Director",
      leadSource: "Telesales Journey",
      createdDate: new Date().toISOString().split("T")[0],
      avatar: `https://i.pravatar.cc/120?u=${lead.id}`,
    };
    CUSTOMERS.unshift(newCustomer);

    // 3. Auto-create Active Service Engagement in Services tab mock
    const newEngagement: ServiceRow = {
      id: `SVC-${Math.floor(1000 + Math.random() * 9000)}`,
      service: `${lead.service} — FY 2026`,
      start: new Date().toISOString().split("T")[0],
      end: "2027-08-31",
      amount: 45000,
      status: "Active",
    };
    ACTIVE_SERVICES.unshift(newEngagement);

    toast.success(`🎉 DEAL CLOSED FOR ${lead.company}!`, {
      description: "Auto-promoted to Customer & Active Service Engagement created in Services tab.",
      duration: 6000,
    });
  }

  function handleSendCalendarInvite() {
    if (!calendarModalLead) return;
    advanceLeadStage(calendarModalLead.id, 3, {
      calendarInviteSent: true,
      meetingDate: calDate,
      meetingTime: calTime,
      meetingLocation: calType,
      attendees: calAttendees,
    });
    setCalendarModalLead(null);
    toast.success(`Calendar Invite Sent to ${calendarModalLead.email}!`, {
      description: `Meeting scheduled for ${calDate} at ${calTime} via ${calType}.`,
    });
  }

  function handleSendThankYouNote() {
    if (!thankYouModalLead) return;
    advanceLeadStage(thankYouModalLead.id, 4, {
      meetingAttended: true,
      thankYouNoteSent: true,
      thankYouContent: tyNoteContent,
    });
    setThankYouModalLead(null);
    toast.success(`Thank You Note Sent to ${thankYouModalLead.leadName}!`, {
      description: "Meeting marked Attended → Advanced to Proposal & Quotation stage.",
    });
  }

  function handleConfirmCancellation() {
    if (!cancellationModalLead) return;
    advanceLeadStage(cancellationModalLead.id, 3, {
      meetingCancelled: true,
      meetingAttended: false,
      cancellationReason: cancelReason,
    });
    setCancellationModalLead(null);
    toast.error(`Meeting marked Cancelled for ${cancellationModalLead.company}`, {
      description: `Reason logged: ${cancelReason}`,
    });
  }

  function handleConfirmDealLost() {
    if (!dealLostModalLead) return;
    advanceLeadStage(dealLostModalLead.id, 5, {
      dealLost: true,
      dealClosed: false,
      lossReason: lossReason,
    });
    setDealLostModalLead(null);
    toast.error(`Deal marked Lost for ${dealLostModalLead.company}`, {
      description: `Reason logged: ${lossReason}`,
    });
  }

  function openCustomPreview(lead: LeadWorkflowState, channel: "Email" | "WhatsApp" | "Proposal") {
    setPreviewChannel(channel);
    setCustomPreviewLead(lead);
    if (channel === "Email") {
      setCustomSubject(`AY Astute Group — ${lead.service} Discussion for ${lead.company}`);
      setCustomBody(`Dear ${lead.leadName},\n\nThank you for speaking with our telesales team regarding ${lead.service} for ${lead.company}.\n\nAY Astute Group is an MOE-approved auditor and FTA-approved tax agency in the UAE.\n\nWe look forward to connecting with you on your scheduled meeting.\n\nBest regards,\nAY Astute Group Telesales Team`);
    } else if (channel === "WhatsApp") {
      setCustomSubject("WhatsApp HSM Template Preview");
      setCustomBody(`Hello ${lead.leadName} 👋\nThis is Priya from AY Astute Group. Following up on our call regarding ${lead.service} for ${lead.company}.\n\nPlease view our company overview brochure here: https://ay-uae.com/brochure.pdf\n\nReply YES to confirm your appointment slot.`);
    } else {
      setCustomSubject(`Commercial Proposal — ${lead.service}`);
      setCustomBody(`CONFIDENTIAL SERVICE QUOTATION\nClient: ${lead.company}\nAttention: ${lead.leadName}\nService Scope: ${lead.service}\n\nAnnual Fee Investment: AED 35,000 + VAT\nDeliverables: MOE Approved Audit Report, FTA Tax Filing, Management Letter.\n\nValidity: 14 Days`);
    }
  }

  function handleAddLeadNote(leadId: string) {
    if (!inspText.trim()) return;
    const newNote: CustomerNote = {
      id: `n-${Date.now()}`,
      agent: "Priya Menon",
      timestamp: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      category: inspCategory,
      text: inspText,
      nextFollowUpDate: inspFollowUp,
    };
    setLeadNotesMap((prev) => ({
      ...prev,
      [leadId]: [newNote, ...(prev[leadId] || [])],
    }));
    setInspText("");
    toast.success("Call remark & interaction note logged successfully!");
  }

  const activeStageList = isFocusMode ? [1] : visibleStages;

  return (
    <div className="mx-auto max-w-[1550px]">
      <PageHeader
        title="AY Telesales Journey — Sales Workflow Engine"
        subtitle="Standardized client conversion pipeline from initial lead call to deal close and operations handover."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl border-primary/30 text-primary hover:bg-primary/5" onClick={() => setLifecycleExplainerOpen(true)}>
              <Info className="mr-1.5 h-4 w-4" /> Customers vs Leads Explainer
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setLeads(INITIAL_DEMO_LEADS)}>
              <RotateCcw className="mr-1.5 h-4 w-4" /> Reset Presentation Demo
            </Button>
          </div>
        }
      />

      {/* Top View Mode Navigation (Sales Pipeline vs Telesales Performance Dashboard) */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border bg-card p-2 shadow-xs">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={activeView === "pipeline" ? "default" : "ghost"}
            className="rounded-xl font-medium text-xs px-4 h-9"
            onClick={() => setActiveView("pipeline")}
          >
            <BarChart3 className="mr-1.5 h-4 w-4" /> 6-Stage Sales Pipeline View
          </Button>
          <Button
            size="sm"
            variant={activeView === "performance" ? "default" : "ghost"}
            className="rounded-xl font-medium text-xs px-4 h-9"
            onClick={() => setActiveView("performance")}
          >
            <TrendingUp className="mr-1.5 h-4 w-4 text-emerald-500" /> Telesales Performance & Funnel Dashboard
          </Button>
        </div>

        <Badge variant="outline" className="text-[10px] text-muted-foreground mr-2">
          {activeView === "pipeline" ? "Showing Active Sales Journey Pipeline" : "Showing Daily/Weekly/Monthly Agent KPIs & Funnel"}
        </Badge>
      </div>

      {/* View Content Switcher */}
      {activeView === "performance" ? (
        <div className="space-y-6">
          {/* Performance Dashboard Top Controls & Timeframe Selector */}
          <div className="rounded-2xl border bg-card p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" /> Telesales Agent & Team Performance Tracker
              </h2>
              <p className="text-xs text-muted-foreground">Monitor daily, weekly, and monthly call activities, meetings, proposals, and sales conversions against targets.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Timeframe:</span>
              {(["daily", "weekly", "monthly"] as const).map((tf) => (
                <Button
                  key={tf}
                  size="sm"
                  variant={perfTimeframe === tf ? "default" : "outline"}
                  className="h-8 rounded-xl text-xs capitalize"
                  onClick={() => setPerfTimeframe(tf)}
                >
                  {tf} View
                </Button>
              ))}
            </div>
          </div>

          {/* 5 Core Metric Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              {
                title: "1. Calls Made",
                val: perfTimeframe === "daily" ? "225 Calls" : perfTimeframe === "weekly" ? "1,120 Calls" : "4,480 Calls",
                sub: "Daily Target: 250",
                icon: Phone,
                color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
              },
              {
                title: "2. Meetings Booked",
                val: perfTimeframe === "daily" ? "35 Booked" : perfTimeframe === "weekly" ? "167 Booked" : "684 Booked",
                sub: "Conversion: 35.6%",
                icon: Calendar,
                color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
              },
              {
                title: "3. Meetings Attended",
                val: perfTimeframe === "daily" ? "27 Attended" : perfTimeframe === "weekly" ? "131 Attended" : "524 Attended",
                sub: "Show Rate: 78.4%",
                icon: CheckCircle2,
                color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
              },
              {
                title: "4. Proposals Sent",
                val: perfTimeframe === "daily" ? "17 Sent" : perfTimeframe === "weekly" ? "85 Sent" : "340 Sent",
                sub: "Quote Rate: 64.9%",
                icon: FileText,
                color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
              },
              {
                title: "5. Sales Closed (Won)",
                val: perfTimeframe === "daily" ? "8 Won" : perfTimeframe === "weekly" ? "39 Won" : "158 Won",
                sub: "Win Rate: 46.4%",
                icon: Award,
                color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground">{c.title}</span>
                  <div className={`p-2 rounded-xl border ${c.color}`}>
                    <c.icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 font-display text-xl font-bold">{c.val}</p>
                <p className="mt-0.5 text-[10px] font-semibold text-primary">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Conversion Rate Funnel Visualization */}
          <SectionCard title="Stage Conversion Rate Funnel (Calls → Booked → Attended → Proposals → Sales Closed)">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {[
                { stage: "Calls Made", count: perfTimeframe === "daily" ? 225 : 1120, pct: "100%", stepPct: "Base Outreach", bg: "bg-blue-600" },
                { stage: "Meetings Booked", count: perfTimeframe === "daily" ? 35 : 167, pct: "35.6%", stepPct: "15.6% of Calls", bg: "bg-purple-600" },
                { stage: "Meetings Attended", count: perfTimeframe === "daily" ? 27 : 131, pct: "78.4%", stepPct: "78.4% of Booked", bg: "bg-amber-600" },
                { stage: "Proposals Sent", count: perfTimeframe === "daily" ? 17 : 85, pct: "64.9%", stepPct: "64.9% of Attended", bg: "bg-indigo-600" },
                { stage: "Sales Closed (Won)", count: perfTimeframe === "daily" ? 8 : 39, pct: "46.4%", stepPct: "46.4% of Proposals (14.1% Overall)", bg: "bg-emerald-600" },
              ].map((fn) => (
                <div key={fn.stage} className="rounded-xl border bg-card p-3 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">{fn.stage}</span>
                    <Badge variant="outline" className="text-[9px] font-mono">{fn.pct}</Badge>
                  </div>
                  <p className="font-display text-lg font-extrabold">{fn.count}</p>

                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div className={`h-full ${fn.bg}`} style={{ width: fn.pct.includes("%") ? fn.pct : "100%" }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{fn.stepPct}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Telesales Agent Leaderboard Table */}
          <SectionCard title="Telesales Agent Performance Leaderboard & Target Achievement">
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="text-xs">
                    <TableHead>Agent Name</TableHead>
                    <TableHead className="text-center">Calls Made</TableHead>
                    <TableHead className="text-center">Meetings Booked</TableHead>
                    <TableHead className="text-center">Meetings Attended</TableHead>
                    <TableHead className="text-center">Proposals Sent</TableHead>
                    <TableHead className="text-center">Sales Closed (Won)</TableHead>
                    <TableHead className="text-right">Revenue (AED)</TableHead>
                    <TableHead className="text-center">Call Target %</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="text-xs">
                  {TELESALES_AGENT_METRICS.map((ag) => (
                    <TableRow key={ag.agentName}>
                      <TableCell className="font-bold">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={ag.avatar} />
                            <AvatarFallback>{ag.agentName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-foreground">{ag.agentName}</p>
                            <p className="text-[10px] text-muted-foreground">Telesales Executive</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center font-mono font-semibold">
                        {ag.callsMade[perfTimeframe]}
                      </TableCell>

                      <TableCell className="text-center font-mono text-purple-600 font-semibold">
                        {ag.meetingsBooked[perfTimeframe]}
                      </TableCell>

                      <TableCell className="text-center font-mono text-amber-600 font-semibold">
                        {ag.meetingsAttended[perfTimeframe]}
                      </TableCell>

                      <TableCell className="text-center font-mono text-indigo-600 font-semibold">
                        {ag.proposalsSent[perfTimeframe]}
                      </TableCell>

                      <TableCell className="text-center font-mono text-emerald-600 font-bold">
                        {ag.salesClosed[perfTimeframe]}
                      </TableCell>

                      <TableCell className="text-right font-mono font-bold text-foreground">
                        AED {ag.revenueGenerated.toLocaleString()}
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full ${ag.targetAchievementRate >= 100 ? "bg-emerald-500" : "bg-primary"}`}
                              style={{ width: `${Math.min(ag.targetAchievementRate, 100)}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-bold">{ag.targetAchievementRate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </div>
      ) : (
        <>
          {/* Control & Filter Toolbar */}
          <div className="mb-6 rounded-2xl border bg-card p-4 shadow-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Date Range Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Date Filter:
              </span>
              {["All", "Today", "This Week", "This Month"].map((range) => (
                <Button
                  key={range}
                  size="sm"
                  variant={dateRange === range ? "default" : "outline"}
                  className="h-8 rounded-xl text-xs"
                  onClick={() => setDateRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>

            {/* Visibility & Focus Mode Configurator */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={isFocusMode ? "default" : "outline"}
                className={`h-8 rounded-xl text-xs font-medium transition ${
                  isFocusMode ? "bg-amber-600 hover:bg-amber-700 text-white" : ""
                }`}
                onClick={() => setIsFocusMode(!isFocusMode)}
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                {isFocusMode ? "Exit Focus Mode (Show All)" : "Lead Focus Mode (Hide Other Columns)"}
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs">
                    <Filter className="mr-1.5 h-3.5 w-3.5" /> Column Visibility ({visibleStages.length}/6)
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 p-3 space-y-2">
                  <p className="text-xs font-bold border-b pb-1.5">Toggle Visible Workflow Stages</p>
                  {WORKFLOW_STAGES.map((stg) => (
                    <div key={stg.id} className="flex items-center gap-2 text-xs">
                      <Checkbox
                        id={`stg-chk-${stg.id}`}
                        checked={visibleStages.includes(stg.id)}
                        onCheckedChange={(chk) => {
                          if (chk) {
                            setVisibleStages([...visibleStages, stg.id].sort());
                          } else {
                            if (visibleStages.length > 1) {
                              setVisibleStages(visibleStages.filter((s) => s !== stg.id));
                            } else {
                              toast.error("At least one stage column must remain visible.");
                            }
                          }
                        }}
                      />
                      <Label htmlFor={`stg-chk-${stg.id}`} className="cursor-pointer text-xs">
                        {stg.title}
                      </Label>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <KpiCard label="Pipeline Leads" value={filteredLeads.length} tone="primary" icon={UserPlus} delta="In active pipeline" />
            <KpiCard label="Appointments Fixed" value={filteredLeads.filter((l) => l.stage >= 2).length} tone="info" icon={Calendar} delta="Meeting scheduled" />
            <KpiCard label="Proposals Out" value={filteredLeads.filter((l) => l.stage >= 4).length} tone="warning" icon={FileText} delta="AED 165,000 value" />
            <KpiCard label="Deals Closed & Executing" value={filteredLeads.filter((l) => l.dealClosed).length} tone="success" icon={Handshake} delta="Auto-synced to Services" />
          </div>

          {/* Visual Interactive Flowchart Strip */}
          <div className="mt-6 rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h2 className="font-display text-base font-bold flex items-center gap-2">
                  <GitMerge className="h-5 w-5 text-primary" /> Interactive Sales Workflow Pipeline
                </h2>
                <p className="text-xs text-muted-foreground">
                  Sequential decision nodes governing telesales outreach, meeting execution, thank-you notes, and closing.
                </p>
              </div>
              <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20">
                Real-Time Automated Sync Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {WORKFLOW_STAGES.map((stg) => (
                <div
                  key={stg.id}
                  className={`rounded-xl border p-3 transition-all ${stg.color} ${
                    activeStageList.includes(stg.id) ? "opacity-100 ring-1 ring-primary/20" : "opacity-40 grayscale"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <stg.icon className="h-4 w-4 shrink-0" />
                    <span className="font-display text-xs font-bold truncate">{stg.title}</span>
                  </div>
                  <p className="mt-1 text-[11px] opacity-80">{stg.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Dynamic Kanban Workflow Columns */}
      <div
        className={`mt-6 grid grid-cols-1 gap-4 ${
          isFocusMode
            ? "grid-cols-1"
            : visibleStages.length === 1
            ? "grid-cols-1"
            : visibleStages.length === 2
            ? "md:grid-cols-2"
            : visibleStages.length === 3
            ? "md:grid-cols-3"
            : visibleStages.length === 4
            ? "md:grid-cols-2 lg:grid-cols-4"
            : visibleStages.length === 5
            ? "md:grid-cols-3 lg:grid-cols-5"
            : "md:grid-cols-3 lg:grid-cols-6"
        }`}
      >
        {WORKFLOW_STAGES.filter((stg) => activeStageList.includes(stg.id)).map((stg) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stg.id);
          return (
            <div key={stg.id} className="flex flex-col rounded-2xl border bg-card p-3 shadow-sm min-h-[480px]">
              <div className="mb-3 flex items-center justify-between border-b pb-2">
                <span className="font-display text-xs font-bold text-foreground">{stg.title}</span>
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  {stageLeads.length}
                </Badge>
              </div>

              <div className="flex-1 space-y-2.5">
                {stageLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    whileHover={{ scale: 1.02 }}
                    className={`cursor-pointer rounded-xl border p-3 shadow-xs transition hover:border-primary ${
                      lead.dealClosed
                        ? "bg-emerald-500/5 border-emerald-500/30"
                        : lead.dealLost
                        ? "bg-rose-500/5 border-rose-500/30"
                        : lead.meetingCancelled
                        ? "bg-amber-500/5 border-amber-500/30"
                        : "bg-background"
                    }`}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-display text-xs font-bold text-foreground line-clamp-1">{lead.leadName}</p>
                      {lead.dealClosed ? (
                        <Badge className="bg-emerald-600 text-white text-[9px] shrink-0">Closed Won 🎉</Badge>
                      ) : lead.dealLost ? (
                        <Badge variant="destructive" className="text-[9px] shrink-0">Deal Lost</Badge>
                      ) : lead.meetingCancelled ? (
                        <Badge variant="outline" className="border-amber-500 text-amber-600 text-[9px] shrink-0">Cancelled</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] shrink-0">Stage {lead.stage}</Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{lead.company}</p>
                    <p className="mt-1.5 text-[10px] font-semibold text-primary">{lead.service}</p>

                    {/* Stage Badges & Milestones */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lead.calendarInviteSent && (
                        <Badge variant="secondary" className="text-[8px] bg-purple-500/10 text-purple-600 border-purple-500/20">
                          📅 Invite Sent ({lead.meetingDate})
                        </Badge>
                      )}
                      {lead.thankYouNoteSent && (
                        <Badge variant="secondary" className="text-[8px] bg-amber-500/10 text-amber-700 border-amber-500/20">
                          ✉️ Thank You Sent
                        </Badge>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t pt-2 text-[10px]">
                      <span className="text-muted-foreground">{lead.phone}</span>
                      <span className="font-bold text-primary flex items-center gap-0.5">
                        Actions <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </motion.div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="flex h-32 items-center justify-center rounded-xl border border-dashed text-center text-xs text-muted-foreground">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Lead Inspector Modal */}
      {selectedLead && (
        <Dialog open={true} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {selectedLead.company}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Stage {selectedLead.stage}: {WORKFLOW_STAGES[selectedLead.stage - 1]?.title}
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold mt-2">{selectedLead.leadName}</DialogTitle>
              <DialogDescription>{selectedLead.phone} · {selectedLead.email} · {selectedLead.service}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Quick Communication Customizer & Preview Launcher */}
              <div className="flex items-center justify-between rounded-xl border bg-muted/40 p-2.5">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" /> Live Communication Simulation:
                </span>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 text-[11px] rounded-lg" onClick={() => openCustomPreview(selectedLead, "Email")}>
                    Email
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[11px] rounded-lg" onClick={() => openCustomPreview(selectedLead, "WhatsApp")}>
                    WhatsApp
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[11px] rounded-lg" onClick={() => openCustomPreview(selectedLead, "Proposal")}>
                    Quotation
                  </Button>
                </div>
              </div>

              {/* Stage Progress Bar */}
              <div className="rounded-xl border p-3 bg-muted/20">
                <p className="text-xs font-semibold mb-2">Workflow Progression Status:</p>
                <div className="flex items-center justify-between text-[11px]">
                  {WORKFLOW_STAGES.map((s) => (
                    <div key={s.id} className="flex flex-col items-center">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          selectedLead.stage >= s.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s.id}
                      </div>
                      <span className="mt-1 text-[9px] text-muted-foreground hidden sm:block">{s.title.split(" ")[1]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage Specific Action Checklist */}
              {selectedLead.stage === 1 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Stage 1: Lead Qualification & Outreach</p>
                  <Button
                    className="w-full justify-between rounded-xl"
                    onClick={() => {
                      setCalendarModalLead(selectedLead);
                    }}
                  >
                    <span>Lead Interested → Set Appointment & Send Calendar Invite</span>
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl text-muted-foreground"
                    onClick={() => {
                      toast.info("Marked for Future Follow-up.");
                      setSelectedLead(null);
                    }}
                  >
                    <span>Not Interested Right Now → Save for Future Follow-up</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {selectedLead.stage === 2 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Stage 2: Appointment Fixing & Calendar Invite</p>
                  {selectedLead.calendarInviteSent ? (
                    <div className="rounded-xl border bg-purple-500/10 p-3 text-xs border-purple-500/20 text-purple-900 dark:text-purple-200">
                      <p className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-purple-600" /> Calendar Invite Sent!
                      </p>
                      <p className="mt-1 text-[11px]">Scheduled for: <strong>{selectedLead.meetingDate} at {selectedLead.meetingTime}</strong> via {selectedLead.meetingLocation}</p>
                      <Button
                        className="mt-2 w-full rounded-xl"
                        onClick={() => advanceLeadStage(selectedLead.id, 3)}
                      >
                        <span>Proceed to Meeting Execution Stage →</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full justify-between rounded-xl"
                      onClick={() => setCalendarModalLead(selectedLead)}
                    >
                      <span>Book Meeting & Launch Calendar Invite Walkthrough</span>
                      <Calendar className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}

              {selectedLead.stage === 3 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-foreground">Stage 3: Meeting Outcome & Thank You Note</p>
                  
                  {/* Differentiated Meeting Outcomes */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => {
                        setTyNoteContent(`Dear ${selectedLead.leadName},\n\nThank you for taking the time to meet with AY Astute Group today to discuss ${selectedLead.service} for ${selectedLead.company}.\n\nAs discussed, our team is preparing a customized proposal tailored to your requirements.\n\nBest regards,\nAY Astute Group Audit & Advisory Team`);
                        setThankYouModalLead(selectedLead);
                      }}
                    >
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Attended
                    </Button>

                    <Button
                      variant="outline"
                      className="rounded-xl border-amber-500/50 text-amber-700 hover:bg-amber-50"
                      onClick={() => {
                        toast.info("Reschedule Calendar Picker Opened");
                        setCalendarModalLead(selectedLead);
                      }}
                    >
                      <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reschedule
                    </Button>

                    <Button
                      variant="outline"
                      className="rounded-xl border-rose-500/50 text-rose-700 hover:bg-rose-50"
                      onClick={() => setCancellationModalLead(selectedLead)}
                    >
                      <XCircle className="mr-1 h-3.5 w-3.5" /> Cancelled
                    </Button>
                  </div>

                  {selectedLead.meetingCancelled && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
                      <strong>Status: Meeting Cancelled</strong>
                      <p className="text-[11px] mt-0.5">Reason: {selectedLead.cancellationReason}</p>
                    </div>
                  )}

                  {selectedLead.thankYouNoteSent && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                      <strong>Thank You Note Sent!</strong>
                      <Button
                        size="sm"
                        className="mt-2 w-full rounded-xl"
                        onClick={() => advanceLeadStage(selectedLead.id, 4)}
                      >
                        <span>Advance to Proposal Stage →</span>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {selectedLead.stage === 4 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Stage 4: Service Quotation & Proposal</p>
                  <Button
                    className="w-full justify-between rounded-xl"
                    onClick={() => {
                      advanceLeadStage(selectedLead.id, 5, { proposalSent: true });
                      toast.success("Proposal & Quotation PDF Dispatched!");
                    }}
                  >
                    <span>Send Proposal & Quotation PDF → Advance to Closing</span>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {selectedLead.stage === 5 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-foreground">Stage 5: Final Negotiation & Closing Outcome</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 h-11"
                      onClick={() => handleMarkDealClosed(selectedLead)}
                    >
                      <Handshake className="mr-1.5 h-4 w-4" /> Mark DEAL CLOSED (Won) 🎉
                    </Button>

                    <Button
                      variant="outline"
                      className="rounded-xl border-rose-500/50 text-rose-700 hover:bg-rose-50 h-11"
                      onClick={() => setDealLostModalLead(selectedLead)}
                    >
                      <XCircle className="mr-1.5 h-4 w-4" /> Mark Deal Lost
                    </Button>
                  </div>
                </div>
              )}

              {selectedLead.stage === 6 && (
                <div className="space-y-3 rounded-xl border p-4 bg-emerald-500/10 border-emerald-500/30">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-sm font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" /> Post-Close Client Onboarding & Handover
                    </p>
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-800 text-[10px]">
                      Step {selectedLead.executionStep ?? 1} of 7
                    </Badge>
                  </div>

                  <div className="rounded-lg border bg-background/80 p-2 text-xs text-muted-foreground flex items-center justify-between">
                    <span>✨ Auto-Created Customer Profile & Active Service Engagement</span>
                    <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200">
                      Synced to Services Tab
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {POST_CLOSE_STEPS.map((s) => {
                      const currentStep = selectedLead.executionStep ?? 1;
                      const isDone = currentStep > s.step;
                      const isCurrent = currentStep === s.step;
                      return (
                        <div
                          key={s.step}
                          className={`flex items-center justify-between rounded-xl border p-2.5 text-xs transition ${
                            isDone
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-200"
                              : isCurrent
                              ? "bg-card border-primary text-foreground shadow-xs font-semibold"
                              : "bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <s.icon className="h-4 w-4" />
                            <div>
                              <p className="font-medium">{s.title}</p>
                              <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                            </div>
                          </div>

                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : isCurrent ? (
                            <Button
                              size="sm"
                              className="h-7 rounded-lg text-[11px]"
                              onClick={() => advanceExecutionStep(selectedLead.id, currentStep)}
                            >
                              Execute Step {s.step}
                            </Button>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">Pending</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Call Remarks & Interaction Notes Logger (Client Requested Feature) */}
              <div className="rounded-xl border bg-card p-3 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" /> Call Remarks & Interaction Log
                  </span>
                  <Badge variant="outline" className="text-[9px] bg-primary/5 text-primary">
                    Agent Logged
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <Label className="text-[10px]">Category</Label>
                    <Select value={inspCategory} onValueChange={(v: any) => setInspCategory(v)}>
                      <SelectTrigger className="h-7 text-xs rounded-lg mt-0.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Requirement Identified">Requirement Identified</SelectItem>
                        <SelectItem value="Objection Raised">Objection Raised</SelectItem>
                        <SelectItem value="Agreed Action">Agreed Action</SelectItem>
                        <SelectItem value="Client Feedback">Client Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px]">Next Follow-Up</Label>
                    <Input type="date" value={inspFollowUp} onChange={(e) => setInspFollowUp(e.target.value)} className="h-7 text-xs rounded-lg mt-0.5" />
                  </div>
                </div>

                <div>
                  <Textarea
                    rows={2}
                    placeholder="Log call remarks, customer requirements, objections, or agreed next actions..."
                    value={inspText}
                    onChange={(e) => setInspText(e.target.value)}
                    className="text-xs rounded-xl resize-none"
                  />
                  <div className="mt-1.5 flex justify-end">
                    <Button size="sm" className="h-7 text-[11px] rounded-lg" onClick={() => handleAddLeadNote(selectedLead.id)}>
                      <Send className="mr-1 h-3 w-3" /> Save Call Note
                    </Button>
                  </div>
                </div>

                {/* Lead Notes Timeline */}
                {leadNotesMap[selectedLead.id] && leadNotesMap[selectedLead.id].length > 0 && (
                  <div className="space-y-2 border-t pt-2 max-h-36 overflow-y-auto">
                    <p className="text-[10px] font-semibold text-muted-foreground">Call Log History ({leadNotesMap[selectedLead.id].length}):</p>
                    {leadNotesMap[selectedLead.id].map((n) => (
                      <div key={n.id} className="rounded-lg border bg-muted/30 p-2 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground border-b pb-1 mb-1">
                          <span className="font-semibold text-foreground">{n.agent} · {n.category}</span>
                          <span>{n.timestamp}</span>
                        </div>
                        <p className="text-[11px]">{n.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedLead(null)}>
                Close Inspector
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 1. Calendar Invite Walkthrough Simulation Modal */}
      {calendarModalLead && (
        <Dialog open={true} onOpenChange={() => setCalendarModalLead(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Book Meeting & Send Calendar Invite
              </DialogTitle>
              <DialogDescription>
                Interactive calendar invite generator for {calendarModalLead.company}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px]">Meeting Date</Label>
                  <Input type="date" value={calDate} onChange={(e) => setCalDate(e.target.value)} className="h-9 text-xs rounded-xl" />
                </div>
                <div>
                  <Label className="text-[11px]">Time Slot (GST)</Label>
                  <Input type="text" value={calTime} onChange={(e) => setCalTime(e.target.value)} className="h-9 text-xs rounded-xl" />
                </div>
              </div>

              <div>
                <Label className="text-[11px]">Meeting Type / Platform</Label>
                <Select value={calType} onValueChange={setCalType}>
                  <SelectTrigger className="h-9 rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MS Teams Virtual Call">MS Teams Virtual Video Call</SelectItem>
                    <SelectItem value="Google Meet">Google Meet Video Call</SelectItem>
                    <SelectItem value="In-Person Office Meeting (Dubai Office)">In-Person Office Meeting (Dubai Office)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[11px]">Participants / Attendees</Label>
                <Input value={calAttendees} onChange={(e) => setCalAttendees(e.target.value)} className="h-9 text-xs rounded-xl" />
              </div>

              {/* Live .ics Calendar Invite Simulation Box */}
              <div className="rounded-xl border bg-muted/40 p-3 text-[11px] space-y-1 font-mono">
                <p className="font-bold text-primary flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> Simulated .ics Calendar Invitation:
                </p>
                <p><strong>To:</strong> {calendarModalLead.email}</p>
                <p><strong>Subject:</strong> AY Astute Group — ${calendarModalLead.service} Kickoff</p>
                <p><strong>When:</strong> {calDate} at {calTime} (Asia/Dubai)</p>
                <p><strong>Location:</strong> {calType}</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCalendarModalLead(null)}>Cancel</Button>
              <Button className="rounded-xl" onClick={handleSendCalendarInvite}>
                <Send className="mr-1.5 h-3.5 w-3.5" /> Dispatch Calendar Invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 2. Thank You Note Workflow Step Modal */}
      {thankYouModalLead && (
        <Dialog open={true} onOpenChange={() => setThankYouModalLead(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-600" /> Compose Post-Meeting Thank You Note
              </DialogTitle>
              <DialogDescription>
                Customize thank-you email before advancing to Proposal stage
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-[11px]">Custom Message Body</Label>
                <Textarea
                  rows={6}
                  value={tyNoteContent}
                  onChange={(e) => setTyNoteContent(e.target.value)}
                  className="rounded-xl text-xs font-sans"
                />
              </div>

              <div className="rounded-xl border bg-emerald-500/10 border-emerald-500/20 p-2.5 text-[11px] text-emerald-900 dark:text-emerald-200">
                <p className="font-bold">Flow Progression:</p>
                <p>Meeting Attended → <strong>Thank You Note Sent</strong> → Proposal Dispatched</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setThankYouModalLead(null)}>Cancel</Button>
              <Button className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" onClick={handleSendThankYouNote}>
                <Send className="mr-1.5 h-3.5 w-3.5" /> Send Note & Move to Proposal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 3. Meeting Cancellation Reason Modal */}
      {cancellationModalLead && (
        <Dialog open={true} onOpenChange={() => setCancellationModalLead(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-600">
                <XCircle className="h-5 w-5" /> Mark Meeting Cancelled
              </DialogTitle>
              <DialogDescription>Log cancellation reason for pipeline audit</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-[11px]">Cancellation Reason</Label>
                <Select value={cancelReason} onValueChange={setCancelReason}>
                  <SelectTrigger className="h-9 rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Client No-Show / Unavailable">Client No-Show / Unavailable</SelectItem>
                    <SelectItem value="Rescheduled by Client to Unknown Date">Rescheduled by Client to Unknown Date</SelectItem>
                    <SelectItem value="Client Cancelled — No Longer Interested">Client Cancelled — No Longer Interested</SelectItem>
                    <SelectItem value="Duplicate Entry">Duplicate Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCancellationModalLead(null)}>Back</Button>
              <Button variant="destructive" className="rounded-xl" onClick={handleConfirmCancellation}>
                Confirm Meeting Cancelled
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 4. Deal Lost Reason Modal */}
      {dealLostModalLead && (
        <Dialog open={true} onOpenChange={() => setDealLostModalLead(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-600">
                <AlertCircle className="h-5 w-5" /> Mark Deal Lost
              </DialogTitle>
              <DialogDescription>Capture lost deal analytics for sales audit</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-[11px]">Primary Loss Reason</Label>
                <Select value={lossReason} onValueChange={setLossReason}>
                  <SelectTrigger className="h-9 rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Price High / Budget Constraints">Price High / Budget Constraints</SelectItem>
                    <SelectItem value="Competitor Selected (Big 4 / Local Firm)">Competitor Selected (Big 4 / Local Firm)</SelectItem>
                    <SelectItem value="Project Postponed to Next FY">Project Postponed to Next FY</SelectItem>
                    <SelectItem value="Unresponsive / Lost Contact">Unresponsive / Lost Contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDealLostModalLead(null)}>Back</Button>
              <Button variant="destructive" className="rounded-xl" onClick={handleConfirmDealLost}>
                Confirm Deal Lost
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 5. Custom Communication Simulation & Live Preview Modal */}
      {customPreviewLead && (
        <Dialog open={true} onOpenChange={() => setCustomPreviewLead(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Customizable Outbound Communication & Live Client Preview
              </DialogTitle>
              <DialogDescription>
                Customize content on the left and see real-time simulated client reception on the right.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2 text-xs">
              {/* Left: Template Editor */}
              <div className="space-y-3 rounded-xl border p-3 bg-muted/20">
                <p className="font-bold text-foreground">Content Editor</p>
                <div>
                  <Label className="text-[11px]">Channel</Label>
                  <Select value={previewChannel} onValueChange={(v: any) => setPreviewChannel(v)}>
                    <SelectTrigger className="h-8 rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email">Email Template</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp Message</SelectItem>
                      <SelectItem value="Proposal">Quotation Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[11px]">Subject / Title</Label>
                  <Input value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} className="h-8 text-xs rounded-xl" />
                </div>
                <div>
                  <Label className="text-[11px]">Message Body</Label>
                  <Textarea rows={6} value={customBody} onChange={(e) => setCustomBody(e.target.value)} className="text-xs rounded-xl" />
                </div>
              </div>

              {/* Right: Live Simulated Client View */}
              <div className="rounded-xl border bg-card p-3 shadow-inner flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <span className="font-bold text-xs text-primary flex items-center gap-1">
                      📱 Live Client View Simulation
                    </span>
                    <Badge variant="outline" className="text-[9px]">{previewChannel}</Badge>
                  </div>

                  <div className="rounded-lg border bg-background p-3 space-y-2 font-sans">
                    <p className="text-[11px] font-bold text-foreground">{customSubject}</p>
                    <p className="text-[11px] text-muted-foreground whitespace-pre-wrap leading-relaxed">{customBody}</p>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t text-[10px] text-muted-foreground text-center">
                  ✨ Powered by SendGrid & Meta WhatsApp Cloud API Integration
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCustomPreviewLead(null)}>Close</Button>
              <Button className="rounded-xl" onClick={() => { toast.success(`Simulated ${previewChannel} sent to client!`); setCustomPreviewLead(null); }}>
                <Send className="mr-1.5 h-3.5 w-3.5" /> Dispatch Test Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 6. Customers vs Leads Data Lifecycle Explainer Modal */}
      {lifecycleExplainerOpen && (
        <Dialog open={true} onOpenChange={() => setLifecycleExplainerOpen(false)}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" /> Data Architecture: Customers vs Leads & Contacts
              </DialogTitle>
              <DialogDescription>
                Visual data lifecycle and background synchronization process across AY Astute Group CRM
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="rounded-xl border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-foreground">Leads & Telesales Journey</h4>
                    <p className="text-[11px] text-muted-foreground">Unqualified prospects undergoing telesales outreach, calls, appointments, and initial quotations.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t pt-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-foreground">Contacts</h4>
                    <p className="text-[11px] text-muted-foreground">Individual decision-makers (CFO, Finance Manager, CEO) associated with Lead or Customer accounts.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t pt-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-foreground">Customers (Contracted Accounts)</h4>
                    <p className="text-[11px] text-muted-foreground">Active, paying client accounts with signed agreements and active service engagements.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-emerald-500/10 border-emerald-500/20 p-3 text-[11px] text-emerald-900 dark:text-emerald-200">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Automatic Background Sync:
                </p>
                <p className="mt-1">When a deal is marked <strong>"DEAL CLOSED (Won)"</strong> in Stage 5, the CRM automatically promotes the lead into the <strong>Customers</strong> database and creates an <strong>Active Service Engagement</strong> in the Services tab.</p>
              </div>
            </div>

            <DialogFooter>
              <Button className="rounded-xl" onClick={() => setLifecycleExplainerOpen(false)}>Understood</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
