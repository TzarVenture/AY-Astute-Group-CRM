import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Send, CheckCheck, FileText, Plus, Phone } from "lucide-react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/crm/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/whatsapp")({
  head: () => ({
    meta: [{ title: "WhatsApp Business Hub — AY Astute Group CRM" }],
  }),
  component: WhatsAppHubPage,
});

function WhatsAppHubPage() {
  const [message, setMessage] = useState("");

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="WhatsApp Business Integration & Hub"
        subtitle="Official Meta WhatsApp Business Cloud API communication history linked to CRM client records."
        actions={
          <Button className="rounded-xl" onClick={() => toast.success("Opening WhatsApp template manager...")}>
            <Plus className="mr-1.5 h-4 w-4" /> New HSM Template
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Chat List */}
        <SectionCard title="Client Chats" description="Active WhatsApp conversations">
          <div className="space-y-2">
            {[
              { name: "Tariq Al Mansoori", company: "Apex Global", last: "Sent corporate tax brochure PDF", time: "10:15 AM", unread: 0 },
              { name: "Fatima Al Zaabi", company: "Emirates Logistics", last: "Please confirm meeting time tomorrow", time: "09:30 AM", unread: 2 },
              { name: "Alexander Petrov", company: "Nordic Tech", last: "Thank you for sending the quote!", time: "Yesterday", unread: 0 },
            ].map((c, i) => (
              <div
                key={c.name}
                className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                  i === 0 ? "border-primary bg-primary-soft/30" : "hover:bg-accent"
                }`}
              >
                <div>
                  <p className="font-bold text-xs text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.company} · {c.last}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-muted-foreground">{c.time}</p>
                  {c.unread > 0 && (
                    <Badge variant="destructive" className="h-4 px-1 text-[9px] rounded-full mt-1">
                      {c.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Chat Window */}
        <div className="lg:col-span-2 flex flex-col rounded-2xl border bg-card shadow-sm h-[520px]">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/20 text-success font-bold">
                WA
              </div>
              <div>
                <p className="font-bold text-sm">Tariq Al Mansoori</p>
                <p className="text-xs text-muted-foreground">+971 50 123 4567 · Apex Global Trading FZE</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs text-success border-success/40">
              WhatsApp Verified API
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
            <div className="flex justify-start">
              <div className="max-w-sm rounded-2xl bg-card border p-3 text-xs shadow-xs">
                <p className="font-semibold text-primary">AY Astute System (Template)</p>
                <p className="mt-1">Dear Tariq, thank you for contacting AY Astute Group. Here is our Corporate Tax Advisory brochure.</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-success font-semibold border-t pt-1">
                  <FileText className="h-3 w-3" /> AY_Astute_Corporate_Tax_2026.pdf (1.8 MB)
                </div>
                <span className="mt-1 block text-[9px] text-muted-foreground text-right">10:15 AM</span>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-sm rounded-2xl bg-success/10 border border-success/30 p-3 text-xs text-foreground shadow-xs">
                <p>Thanks! We will review and confirm our first audit tax period requirement.</p>
                <span className="mt-1 flex items-center justify-end gap-1 text-[9px] text-muted-foreground">
                  10:18 AM <CheckCheck className="h-3.5 w-3.5 text-success" />
                </span>
              </div>
            </div>
          </div>

          <div className="border-t p-3 flex gap-2">
            <Input
              placeholder="Type a WhatsApp message or select HSM template…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl"
            />
            <Button
              className="rounded-xl bg-success text-success-foreground hover:bg-success/90"
              onClick={() => {
                if (!message) return;
                toast.success("WhatsApp message delivered!");
                setMessage("");
              }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
