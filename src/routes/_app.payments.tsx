import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader, StatusBadge } from "@/components/crm/primitives";
import { PAYMENTS } from "@/data/crm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download, Plus, Search, DollarSign, CreditCard } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/payments")({
  head: () => ({ meta: [{ title: "Payment Collections — AY Astute Group CRM" }] }),
  component: Payments,
});

interface PaymentItem {
  id: string;
  invoice: string;
  customer: string;
  amount: number;
  method: string;
  date: string;
  status: string;
  reference: string;
}

const INITIAL_PAYMENTS: PaymentItem[] = PAYMENTS.map((p, idx) => ({
  id: `pay-${idx}`,
  invoice: p.invoice,
  customer: p.customer,
  amount: p.amount,
  method: p.method,
  date: p.date,
  status: p.status,
  reference: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
}));

function Payments() {
  const [payments, setPayments] = useState<PaymentItem[]>(INITIAL_PAYMENTS);
  const [q, setQ] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [cust, setCust] = useState("Capital Health UAE");
  const [invNum, setInvNum] = useState("INV-2025-0001");
  const [amt, setAmt] = useState("26250");
  const [method, setMethod] = useState("Bank Transfer (ENBD)");
  const [refNum, setRefNum] = useState("ENBD-9823471");

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        !q ||
        p.customer.toLowerCase().includes(q.toLowerCase()) ||
        p.invoice.toLowerCase().includes(q.toLowerCase()) ||
        p.reference.toLowerCase().includes(q.toLowerCase());

      const matchMethod = methodFilter === "All" || p.method.includes(methodFilter);
      return matchSearch && matchMethod;
    });
  }, [payments, q, methodFilter]);

  const totalCollected = payments
    .filter((p) => p.status === "Paid")
    .reduce((s, p) => s + p.amount, 0);

  function handleRecordPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!cust || !amt) return;

    const newPayment: PaymentItem = {
      id: `pay-${Date.now()}`,
      invoice: invNum,
      customer: cust,
      amount: Number(amt) || 0,
      method,
      date: new Date().toISOString().split("T")[0],
      status: "Paid",
      reference: refNum,
    };

    setPayments([newPayment, ...payments]);
    setIsAddModalOpen(false);
    toast.success(`Payment of AED ${Number(amt).toLocaleString()} recorded successfully!`);
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Payment Collections & Tracking"
        subtitle="History of all client bank transfer, cheque, and credit card payments in AED."
        actions={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Exported payment collection log!")}>
              <Download className="mr-1.5 h-4 w-4" /> Export CSV
            </Button>
            <Button className="rounded-xl" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Record Payment
            </Button>
          </>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground">Total Collected (AED)</p>
          <p className="mt-1 font-display text-2xl font-bold text-success">AED {totalCollected.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground">Pending Cheques / Transfers</p>
          <p className="mt-1 font-display text-2xl font-bold text-warning">AED 8,500</p>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground">Overdue Balance</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">AED 0</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm">
        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by customer, invoice #, or transaction reference…"
              className="h-10 rounded-xl pl-9"
            />
          </div>
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="h-10 w-[150px] rounded-xl">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Methods</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Cheque">Cheque</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer Account</TableHead>
                <TableHead>Amount (AED)</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Transaction Ref</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No payment records found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id} className="hover:bg-accent/50">
                    <TableCell className="font-mono text-xs font-bold text-primary">{p.invoice}</TableCell>
                    <TableCell className="text-xs font-medium text-foreground">{p.customer}</TableCell>
                    <TableCell className="font-mono text-xs font-bold text-success">AED {p.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-xs">{p.method}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.reference}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isAddModalOpen && (
        <Dialog open={true} onOpenChange={() => setIsAddModalOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record Payment Collection</DialogTitle>
              <DialogDescription>Log a bank transfer, cheque, or card payment against a client invoice.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleRecordPayment} className="space-y-4 py-2">
              <div>
                <Label htmlFor="payCust">Client Account *</Label>
                <Input id="payCust" value={cust} onChange={(e) => setCust(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="payInv">Invoice Number *</Label>
                <Input id="payInv" value={invNum} onChange={(e) => setInvNum(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="payAmt">Amount Received (AED) *</Label>
                  <Input id="payAmt" type="number" value={amt} onChange={(e) => setAmt(e.target.value)} required />
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bank Transfer (ENBD)">Bank Transfer (ENBD)</SelectItem>
                      <SelectItem value="Cheque Deposit">Cheque Deposit</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="payRef">Bank Transaction / Cheque Ref</Label>
                <Input id="payRef" value={refNum} onChange={(e) => setRefNum(e.target.value)} placeholder="ENBD-9823471" />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Confirm Collection</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
