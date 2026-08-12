import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitMerge, CheckCircle2, ArrowRight, Calendar, FileText, Send, Mail,
  CreditCard, DollarSign, Handshake, ChevronRight, UserPlus, Clock, Sparkles,
  Phone, MessageSquare, Play, RotateCcw, AlertCircle, ShieldCheck, Award
} from "lucide-react";
import { PageHeader, SectionCard, StatusBadge, KpiCard } from "@/components/crm/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/telesales")({
  head: () => ({
    meta: [
      { title: "Telesales Journey — AY Astute Group CRM" },
      { name: "description", content: "Interactive client presentation of the AY Telesales Workflow." },
    ],
  }),
  component: TelesalesJourneyPage,
});

interface LeadWorkflowState {
  id: string;
  leadName: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  stage: number; // 1 to 6
  meetingAttended?: boolean;
  proposalSent?: boolean;
  dealClosed?: boolean;
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
    proposalSent: true,
    dealClosed: false,
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
  },
  {
    id: "tw-103",
    leadName: "Alexander Petrov",
    company: "Nordic Tech Ventures DMCC",
    phone: "+971 55 444 3322",
    email: "a.petrov@nordictech.io",
    service: "Transfer Pricing Documentation",
    stage: 5, // Negotiation / Deal Closed
    meetingAttended: true,
    proposalSent: true,
    dealClosed: true,
    executionStep: 4, // Send Invoice Request
  },
];

const WORKFLOW_STAGES = [
  {
    id: 1,
    title: "1. Lead & Contact",
    subtitle: "Lead Call & Interest Check",
    icon: UserPlus,
    color: "border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400",
  },
  {
    id: 2,
    title: "2. Appointment",
    subtitle: "Book Meeting & Calendar Invite",
    icon: Calendar,
    color: "border-purple-500/30 bg-purple-500/5 text-purple-600 dark:text-purple-400",
  },
  {
    id: 3,
    title: "3. Meeting",
    subtitle: "Attended Check & Thank You",
    icon: CheckCircle2,
    color: "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400",
  },
  {
    id: 4,
    title: "4. Proposal & Quote",
    subtitle: "Service Quotation Sent",
    icon: FileText,
    color: "border-indigo-500/30 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400",
  },
  {
    id: 5,
    title: "5. Closing",
    subtitle: "Follow Up & Deal Closed 🎉",
    icon: Handshake,
    color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: 6,
    title: "6. Post-Close Execution",
    subtitle: "Handover to Operations",
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
  const [activeModal, setActiveModal] = useState<string | null>(null);

  function advanceLeadStage(leadId: string, targetStage: number) {
    setLeads(
      leads.map((l) => (l.id === leadId ? { ...l, stage: targetStage } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, stage: targetStage });
    }
  }

  function advanceExecutionStep(leadId: string, currentStep: number) {
    const nextStep = currentStep + 1;
    setLeads(
      leads.map((l) => (l.id === leadId ? { ...l, executionStep: nextStep } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, executionStep: nextStep });
    }
    toast.success(`Executed Step ${nextStep}: ${POST_CLOSE_STEPS[nextStep - 1]?.title}`);
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        title="AY Telesales Journey — Sales Workflow Engine"
        subtitle="Standardized client conversion pipeline from initial lead call to deal close and operations handover."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => setLeads(INITIAL_DEMO_LEADS)}>
            <RotateCcw className="mr-1.5 h-4 w-4" /> Reset Presentation Demo
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Pipeline Leads" value={leads.length} tone="primary" icon={UserPlus} delta="In sales workflow" />
        <KpiCard label="Appointments Fixed" value={leads.filter((l) => l.stage >= 2).length} tone="info" icon={Calendar} delta="Meeting scheduled" />
        <KpiCard label="Proposals Out" value={leads.filter((l) => l.stage >= 4).length} tone="warning" icon={FileText} delta="AED 125,000 value" />
        <KpiCard label="Deals Closed & Executing" value={leads.filter((l) => l.dealClosed).length} tone="success" icon={Handshake} delta="Passed to execution" />
      </div>

      {/* Visual Interactive Flowchart Strip */}
      <div className="mt-6 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <div>
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <GitMerge className="h-5 w-5 text-primary" /> Interactive Sales Workflow Pipeline
            </h2>
            <p className="text-xs text-muted-foreground">
              Sequential decision nodes governing telesales outreach, meetings, and proposal delivery.
            </p>
          </div>
          <Badge variant="outline" className="rounded-full">
            Automated Process Tracking
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {WORKFLOW_STAGES.map((stg) => (
            <div key={stg.id} className={`rounded-xl border p-3 transition-all ${stg.color}`}>
              <div className="flex items-center gap-2">
                <stg.icon className="h-4 w-4 shrink-0" />
                <span className="font-display text-xs font-bold truncate">{stg.title}</span>
              </div>
              <p className="mt-1 text-[11px] opacity-80">{stg.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Kanban Workflow Columns */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {WORKFLOW_STAGES.map((stg) => {
          const stageLeads = leads.filter((l) => l.stage === stg.id);
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
                    className="cursor-pointer rounded-xl border bg-background p-3 shadow-xs transition hover:border-primary"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-display text-xs font-bold text-foreground line-clamp-1">{lead.leadName}</p>
                      <Badge variant="outline" className="text-[9px] shrink-0">
                        Stage {lead.stage}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{lead.company}</p>
                    <p className="mt-1.5 text-[10px] font-semibold text-primary">{lead.service}</p>

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

      {/* Selected Lead Workflow Inspector Modal */}
      {selectedLead && (
        <Dialog open={true} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="sm:max-w-xl">
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
              {/* Stage Progress Bar */}
              <div className="rounded-xl border p-3 bg-muted/20">
                <p className="text-xs font-semibold mb-2">Workflow Progression:</p>
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
                  <p className="text-xs font-semibold text-foreground">Stage 1: Lead Qualification Call</p>
                  <Button
                    className="w-full justify-between rounded-xl"
                    onClick={() => {
                      toast.success("Appointment fixed! Moved to Stage 2.");
                      advanceLeadStage(selectedLead.id, 2);
                    }}
                  >
                    <span>Lead Interested? → Set Appointment</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl text-muted-foreground"
                    onClick={() => {
                      toast.info("Marked for Future Reference.");
                      setSelectedLead(null);
                    }}
                  >
                    <span>Not Interested → Save for Future Reference</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {selectedLead.stage === 2 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Stage 2: Appointment Fixing</p>
                  <Button
                    className="w-full justify-between rounded-xl"
                    onClick={() => {
                      toast.success("Calendar invite sent to client!");
                      advanceLeadStage(selectedLead.id, 3);
                    }}
                  >
                    <span>Send Calendar Invite & Confirm Meeting</span>
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {selectedLead.stage === 3 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Stage 3: Meeting Execution</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      className="rounded-xl"
                      onClick={() => {
                        toast.success("Meeting Attended! Thank you note sent.");
                        advanceLeadStage(selectedLead.id, 4);
                      }}
                    >
                      <CheckCircle2 className="mr-1.5 h-4 w-4" /> Meeting Attended
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => toast.info("Reschedule reminder logged!")}
                    >
                      <RotateCcw className="mr-1.5 h-4 w-4" /> Client Rescheduled
                    </Button>
                  </div>
                </div>
              )}

              {selectedLead.stage === 4 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Stage 4: Proposal & Quotation</p>
                  <Button
                    className="w-full justify-between rounded-xl"
                    onClick={() => {
                      toast.success("Service Quotation & Proposal sent to client!");
                      advanceLeadStage(selectedLead.id, 5);
                    }}
                  >
                    <span>Send Proposal & Service Quotation PDF</span>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {selectedLead.stage === 5 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Stage 5: Final Negotiation & Closing</p>
                  <Button
                    className="w-full justify-between rounded-xl bg-success text-success-foreground hover:bg-success/90"
                    onClick={() => {
                      toast.success("🎉 DEAL CLOSED! Initiating Post-Close Execution Handover.");
                      setLeads(
                        leads.map((l) =>
                          l.id === selectedLead.id
                            ? { ...l, stage: 6, dealClosed: true, executionStep: 1 }
                            : l
                        )
                      );
                      setSelectedLead({ ...selectedLead, stage: 6, dealClosed: true, executionStep: 1 });
                    }}
                  >
                    <span>Mark DEAL CLOSED 🎉</span>
                    <Handshake className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Stage 6: Post-Close Execution Checklist */}
              {selectedLead.stage === 6 && (
                <div className="space-y-3 rounded-xl border p-4 bg-success-soft/20 border-success/30">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-sm font-bold text-success flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" /> Post-Close Client Onboarding & Handover
                    </p>
                    <Badge variant="secondary" className="bg-success-soft text-success text-[10px]">
                      Step {selectedLead.executionStep ?? 1} of 7
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
                              ? "bg-success-soft/40 border-success/30 text-success"
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
                            <CheckCircle2 className="h-4 w-4 text-success" />
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
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedLead(null)}>
                Close Inspector
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
