import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, FuturePlaceholder } from "@/components/crm/primitives";
import { Sparkles, MessageCircle, MessageSquare, Users, Smartphone, Mic, Fingerprint, Globe } from "lucide-react";

export const Route = createFileRoute("/_app/future")({
  head: () => ({ meta: [{ title: "Future Modules — AY Astute Group CRM" }] }),
  component: Future,
});

const MODULES = [
  { title: "AI Lead Scoring", icon: Sparkles },
  { title: "WhatsApp Business API", icon: MessageCircle },
  { title: "SMS Automation", icon: MessageSquare },
  { title: "Customer Portal", icon: Users },
  { title: "Mobile App", icon: Smartphone },
  { title: "Voice Integration", icon: Mic },
  { title: "Digital KYC", icon: Fingerprint },
  { title: "Website API", icon: Globe },
];

function Future() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Future Modules" subtitle="Roadmap features scheduled for Phase 2 of the AY Astute Group CRM platform." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map((m) => <FuturePlaceholder key={m.title} title={m.title} icon={m.icon} />)}
      </div>
    </div>
  );
}
