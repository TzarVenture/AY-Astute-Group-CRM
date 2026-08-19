import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader, StatusBadge } from "@/components/crm/primitives";
import { CUSTOMERS, type Customer } from "@/data/crm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Plus, Filter, RotateCcw, Info, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Calendar as CalendarIcon } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/customers/")({
  head: () => ({ meta: [{ title: "Customers — AY Astute Group CRM" }, { name: "description", content: "All customers." }] }),
  component: CustomersList,
});

function CustomersList() {
  const { role } = useRole();
  const [customerList, setCustomerList] = useState<Customer[]>(CUSTOMERS);
  const [q, setQ] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedService, setSelectedService] = useState<string>("All");
  const [selectedCaller, setSelectedCaller] = useState<string>("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lifecycleModalOpen, setLifecycleModalOpen] = useState(false);

  // New Customer Form State
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newCity, setNewCity] = useState("Dubai");
  const [newTrn, setNewTrn] = useState("100234567800009");
  const [newService, setNewService] = useState("Corporate Tax Retainer & Filing");
  const [newNotes, setNewNotes] = useState("");
  const [newCategory, setNewCategory] = useState<"Requirement Identified" | "Objection Raised" | "Agreed Action" | "Client Feedback" | "General Note">("Requirement Identified");
  const [newFollowUpDate, setNewFollowUpDate] = useState("2026-08-25");

  // Role Based Filter logic
  const isAgentView = role === "Caller";

  // Real-Time Multi-Attribute Filtering
  const filtered = useMemo(() => {
    return customerList.filter((c) => {
      // If in Agent view (Caller), enforce filtering by assigned caller
      if (isAgentView && c.caller !== "Priya Menon") {
        return false;
      }

      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.id.toLowerCase().includes(q.toLowerCase()) ||
        c.company.toLowerCase().includes(q.toLowerCase()) ||
        c.email.toLowerCase().includes(q.toLowerCase()) ||
        (c.trn && c.trn.includes(q));

      const matchCity = selectedCity === "All" || c.city.toLowerCase() === selectedCity.toLowerCase();
      const matchStatus = selectedStatus === "All" || c.status.toLowerCase() === selectedStatus.toLowerCase();
      const matchService = selectedService === "All" || c.service.toLowerCase().includes(selectedService.toLowerCase());
      const matchCaller = selectedCaller === "All" || c.caller.toLowerCase() === selectedCaller.toLowerCase();

      return matchSearch && matchCity && matchStatus && matchService && matchCaller;
    });
  }, [customerList, q, selectedCity, selectedStatus, selectedService, selectedCaller, isAgentView]);

  const allChecked = filtered.length > 0 && selectedIds.length === filtered.length;

  function resetFilters() {
    setQ("");
    setSelectedCity("All");
    setSelectedStatus("All");
    setSelectedService("All");
    setSelectedCaller("All");
    toast.info("All filters reset.");
  }

  function handleCreateCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!newName || !newCompany) return;

    const created: Customer = {
      id: `AY${Math.floor(100000 + Math.random() * 900000)}`,
      name: newName,
      company: newCompany,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, ".")}@${newCompany.toLowerCase().replace(/\s+/g, "")}.ae`,
      mobile: newMobile || "+971 50 123 4567",
      nationality: "UAE",
      jobTitle: "Managing Director",
      country: "UAE",
      city: newCity,
      trn: newTrn,
      leadSource: "Direct Client Inquiry",
      createdDate: new Date().toISOString().split("T")[0],
      engagementType: "Corporate Tax",
      status: "Active",
      service: newService,
      expiry: "2026-12-31",
      caller: "Priya Menon",
      avatar: `https://i.pravatar.cc/80?u=${Date.now()}`,
    };

    setCustomerList([created, ...customerList]);
    setIsAddModalOpen(false);
    toast.success(`Customer "${newName}" onboarded successfully!`);
    setNewName("");
    setNewCompany("");
    setNewEmail("");
    setNewMobile("");
  }

  function exportCsv() {
    toast.success(`Exported ${filtered.length} client records to CSV file.`);
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Customer Directory"
        subtitle={`${filtered.length} active client accounts across the UAE`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl border-primary/30 text-primary hover:bg-primary/5" onClick={() => setLifecycleModalOpen(true)}>
              <Info className="mr-1.5 h-4 w-4" /> Data Lifecycle Explainer
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={exportCsv}>
              <Download className="mr-1.5 h-4 w-4" /> Export CSV
            </Button>
            <Button className="rounded-xl" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> New Customer
            </Button>
          </div>
        }
      />

      {/* Role View Alert Banner */}
      {isAgentView ? (
        <div className="mb-6 rounded-2xl border bg-amber-500/10 border-amber-500/30 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>🔒 Agent Role View Active (Caller — Priya Menon):</strong> Displaying only {filtered.length} accounts assigned to your telesales desk.
            </span>
          </div>
          <Badge variant="outline" className="border-amber-500/40 text-amber-700 bg-amber-100/50">
            Agent RBAC Active
          </Badge>
        </div>
      ) : (
        <div className="mb-6 rounded-2xl border bg-primary/5 border-primary/20 p-4 text-xs text-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>
              <strong>Management Org View ({role}):</strong> Displaying all customer accounts across all telesales agents.
            </span>
          </div>
          <Badge className="bg-primary text-primary-foreground">Full Org View</Badge>
        </div>
      )}

      <div className="rounded-2xl border bg-card shadow-sm">
        {/* Filter Controls Bar */}
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, TRN, company, or ID…"
              className="h-10 rounded-xl pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* City Filter */}
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="h-10 w-[130px] rounded-xl">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Cities</SelectItem>
                <SelectItem value="Dubai">Dubai</SelectItem>
                <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                <SelectItem value="Sharjah">Sharjah</SelectItem>
                <SelectItem value="Ajman">Ajman</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-10 w-[130px] rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Prospect">Prospect</SelectItem>
              </SelectContent>
            </Select>

            {/* Service Filter */}
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="h-10 w-[140px] rounded-xl">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Services</SelectItem>
                <SelectItem value="Statutory Audit">Statutory Audit</SelectItem>
                <SelectItem value="Corporate Tax">Corporate Tax</SelectItem>
                <SelectItem value="VAT">VAT & Excise</SelectItem>
                <SelectItem value="Accounting">Accounting</SelectItem>
              </SelectContent>
            </Select>

            {!isAgentView && (
              <Select value={selectedCaller} onValueChange={setSelectedCaller}>
                <SelectTrigger className="h-10 w-[130px] rounded-xl">
                  <SelectValue placeholder="Caller" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Callers</SelectItem>
                  <SelectItem value="Priya Menon">Priya Menon</SelectItem>
                  <SelectItem value="Rahul Sharma">Rahul Sharma</SelectItem>
                  <SelectItem value="Anita Desai">Anita Desai</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={resetFilters} title="Reset filters">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bulk Actions Banner */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 border-b bg-primary-soft/40 px-4 py-2 text-xs">
            <span className="font-semibold text-primary">{selectedIds.length} selected</span>
            <Button size="sm" variant="outline" className="h-7 rounded-lg" onClick={() => toast.success("Assigned caller to selected clients.")}>
              Assign Caller
            </Button>
            <Button size="sm" variant="outline" className="h-7 rounded-lg" onClick={() => toast.success("Status updated for selected clients.")}>
              Change Status
            </Button>
          </div>
        )}

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={(c) => {
                      if (c) setSelectedIds(filtered.map((x) => x.id));
                      else setSelectedIds([]);
                    }}
                  />
                </TableHead>
                <TableHead>Customer / Company</TableHead>
                <TableHead>TRN Number</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Active Service</TableHead>
                <TableHead>Assigned Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((c) => {
                const isSelected = selectedIds.includes(c.id);
                return (
                  <TableRow key={c.id} className={isSelected ? "bg-accent/50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(ch) => {
                          if (ch) setSelectedIds([...selectedIds, c.id]);
                          else setSelectedIds(selectedIds.filter((id) => id !== c.id));
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Link to="/customers/$id" params={{ id: c.id }} className="flex items-center gap-3 hover:underline">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={c.avatar} />
                          <AvatarFallback>{c.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-foreground leading-tight">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.company}</p>
                        </div>
                      </Link>
                    </TableCell>

                    <TableCell className="font-mono text-xs font-semibold">{c.trn || "—"}</TableCell>
                    <TableCell className="text-xs">{c.city}, {c.country}</TableCell>
                    <TableCell className="text-xs font-semibold text-primary">{c.service}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.caller}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>

                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" asChild>
                        <Link to="/customers/$id" params={{ id: c.id }}>View Profile</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No customers found matching your filter criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <Dialog open={true} onOpenChange={() => setIsAddModalOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Onboard New Customer</DialogTitle>
              <DialogDescription>Add a new corporate client account to the CRM directory.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateCustomer} className="space-y-3 py-2 text-xs">
              <div>
                <Label htmlFor="c-name">Contact Person Name *</Label>
                <Input id="c-name" value={newName} onChange={(e) => setNewName(e.target.value)} required className="h-9 text-xs rounded-xl" />
              </div>
              <div>
                <Label htmlFor="c-comp">Company Name *</Label>
                <Input id="c-comp" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} required className="h-9 text-xs rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="c-email">Email Address</Label>
                  <Input id="c-email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="h-9 text-xs rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="c-mob">Mobile Phone</Label>
                  <Input id="c-mob" value={newMobile} onChange={(e) => setNewMobile(e.target.value)} className="h-9 text-xs rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="c-city">City</Label>
                  <Select value={newCity} onValueChange={setNewCity}>
                    <SelectTrigger className="h-9 text-xs rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dubai">Dubai</SelectItem>
                      <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                      <SelectItem value="Sharjah">Sharjah</SelectItem>
                      <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="c-trn">TRN Number</Label>
                  <Input id="c-trn" value={newTrn} onChange={(e) => setNewTrn(e.target.value)} className="h-9 text-xs rounded-xl" />
                </div>
              </div>

              {/* Call Notes & Discussion Remarks (Client Requested Feature) */}
              <div className="border-t pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-primary flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" /> Initial Call Remarks & Interaction Notes
                  </Label>
                  <Badge variant="outline" className="text-[9px] bg-primary/5 text-primary border-primary/20">
                    Agent Logged
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="c-cat" className="text-[11px]">Discussion Category</Label>
                    <Select value={newCategory} onValueChange={(val: any) => setNewCategory(val)}>
                      <SelectTrigger id="c-cat" className="h-8 text-xs rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Requirement Identified">Requirement Identified</SelectItem>
                        <SelectItem value="Objection Raised">Objection Raised</SelectItem>
                        <SelectItem value="Agreed Action">Agreed Action</SelectItem>
                        <SelectItem value="Client Feedback">Client Feedback</SelectItem>
                        <SelectItem value="General Note">General Note</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="c-fdate" className="text-[11px]">Next Follow-Up Date</Label>
                    <Input id="c-fdate" type="date" value={newFollowUpDate} onChange={(e) => setNewFollowUpDate(e.target.value)} className="h-8 text-xs rounded-xl" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="c-notes" className="text-[11px]">Call Discussion Remarks & Notes</Label>
                  <Textarea
                    id="c-notes"
                    rows={3}
                    placeholder="Record customer requirements, service scope discussed, objections, agreed actions..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="text-xs rounded-xl resize-none"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit">Onboard Client & Save Notes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Data Lifecycle Explainer Modal */}
      {lifecycleModalOpen && (
        <Dialog open={true} onOpenChange={() => setLifecycleModalOpen(false)}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" /> Data Architecture & Lifecycle Explainer
              </DialogTitle>
              <DialogDescription>
                How Leads, Contacts, and Customer Accounts synchronize across AY Astute Group CRM
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="rounded-xl border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-foreground">Leads</h4>
                    <p className="text-[11px] text-muted-foreground">Prospects undergoing qualification in the Telesales Journey. Contains call logs, scheduled appointment slots, and quotation states.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t pt-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-foreground">Contacts</h4>
                    <p className="text-[11px] text-muted-foreground">Specific individuals (e.g. CFO, Finance Manager) linked to a Lead or Customer account with contact info.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t pt-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-foreground">Customers (Contracted Accounts)</h4>
                    <p className="text-[11px] text-muted-foreground">Won clients with active statutory audit or corporate tax service engagements. Auto-promoted upon marking deal closed!</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-emerald-500/10 border-emerald-500/20 p-3 text-[11px] text-emerald-900 dark:text-emerald-200">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Automatic Background Sync:
                </p>
                <p className="mt-1">When a deal is marked <strong>"DEAL CLOSED (Won)"</strong> in the Telesales Journey, the record is auto-promoted into this <strong>Customer Directory</strong> with an audit badge.</p>
              </div>
            </div>

            <DialogFooter>
              <Button className="rounded-xl" onClick={() => setLifecycleModalOpen(false)}>Understood</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
