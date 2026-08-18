import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/crm/primitives";
import { LEADS, REQUIRED_LEAD_STATUSES, type Lead, type LeadStatus } from "@/data/crm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Plus, Globe, MessageCircle, UserPlus, Users, Chrome, Filter, Phone, Mail, ChevronDown, History, DollarSign, Calendar, Building2, UserCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useRole } from "@/lib/role-context";
import { Badge } from "@/components/ui/badge";
import { Lock, ShieldCheck, Info, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/leads")({
  head: () => ({ meta: [{ title: "Lead Status Management — AY Astute Group CRM" }] }),
  component: Leads,
});

const SOURCE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Google Ads": Chrome, Website: Globe, WhatsApp: MessageCircle, Manual: UserPlus, Referral: Users, "Existing Client": UserCheck,
};

function Leads() {
  const { role } = useRole();
  const [leadsList, setLeadsList] = useState<Lead[]>(LEADS);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("All");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("All");
  const [selectedLeadForDetails, setSelectedLeadForDetails] = useState<Lead | null>(null);
  const [newLeadDialogOpen, setNewLeadDialogOpen] = useState(false);
  const [lifecycleExplainerOpen, setLifecycleExplainerOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ name: "", company: "", email: "", phone: "", source: "Website", assigned: "Priya Menon", dealValue: "25000", status: "Not Contacted" as LeadStatus });

  const isAgentView = role === "Caller";

  // Update status function
  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    setLeadsList((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const oldStatus = l.status;
          const newHistory = [
            {
              id: `log-${Date.now()}`,
              previousStatus: oldStatus,
              newStatus,
              updatedBy: "Current User",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" }),
              notes: `Status changed from "${oldStatus}" to "${newStatus}"`,
            },
            ...(l.statusHistory || []),
          ];
          return { ...l, status: newStatus, statusHistory: newHistory };
        }
        return l;
      })
    );
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.company) return;
    const created: Lead = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      name: newLeadForm.name,
      company: newLeadForm.company,
      email: newLeadForm.email || `${newLeadForm.name.toLowerCase().replace(" ", ".")}@${newLeadForm.company.toLowerCase().replace(" ", "")}.com`,
      phone: newLeadForm.phone || "+971 50 123 4567",
      source: newLeadForm.source,
      assigned: newLeadForm.assigned,
      status: newLeadForm.status,
      dealValue: Number(newLeadForm.dealValue) || 25000,
      lastContacted: "Just now",
      createdAt: new Date().toISOString().split("T")[0],
      statusHistory: [
        {
          id: `log-${Date.now()}`,
          previousStatus: "Not Contacted",
          newStatus: newLeadForm.status,
          updatedBy: "Current User",
          timestamp: "Just now",
          notes: "Lead manually registered in CRM",
        },
      ],
    };
    setLeadsList([created, ...leadsList]);
    setNewLeadDialogOpen(false);
    setNewLeadForm({ name: "", company: "", email: "", phone: "", source: "Website", assigned: "Priya Menon", dealValue: "25000", status: "Not Contacted" });
  };

  // Status Counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { All: leadsList.length };
    REQUIRED_LEAD_STATUSES.forEach((s) => (counts[s] = 0));
    leadsList.forEach((l) => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return counts;
  }, [leadsList]);

  // Unique sources and assignees for filtering
  const sourcesList = useMemo(() => Array.from(new Set(leadsList.map((l) => l.source))), [leadsList]);
  const assigneesList = useMemo(() => Array.from(new Set(leadsList.map((l) => l.assigned))), [leadsList]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leadsList.filter((l) => {
      // Role-based filtering for Agent View
      if (isAgentView && l.assigned !== "Priya Menon") return false;
      // Tab status filter
      if (activeTab !== "All" && l.status !== activeTab) return false;
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = l.name.toLowerCase().includes(q);
        const matchCompany = l.company?.toLowerCase().includes(q);
        const matchId = l.id.toLowerCase().includes(q);
        const matchPhone = l.phone.includes(q);
        const matchEmail = l.email.toLowerCase().includes(q);
        if (!matchName && !matchCompany && !matchId && !matchPhone && !matchEmail) return false;
      }
      // Source filter
      if (selectedSource !== "All" && l.source !== selectedSource) return false;
      // Assignee filter
      if (selectedAssignee !== "All" && l.assigned !== selectedAssignee) return false;
      return true;
    });
  }, [leadsList, activeTab, searchQuery, selectedSource, selectedAssignee, isAgentView]);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Lead Status Management & Pipeline"
        subtitle="Manage end-to-end sales lead statuses, track history, and filter by pipeline stage."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl border-primary/30 text-primary hover:bg-primary/5" onClick={() => setLifecycleExplainerOpen(true)}>
              <Info className="mr-1.5 h-4 w-4" /> Data Flow Explainer
            </Button>
            <Button onClick={() => setNewLeadDialogOpen(true)} className="rounded-xl shadow-sm">
              <Plus className="mr-1.5 h-4 w-4" /> Add New Lead
            </Button>
          </div>
        }
      />

      {/* Role View Alert Banner */}
      {isAgentView ? (
        <div className="mb-4 rounded-2xl border bg-amber-500/10 border-amber-500/30 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>🔒 Agent Role Permissions Active (Viewing as Caller — Priya Menon):</strong> Displaying only {filteredLeads.length} leads assigned to your queue.
            </span>
          </div>
          <Badge variant="outline" className="border-amber-500/40 text-amber-700 bg-amber-100/50">
            Agent RBAC Active
          </Badge>
        </div>
      ) : (
        <div className="mb-4 rounded-2xl border bg-primary/5 border-primary/20 p-4 text-xs text-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>
              <strong>Management Org View ({role}):</strong> Displaying all company leads across all telesales callers.
            </span>
          </div>
          <Badge className="bg-primary text-primary-foreground">Full Org View ({role})</Badge>
        </div>
      )}

      {/* Configurable Status Quick Filters Bar */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-2xl border bg-card p-2 shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab("All")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
            activeTab === "All" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-accent text-muted-foreground"
          }`}
        >
          All Leads <span className="rounded-full bg-background/20 px-1.5 py-0.2 text-[10px]">{statusCounts["All"]}</span>
        </button>
        {REQUIRED_LEAD_STATUSES.map((st) => (
          <button
            key={st}
            onClick={() => setActiveTab(st)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
              activeTab === st ? "bg-primary text-primary-foreground shadow-sm font-semibold" : "hover:bg-accent text-muted-foreground"
            }`}
          >
            {st}
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTab === st ? "bg-background/20 text-white" : "bg-muted text-foreground"
              }`}
            >
              {statusCounts[st] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Main Search & Advanced Filter Toolbar */}
      <div className="mt-4 rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, ID, phone, or email…"
              className="h-10 rounded-xl pl-9"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Source */}
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="h-10 w-[160px] rounded-xl text-xs">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Sources</SelectItem>
                {sourcesList.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by Representative */}
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger className="h-10 w-[170px] rounded-xl text-xs">
                <SelectValue placeholder="Assigned Rep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Assignees</SelectItem>
                {assigneesList.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(selectedSource !== "All" || selectedAssignee !== "All" || searchQuery) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedSource("All");
                  setSelectedAssignee("All");
                  setSearchQuery("");
                }}
                className="h-10 rounded-xl text-xs text-destructive hover:bg-destructive/10"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>

        {/* Lead Records Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Lead & Company</TableHead>
                <TableHead className="font-semibold">Current Status</TableHead>
                <TableHead className="font-semibold">Source</TableHead>
                <TableHead className="font-semibold">Assigned Rep</TableHead>
                <TableHead className="font-semibold">Est. Deal Value</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    No leads found matching your criteria. Try adjusting filters or search query.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((l) => (
                  <TableRow key={l.id} className="hover:bg-accent/40 transition">
                    <TableCell>
                      <button
                        onClick={() => setSelectedLeadForDetails(l)}
                        className="text-left font-medium text-foreground hover:text-primary hover:underline"
                      >
                        <p className="text-sm font-semibold">{l.name}</p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="font-mono text-primary/80">{l.id}</span>
                          <span>•</span>
                          <span>{l.company}</span>
                        </div>
                      </button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="group inline-flex items-center gap-1 hover:opacity-80 transition">
                            <StatusBadge status={l.status} />
                            <ChevronDown className="h-3 w-3 text-muted-foreground opacity-50 group-hover:opacity-100" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[190px] rounded-xl">
                          <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Change Status</p>
                          {REQUIRED_LEAD_STATUSES.map((st) => (
                            <DropdownMenuItem
                              key={st}
                              onClick={() => handleStatusChange(l.id, st)}
                              className={`text-xs ${l.status === st ? "font-bold text-primary bg-primary/5" : ""}`}
                            >
                              <StatusBadge status={st} className="mr-2 h-2 text-[10px] px-1.5 py-0" />
                              {st}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-xs">{l.source}</TableCell>
                    <TableCell className="text-xs font-medium">{l.assigned}</TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      AED {l.dealValue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{l.phone}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedLeadForDetails(l)}
                          className="h-8 rounded-lg text-xs"
                        >
                          <History className="mr-1 h-3.5 w-3.5" /> History
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Lead Details & Status History Drawer */}
      <Sheet open={!!selectedLeadForDetails} onOpenChange={(open) => !open && setSelectedLeadForDetails(null)}>
        {selectedLeadForDetails && (
          <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto">
            <SheetHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedLeadForDetails.status} />
                <span className="font-mono text-xs text-muted-foreground">{selectedLeadForDetails.id}</span>
              </div>
              <SheetTitle className="font-display text-xl">{selectedLeadForDetails.name}</SheetTitle>
              <SheetDescription>{selectedLeadForDetails.company} • {selectedLeadForDetails.email}</SheetDescription>
            </SheetHeader>

            <div className="py-4 space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-muted/30 p-4 rounded-xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Phone Number</p>
                  <p className="mt-0.5 font-mono font-medium">{selectedLeadForDetails.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Est. Deal Value</p>
                  <p className="mt-0.5 font-semibold text-primary">AED {selectedLeadForDetails.dealValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Acquisition Source</p>
                  <p className="mt-0.5 font-medium">{selectedLeadForDetails.source}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Assigned Consultant</p>
                  <p className="mt-0.5 font-medium">{selectedLeadForDetails.assigned}</p>
                </div>
              </div>

              {/* Status Update Control */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Update Status</h4>
                <div className="grid grid-cols-3 gap-2">
                  {REQUIRED_LEAD_STATUSES.map((st) => (
                    <Button
                      key={st}
                      variant={selectedLeadForDetails.status === st ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        handleStatusChange(selectedLeadForDetails.id, st);
                        setSelectedLeadForDetails({
                          ...selectedLeadForDetails,
                          status: st,
                          statusHistory: [
                            {
                              id: `log-${Date.now()}`,
                              previousStatus: selectedLeadForDetails.status,
                              newStatus: st,
                              updatedBy: "Current User",
                              timestamp: "Just now",
                              notes: `Status changed to ${st}`,
                            },
                            ...(selectedLeadForDetails.statusHistory || []),
                          ],
                        });
                      }}
                      className="rounded-xl text-xs h-9 justify-start truncate"
                    >
                      {st}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Change Audit Trail */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5 text-primary" /> Status Audit Trail & History
                </h4>
                {selectedLeadForDetails.statusHistory && selectedLeadForDetails.statusHistory.length > 0 ? (
                  <div className="space-y-3 relative border-l-2 border-primary/20 pl-4">
                    {selectedLeadForDetails.statusHistory.map((item) => (
                      <div key={item.id} className="relative">
                        <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                        <div className="flex items-center justify-between text-xs">
                          <p className="font-semibold text-foreground">
                            {item.previousStatus} → <span className="text-primary">{item.newStatus}</span>
                          </p>
                          <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Updated by {item.updatedBy}</p>
                        {item.notes && <p className="mt-1 text-xs italic bg-muted/40 p-2 rounded-lg">{item.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No historical status logs found.</p>
                )}
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>

      {/* Add New Lead Dialog */}
      <Dialog open={newLeadDialogOpen} onOpenChange={setNewLeadDialogOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Create New Sales Lead</DialogTitle>
            <DialogDescription>Register a new potential client into the CRM sales pipeline.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateLead} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Contact Name *</Label>
                <Input
                  required
                  placeholder="e.g. Tariq Al Hashimi"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className="rounded-xl mt-1 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Company Name *</Label>
                <Input
                  required
                  placeholder="e.g. Crescent Capital"
                  value={newLeadForm.company}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                  className="rounded-xl mt-1 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Email Address</Label>
                <Input
                  type="email"
                  placeholder="tariq@crescent.ae"
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  className="rounded-xl mt-1 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Phone Number</Label>
                <Input
                  placeholder="+971 50 987 6543"
                  value={newLeadForm.phone}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                  className="rounded-xl mt-1 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Initial Lead Status</Label>
                <Select value={newLeadForm.status} onValueChange={(val: LeadStatus) => setNewLeadForm({ ...newLeadForm, status: val })}>
                  <SelectTrigger className="mt-1 rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUIRED_LEAD_STATUSES.map((st) => (
                      <SelectItem key={st} value={st}>{st}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Estimated Deal Value (AED)</Label>
                <Input
                  type="number"
                  placeholder="35000"
                  value={newLeadForm.dealValue}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, dealValue: e.target.value })}
                  className="rounded-xl mt-1 text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setNewLeadDialogOpen(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl text-xs font-semibold">
                Save Lead
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Data Architecture & Lifecycle Explainer Modal */}
      {lifecycleExplainerOpen && (
        <Dialog open={true} onOpenChange={() => setLifecycleExplainerOpen(false)}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" /> Data Architecture: Leads vs Contacts vs Customers
              </DialogTitle>
              <DialogDescription>
                How lead data is structured, synchronized, and promoted across AY Astute Group CRM
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="rounded-xl border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-foreground">Leads Section (Here)</h4>
                    <p className="text-[11px] text-muted-foreground">The master database of all raw and qualified leads, categorized by 9 status indicators (Not Contacted, Call Back, DND, etc.) and auto dialer integration.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t pt-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-foreground">Telesales Journey</h4>
                    <p className="text-[11px] text-muted-foreground">The active visual pipeline (Stages 1 through 6) governing appointment booking, meeting execution, thank-you notes, and proposal dispatches.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t pt-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-foreground">Customers Directory</h4>
                    <p className="text-[11px] text-muted-foreground">Won client accounts with active MOE audit or corporate tax service contracts. Automatically promoted upon marking a deal closed!</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-emerald-500/10 border-emerald-500/20 p-3 text-[11px] text-emerald-900 dark:text-emerald-200">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Automatic Data Sync:
                </p>
                <p className="mt-1">Updating a status in this <strong>Leads</strong> table automatically syncs with the <strong>Telesales Journey</strong> pipeline and vice versa. Closing a deal promotes the lead to <strong>Customers</strong>.</p>
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
