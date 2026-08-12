import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { INVOICES, CUSTOMERS } from "@/data/crm";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/crm/primitives";
import { ArrowLeft, Printer, Download } from "lucide-react";

export const Route = createFileRoute("/_app/invoices/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id} — Invoice — AY Astute Group CRM` }] }),
  component: InvoiceDetail,
  notFoundComponent: () => <div className="p-10 text-center">Invoice not found</div>,
});

function InvoiceDetail() {
  const { id } = Route.useParams();
  const inv = INVOICES.find((i) => i.id === id);
  if (!inv) throw notFound();
  const customer = CUSTOMERS.find((c) => c.id === inv.customerId);
  const subtotal = inv.services.reduce((s, x) => s + x.price * x.qty, 0);
  const vat = Math.round(subtotal * 0.05);
  const total = subtotal + vat;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/invoices" className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" />Back to invoices</Link>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl"><Printer className="mr-1.5 h-4 w-4" />Print</Button>
          <Button className="rounded-xl"><Download className="mr-1.5 h-4 w-4" />Download PDF</Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-10 shadow-sm">
        <div className="flex items-start justify-between border-b pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground"><span className="font-display font-bold">A</span></div>
              <div>
                <p className="font-display text-lg font-bold">AY Astute Group</p>
                <p className="text-xs text-muted-foreground">222, 2nd Floor, Heirs of Omeir Bin Yousef Bldg, Hamdan Bin Mohammed St, Abu Dhabi · +971 4 566 7640 · info@ay-uae.com</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h1 className="font-display text-3xl font-bold">Invoice</h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{inv.number}</p>
            <div className="mt-2"><StatusBadge status={inv.paid ? "Paid" : "Pending"} /></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 py-6">
          <div>
            <p className="text-[11px] uppercase text-muted-foreground">Bill to</p>
            <p className="mt-1 font-semibold">{customer?.name}</p>
            <p className="text-xs text-muted-foreground">{customer?.company}</p>
            <p className="text-xs text-muted-foreground">{customer?.email}</p>
            <p className="text-xs text-muted-foreground">{customer?.mobile}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase text-muted-foreground">Invoice date</p>
            <p className="mt-1 font-semibold">{inv.date}</p>
            <p className="mt-3 text-[11px] uppercase text-muted-foreground">Due date</p>
            <p className="mt-1 font-semibold">2026-07-15</p>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="border-y bg-muted/40">
            <tr className="text-left"><th className="p-3">Service</th><th className="p-3">Qty</th><th className="p-3 text-right">Price</th><th className="p-3 text-right">Amount</th></tr>
          </thead>
          <tbody>
            {inv.services.map((s, i) => (
              <tr key={i} className="border-b">
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3">{s.qty}</td>
                <td className="p-3 text-right">AED {s.price.toLocaleString()}</td>
                <td className="p-3 text-right font-semibold">AED {(s.price * s.qty).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>AED {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">VAT (5%)</span><span>AED {vat.toLocaleString()}</span></div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold"><span>Total</span><span>AED {total.toLocaleString()}</span></div>
          </div>
        </div>

        <p className="mt-10 border-t pt-4 text-center text-xs text-muted-foreground">Thank you for choosing AY Astute Group — Empowering Business, Delivering Results.</p>
      </div>
    </div>
  );
}
