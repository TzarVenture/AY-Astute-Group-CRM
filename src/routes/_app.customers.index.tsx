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
import { Search, Download, Plus, Filter, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/customers/")({
  head: () => ({ meta: [{ title: "Customers — AY Astute Group CRM" }, { name: "description", content: "All customers." }] }),
  component: CustomersList,
});

function CustomersList() {
  const [customerList, setCustomerList] = useState<Customer[]>(CUSTOMERS);
  const [q, setQ] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedService, setSelectedService] = useState<string>("All");
  const [selectedCaller, setSelectedCaller] = useState<string>("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form State
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newCity, setNewCity] = useState("Dubai");
  const [newTrn, setNewTrn] = useState("100234567800009");
  const [newService, setNewService] = useState("Corporate Tax Retainer & Filing");

  // Real-Time Multi-Attribute Filtering
  const filtered = useMemo(() => {
    return customerList.filter((c) => {
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
  }, [customerList, q, selectedCity, selectedStatus, selectedService, selectedCaller]);

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
          <>
            <Button variant="outline" className="rounded-xl" onClick={exportCsv}>
              <Download className="mr-1.5 h-4 w-4" /> Export CSV
            </Button>
            <Button className="rounded-xl" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> New Customer
            </Button>
          </>
        }
      />

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

            {/* Caller Filter */}
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
                    onCheckedChange={(v) => setSelectedIds(v ? filtered.map((c) => c.id) : [])}
                  />
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>TRN Number</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Service Engagement</TableHead>
                <TableHead>Assigned Partner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    No customers found matching your filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id} className="hover:bg-accent/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(c.id)}
                        onCheckedChange={(v) =>
                          setSelectedIds(v ? [...selectedIds, c.id] : selectedIds.filter((i) => i !== c.id))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Link to="/customers/$id" params={{ id: c.id }} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={c.avatar} />
                          <AvatarFallback>{c.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium hover:text-primary">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.company}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold">{c.id}</TableCell>
                    <TableCell className="text-xs">{c.mobile}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{c.trn || "N/A"}</TableCell>
                    <TableCell className="text-xs">{c.city}</TableCell>
                    <TableCell>
                      <StatusBadge status={c.status} />
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-primary">{c.service}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.caller}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Customer Modal Dialog */}
      {isAddModalOpen && (
        <Dialog open={true} onOpenChange={() => setIsAddModalOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Onboard New Client</DialogTitle>
              <DialogDescription>Register a new client company into AY Astute Group CRM.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateCustomer} className="space-y-4 py-2">
              <div>
                <Label htmlFor="cn">Primary Contact Name *</Label>
                <Input id="cn" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Tariq Al Mansoori" required />
              </div>
              <div>
                <Label htmlFor="cc">Company Name *</Label>
                <Input id="cc" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} placeholder="Apex Global Trading FZE" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="ce">Work Email</Label>
                  <Input id="ce" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="tariq@apex.ae" />
                </div>
                <div>
                  <Label htmlFor="cp">Mobile Number</Label>
                  <Input id="cp" value={newMobile} onChange={(e) => setNewMobile(e.target.value)} placeholder="+971 50 123 4567" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Emirate / City</Label>
                  <Select value={newCity} onValueChange={setNewCity}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dubai">Dubai</SelectItem>
                      <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                      <SelectItem value="Sharjah">Sharjah</SelectItem>
                      <SelectItem value="Ajman">Ajman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ctrn">TRN Number</Label>
                  <Input id="ctrn" value={newTrn} onChange={(e) => setNewTrn(e.target.value)} placeholder="100234567800009" />
                </div>
              </div>
              <div>
                <Label>Service Pillar</Label>
                <Select value={newService} onValueChange={setNewService}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Statutory Audit 2025 (MOE Approved)">Statutory Audit (MOE Approved)</SelectItem>
                    <SelectItem value="Corporate Tax Retainer & Filing">Corporate Tax Retainer & Filing</SelectItem>
                    <SelectItem value="VAT Return Filing (Quarterly)">VAT Return Filing (Quarterly)</SelectItem>
                    <SelectItem value="Transfer Pricing Local File">Transfer Pricing Documentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Onboard Client</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
