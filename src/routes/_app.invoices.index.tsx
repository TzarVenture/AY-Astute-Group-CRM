import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader, StatusBadge } from "@/components/crm/primitives";
import { INVOICES } from "@/data/crm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Printer, FileText, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/invoices/")({
  head: () => ({ meta: [{ title: "Tax Invoices — AY Astute Group CRM" }] }),
  component: InvoicesList,
});

interface InvoiceItem {
  id: string;
  number: string;
  customer: string;
  date: string;
  dueDate: string;
  subtotal: number;
  vatAmount: number;
  total: number;
  paid: boolean;
  serviceName: string;
}

const MOCK_INVOICES: InvoiceItem[] = INVOICES.map((inv) => {
  const subtotal = inv.services.reduce((s, x) => s + x.price * x.qty, 0);
  const vatAmount = subtotal * 0.05; // 5% UAE VAT
  return {
    id: inv.id,
    number: inv.number,
    customer: inv.customer,
    date: inv.date,
    dueDate: inv.date,
    subtotal,
    vatAmount,
    total: subtotal + vatAmount,
    paid: inv.paid,
    serviceName: inv.services[0]?.name || "Professional Audit & Tax Advisory",
  };
});

function InvoicesList() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(MOCK_INVOICES);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [custName, setCustName] = useState("Apex Global Trading FZE");
  const [servName, setServName] = useState("Corporate Tax Advisory & Filing 2025");
  const [amount, setAmount] = useState("15000");

  const subtotalNum = Number(amount) || 0;
  const vatNum = subtotalNum * 0.05;
  const totalNum = subtotalNum + vatNum;

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        !q ||
        inv.number.toLowerCase().includes(q.toLowerCase()) ||
        inv.customer.toLowerCase().includes(q.toLowerCase()) ||
        inv.serviceName.toLowerCase().includes(q.toLowerCase());

      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Paid" && inv.paid) ||
        (statusFilter === "Pending" && !inv.paid);

      return matchSearch && matchStatus;
    });
  }, [invoices, q, statusFilter]);

  function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault();
    if (!custName || !amount) return;

    const created: InvoiceItem = {
      id: `inv-${Date.now()}`,
      number: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      customer: custName,
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      subtotal: subtotalNum,
      vatAmount: vatNum,
      total: totalNum,
      paid: false,
      serviceName: servName,
    };

    setInvoices([created, ...invoices]);
    setIsAddModalOpen(false);
    toast.success(`Tax Invoice ${created.number} generated successfully!`);
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Tax Invoices & Billing"
        subtitle="Generate and track official UAE 5% VAT Tax Invoices."
        actions={
          <Button className="rounded-xl" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Generate Tax Invoice
          </Button>
        }
      />

      <div className="rounded-2xl border bg-card shadow-sm">
        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search invoice number, client, or service…"
              className="h-10 rounded-xl pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-[140px] rounded-xl">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Invoices</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer Account</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Subtotal (AED)</TableHead>
                <TableHead>5% VAT (AED)</TableHead>
                <TableHead>Total (AED)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    No tax invoices found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-accent/50">
                    <TableCell>
                      <Link to="/invoices/$id" params={{ id: inv.id }} className="font-mono text-xs font-bold text-primary hover:underline">
                        {inv.number}
                      </Link>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">{inv.customer}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                    <TableCell className="text-xs">{inv.serviceName}</TableCell>
                    <TableCell className="font-mono text-xs">AED {inv.subtotal.toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">AED {inv.vatAmount.toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-xs font-bold text-foreground">AED {inv.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={inv.paid ? "Paid" : "Pending"} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-xs"
                        onClick={() => toast.info(`Printing ${inv.number} PDF preview…`)}
                      >
                        <Printer className="mr-1 h-3.5 w-3.5" /> PDF Print
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Generate Tax Invoice Modal */}
      {isAddModalOpen && (
        <Dialog open={true} onOpenChange={() => setIsAddModalOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generate UAE Tax Invoice</DialogTitle>
              <DialogDescription>Create an official VAT invoice with auto-calculated 5% UAE VAT.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateInvoice} className="space-y-4 py-2">
              <div>
                <Label htmlFor="invCust">Customer Account *</Label>
                <Input id="invCust" value={custName} onChange={(e) => setCustName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="invServ">Service Description *</Label>
                <Input id="invServ" value={servName} onChange={(e) => setServName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="invAmt">Subtotal Amount (AED) *</Label>
                <Input id="invAmt" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>

              {/* VAT Calculation Box */}
              <div className="rounded-xl border p-3 bg-muted/20 space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>AED {subtotalNum.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>+ 5% UAE VAT (FTA Tax Agency No. 1002345678):</span>
                  <span>AED {vatNum.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-primary border-t pt-1 text-sm">
                  <span>Total Payable:</span>
                  <span>AED {totalNum.toLocaleString()}</span>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Issue Tax Invoice</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
