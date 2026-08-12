import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Award, Check, ChevronDown, ChevronUp, Plus, ShieldCheck, FileText, Building2, Globe
} from "lucide-react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/crm/primitives";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/services")({
  head: () => ({
    meta: [
      { title: "Services & Audit Catalogue — AY Astute Group CRM" },
      { name: "description", content: "Official service offerings of AY Astute Group." },
    ],
  }),
  component: Services,
});

interface ServiceCategory {
  id: string;
  name: string;
  price: string;
  tagline: string;
  intro: string;
  subServices: string[];
  accreditation?: string;
}

const AY_SERVICE_CATALOGUE: ServiceCategory[] = [
  {
    id: "cat-1",
    name: "Statutory & Financial Audit",
    price: "From AED 8,500 / year",
    tagline: "MOE Approved Auditor in Abu Dhabi, Dubai & Freezones",
    intro: "Independent statutory audit services in compliance with International Standards on Auditing (ISA) and UAE Commercial Companies Law.",
    subServices: [
      "MOE Approved Statutory Audit Report",
      "Freezone Annual Audit Compliance (DMCC, DAFZA, JAFZA, RAKEZ, ADGM, DIFC)",
      "IFRS Financial Statement Preparation",
      "Internal Control & Fraud Risk Assessment",
      "Liquidation & Special Purpose Audit Reports",
    ],
    accreditation: "MOE Registered Auditor",
  },
  {
    id: "cat-2",
    name: "UAE Corporate Tax Advisory",
    price: "From AED 5,000 / filing",
    tagline: "FTA Approved Tax Agency (Tax Agency No. 1002345678)",
    intro: "Comprehensive Corporate Tax planning, registration, assessment, and tax return preparation under Federal Decree-Law No. 47 of 2022.",
    subServices: [
      "Corporate Tax Registration & TRN Issuance",
      "Corporate Tax Impact Assessment & Structuring",
      "Annual Corporate Tax Return Filing",
      "Qualifying Free Zone Person (QFZP) Optimization",
      "Tax Residency Certificate (TRC) Application",
    ],
    accreditation: "FTA Approved Tax Agency",
  },
  {
    id: "cat-3",
    name: "VAT & Excise Tax Services",
    price: "From AED 1,500 / quarter",
    tagline: "End-to-End Indirect Tax Compliance",
    intro: "Expert VAT compliance, voluntary disclosure submission, reconsiderations, and tax audit support.",
    subServices: [
      "VAT Registration & De-registration",
      "Quarterly VAT Return Filing & Reconciliation",
      "Voluntary Disclosure (VD) Submission",
      "FTA Tax Audit Representation",
      "Excise Tax Registration & Filing",
    ],
    accreditation: "FTA Registered",
  },
  {
    id: "cat-4",
    name: "Accounting & Bookkeeping",
    price: "From AED 2,500 / month",
    tagline: "Dedicated Cloud Accounting Team",
    intro: "Complete outsourced accounting services utilizing FTA-compliant cloud software (Zoho Books, QuickBooks, Xero).",
    subServices: [
      "Monthly Outsourced Bookkeeping Retainer",
      "Cloud Accounting Setup (Zoho Books, Xero, QuickBooks)",
      "Management Accounts & P&L Reporting",
      "Payroll & WPS Compliance Processing",
      "Inventory & Asset Tracking",
    ],
    accreditation: "Zoho & Xero Certified Partner",
  },
  {
    id: "cat-5",
    name: "Transfer Pricing (TP) Documentation",
    price: "From AED 15,000 / project",
    tagline: "OECD-Compliant TP Arm's Length Studies",
    intro: "Transfer pricing documentation compliance covering related party transactions and connected persons under UAE Corporate Tax Law.",
    subServices: [
      "Local File & Master File Preparation",
      "Country-by-Country Reporting (CbCR)",
      "Transfer Pricing Disclosure Form Filing",
      "Arm's Length Benchmark Analysis",
    ],
    accreditation: "OECD Guidelines Compliant",
  },
  {
    id: "cat-6",
    name: "AML (Anti-Money Laundering) Compliance",
    price: "From AED 6,000 / assessment",
    tagline: "DNFBPs Regulatory Compliance (MOE & CBUAE)",
    intro: "Anti-Money Laundering frameworks for Designated Non-Financial Businesses and Professions (Auditors, Real Estate, Dealers in Precious Metals).",
    subServices: [
      "goAML System Registration",
      "Enterprise Risk Assessment & Policy Drafting",
      "Customer Due Diligence (CDD) & Sanctions Screening",
      "Annual AML Independent Review Report",
    ],
    accreditation: "MOE goAML Framework",
  },
  {
    id: "cat-7",
    name: "CFO Advisory & Financial Consulting",
    price: "From AED 7,500 / month",
    tagline: "Strategic Financial Leadership for Growing Businesses",
    intro: "Fractional Virtual CFO services, business valuations, feasibility studies, and working capital optimization.",
    subServices: [
      "Virtual CFO Retainer",
      "Financial Modeling & Budget Variance Analysis",
      "Working Capital & Cash Flow Management",
      "Business Valuation & M&A Due Diligence",
    ],
    accreditation: "CPA / CA Advisory Team",
  },
  {
    id: "cat-8",
    name: "Economic Substance Regulations (ESR)",
    price: "From AED 4,000 / year",
    tagline: "Ministry of Finance ESR Filing Compliance",
    intro: "Assessing relevant activities and preparing economic substance notifications and reports.",
    subServices: [
      "ESR Relevant Activity Assessment",
      "Annual ESR Notification Filing",
      "Economic Substance Report Submission",
      "Economic Substance Test Compliance Review",
    ],
    accreditation: "MOF Compliant",
  },
  {
    id: "cat-9",
    name: "Business Setup & Liquidation",
    price: "From AED 12,000 / package",
    tagline: "Mainland, Freezone & Offshore Structuring",
    intro: "Seamless corporate structuring across Dubai, Abu Dhabi, Sharjah, and major UAE Free Zones with corporate bank account assistance.",
    subServices: [
      "Dubai & Abu Dhabi Mainland DED License Setup",
      "Free Zone Incorporation (DMCC, DAFZA, JAFZA, RAKEZ, ADGM, DIFC)",
      "Corporate Bank Account Opening Assistance",
      "Company Liquidation & Deregistration",
    ],
    accreditation: "UAE DED & Freezone Partner",
  },
];

const ACTIVE_ENGAGEMENTS = [
  { id: "eng-1", customer: "Capital Health UAE", service: "Statutory Audit 2024-2025", value: 28500, status: "Active" },
  { id: "eng-2", customer: "Royal Crest Real Estate DMCC", service: "Corporate Tax Retainer & Filing", value: 18000, status: "Active" },
  { id: "eng-3", customer: "Apex Tech Innovations FZ-LLC", service: "VAT Return Filing (Quarterly)", value: 6000, status: "Active" },
];

function Services() {
  const [expandedId, setExpandedId] = useState<string | null>("cat-1");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Services & Audit Catalogue"
        subtitle="Manage active client engagements and explore AY Astute Group's 9 core service pillars."
        actions={
          <Button className="rounded-xl" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> New Service Engagement
          </Button>
        }
      />

      {/* Brand Credentials Banner */}
      <div className="mb-6 rounded-2xl border bg-gradient-to-r from-primary/10 via-card to-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-primary text-primary-foreground font-semibold shadow-xs">
                MOE Approved Auditor
              </Badge>
              <Badge className="bg-secondary text-secondary-foreground font-semibold shadow-xs">
                FTA Tax Agency No. 1002345678
              </Badge>
              <Badge variant="outline" className="font-semibold bg-card border-muted-foreground/30 text-foreground">
                FinAce Belgium Alliance (SAP S/4HANA)
              </Badge>
              <Badge variant="outline" className="font-semibold bg-success-soft text-success border-success/40">
                UAE E-Invoicing 2026 Ready
              </Badge>
            </div>
            <h2 className="mt-2 font-display text-lg font-bold text-foreground">
              AY Astute Group (AY CA Auditing LLC & Astute Tax Consultancy LLC)
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Dubai Office: Deira (Abdullah Kamber Business Center) · Abu Dhabi Office: Hamdan St (Omeir Bin Yousef Bldg)
            </p>
          </div>
          <div className="flex items-center gap-6 text-center text-xs border-t lg:border-t-0 lg:border-l pt-3 lg:pt-0 lg:pl-6">
            <div>
              <p className="font-display text-2xl font-bold text-primary">1,100+</p>
              <p className="text-muted-foreground text-[11px]">Clients Served</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-primary">10+</p>
              <p className="text-muted-foreground text-[11px]">Years in UAE</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-primary">18+</p>
              <p className="text-muted-foreground text-[11px]">Industries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Service Engagements */}
      <SectionCard title="Active Service Engagements" description="Currently running client service contracts">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Account</TableHead>
              <TableHead>Service Engagement</TableHead>
              <TableHead>Value (AED)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ACTIVE_ENGAGEMENTS.map((eng) => (
              <TableRow key={eng.id} className="hover:bg-accent/40">
                <TableCell className="font-bold text-foreground">{eng.customer}</TableCell>
                <TableCell className="text-xs font-medium text-primary">{eng.service}</TableCell>
                <TableCell className="font-mono text-xs font-bold">AED {eng.value.toLocaleString()}</TableCell>
                <TableCell>
                  <StatusBadge status={eng.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" onClick={() => toast.success("Renewal workflow initiated!")}>
                    Renew Engagement
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {/* 9 Service Pillars Grid */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold">AY Astute Group 9 Core Service Pillars</h2>
            <p className="text-xs text-muted-foreground">Official auditing, tax advisory, AML, and consulting offerings.</p>
          </div>
          <Badge variant="outline" className="rounded-full">
            9 Categories · 40+ Sub-services
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
          {AY_SERVICE_CATALOGUE.map((cat) => {
            const isExpanded = expandedId === cat.id;
            return (
              <div key={cat.id} className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">{cat.name}</h3>
                    <p className="text-xs font-bold text-primary mt-0.5">{cat.price}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{cat.intro}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg shrink-0"
                    onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                {isExpanded && (
                  <div className="mt-4 border-t pt-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Included Sub-services:</p>
                    <ul className="space-y-1.5">
                      {cat.subServices.map((sub) => (
                        <li key={sub} className="flex items-start gap-2 text-xs text-foreground">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>

                    {cat.accreditation && (
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <Award className="h-3.5 w-3.5 text-warning shrink-0" />
                        <span className="font-semibold text-muted-foreground">Accreditation:</span>
                        <Badge variant="secondary" className="text-[10px] font-semibold">
                          {cat.accreditation}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Engagement Modal */}
      {isAddModalOpen && (
        <Dialog open={true} onOpenChange={() => setIsAddModalOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Service Engagement</DialogTitle>
              <DialogDescription>Register an active audit or tax engagement for a client account.</DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Service engagement created!");
                setIsAddModalOpen(false);
              }}
              className="space-y-4 py-2"
            >
              <div>
                <Label htmlFor="cn">Client Name *</Label>
                <Input id="cn" placeholder="Capital Health UAE" required />
              </div>
              <div>
                <Label htmlFor="sl">Service Pillar *</Label>
                <Input id="sl" placeholder="Statutory Audit 2025 (MOE Approved)" required />
              </div>
              <div>
                <Label htmlFor="val">Contract Value (AED) *</Label>
                <Input id="val" type="number" placeholder="28500" required />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Engagement</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
