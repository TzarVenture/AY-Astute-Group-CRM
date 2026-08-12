export type LeadStatus =
  | "DND"
  | "Call Back"
  | "Future Follow-up"
  | "Hot Follow-up"
  | "Existing Client"
  | "Already Contacted"
  | "Not Interested"
  | "Not Contacted"
  | "Appointment Fixed"
  | "New"
  | "Proposal Sent"
  | "Closed";

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  mobile: string;
  email: string;
  city: string;
  country: string;
  status: "Active" | "Pending" | "Expired" | "Prospect";
  service: string;
  expiry: string;
  caller: string;
  nationality: string;
  trn: string;
  engagementType: "Statutory Audit" | "Corporate Tax" | "VAT & Excise" | "Accounting" | "Advisory";
  jobTitle: string;
  company: string;
  leadSource: string;
  createdDate: string;
}

const firstNames = ["Ahmed", "Fatima", "Mohammed", "Aisha", "Omar", "Layla", "Yusuf", "Zainab", "Hassan", "Mariam", "Khalid", "Noor", "Rashid", "Sara", "Ibrahim", "Huda", "Salem", "Amina", "Faisal", "Reem"];
const lastNames = ["Al Mansoori", "Al Maktoum", "Al Nahyan", "Al Qassimi", "Al Falasi", "Al Shamsi", "Al Ali", "Al Suwaidi", "Al Zaabi", "Al Ketbi", "Khan", "Sharma", "Patel", "Raj", "Malik", "Iqbal", "Hussain", "Rahman", "Farooq", "Siddiqui"];
const cities = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];
const countries = ["UAE", "India", "Pakistan", "Egypt", "Philippines", "UK", "Jordan", "Lebanon"];
const services = [
  "Statutory Audit",
  "Corporate Tax Filing",
  "VAT Return Filing",
  "Internal Audit",
  "Transfer Pricing",
  "Accounting & Bookkeeping",
  "ESR & UBO Compliance",
  "Business Setup",
];
const callers = ["Priya Menon", "Rahul Sharma", "Anita Desai", "Kareem Ali", "Sonia Verma"];
const sources = ["Referral", "Website", "LinkedIn", "Event / Seminar", "Google", "Existing Client"];
const statuses: Customer["status"][] = ["Active", "Pending", "Expired", "Prospect"];
const engagementTypes: Customer["engagementType"][] = ["Statutory Audit", "Corporate Tax", "VAT & Excise", "Accounting", "Advisory"];
const jobs = ["CFO", "Finance Director", "Managing Director", "Group Controller", "Head of Tax", "Finance Manager", "CEO", "Head of Compliance"];
const companies = [
  "LuLu Group International",
  "Komatsu Middle East",
  "J.S. Lootah Group",
  "LoneStar Group",
  "AMIT International Group",
  "BIOPHARMA FZE",
  "MEPCO",
  "RV Gulf",
  "Sentor Electrical LLC",
  "WeAre Alive Animation Studio",
  "New East General Trading",
  "United Trade Services (UTS)",
  "Arec Engineering Consultants",
  "Asia Prime General Contracting",
  "AAF International (Daikin Group)",
  "TAMM Real Estate",
  "Ascendia Group",
  "Rain Speciality Coffee",
  "Mwasalat",
  "GII Capital",
  "Stellium",
  "JADA Technology Solutions",
];

function pad(n: number) { return String(n).padStart(4, "0"); }

export const CUSTOMERS: Customer[] = Array.from({ length: 22 }, (_, i) => {
  const first = firstNames[i % firstNames.length];
  const last = lastNames[(i * 3) % lastNames.length];
  const company = companies[i % companies.length];
  return {
    id: `AY-${pad(1024 + i)}`,
    name: `${first} ${last}`,
    avatar: `https://i.pravatar.cc/120?img=${(i % 70) + 1}`,
    mobile: `+971 5${(i % 9)} ${100 + i} ${1000 + i * 7}`,
    email: `${first.toLowerCase()}.${last.split(" ").join("").toLowerCase()}@${company.split(" ")[0].toLowerCase()}.com`,
    city: cities[i % cities.length],
    country: countries[i % countries.length],
    status: statuses[i % statuses.length],
    service: services[i % services.length],
    expiry: `2026-${String(((i % 12) + 1)).padStart(2, "0")}-${String(((i * 3) % 27) + 1).padStart(2, "0")}`,
    caller: callers[i % callers.length],
    nationality: countries[i % countries.length],
    trn: `100${String(200000 + i * 4321).slice(0, 9)}00003`,
    engagementType: engagementTypes[i % engagementTypes.length],
    jobTitle: jobs[i % jobs.length],
    company,
    leadSource: sources[i % sources.length],
    createdDate: `2025-${String(((i % 12) + 1)).padStart(2, "0")}-${String(((i * 2) % 27) + 1).padStart(2, "0")}`,
  };
});

export interface StatusAuditLog {
  id: string;
  previousStatus: LeadStatus;
  newStatus: LeadStatus;
  updatedBy: string;
  timestamp: string;
  notes?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  assigned: string;
  status: LeadStatus;
  phone: string;
  dealValue: number;
  lastContacted: string;
  createdAt: string;
  statusHistory?: StatusAuditLog[];
}

export const REQUIRED_LEAD_STATUSES: LeadStatus[] = [
  "Not Contacted",
  "Already Contacted",
  "Hot Follow-up",
  "Call Back",
  "Appointment Fixed",
  "Future Follow-up",
  "Existing Client",
  "Not Interested",
  "DND",
];

const leadStatuses: LeadStatus[] = [
  "Not Contacted",
  "Already Contacted",
  "Hot Follow-up",
  "Call Back",
  "Appointment Fixed",
  "Future Follow-up",
  "Existing Client",
  "Not Interested",
  "DND",
  "New",
  "Proposal Sent",
];

const leadCompanies = [
  "LuLu Group", "Komatsu ME", "J.S. Lootah", "LoneStar Group", "AMIT International", "BIOPHARMA FZE",
  "MEPCO", "RV Gulf", "Sentor Electrical", "WeAre Alive Studio", "New East Trading", "United Trade Services",
  "Arec Engineering", "Asia Prime Contracting", "AAF International", "TAMM Real Estate", "Ascendia Group",
  "Rain Speciality Coffee", "Mwasalat", "GII Capital", "Stellium", "JADA Tech", "Al Futtaim", "Damac Properties"
];

export const LEADS: Lead[] = Array.from({ length: 28 }, (_, i) => {
  const first = firstNames[(i * 2) % firstNames.length];
  const last = lastNames[(i * 5) % lastNames.length];
  const comp = leadCompanies[i % leadCompanies.length];
  const status = leadStatuses[i % leadStatuses.length];
  return {
    id: `LEAD-${pad(2001 + i)}`,
    name: `${first} ${last}`,
    company: comp,
    email: `${first.toLowerCase()}.${last.split(" ").join("").toLowerCase()}@${comp.split(" ")[0].toLowerCase()}.ae`,
    source: sources[i % sources.length],
    assigned: callers[i % callers.length],
    status,
    phone: `+971 5${(i % 9)} ${200 + i} ${3000 + i * 3}`,
    dealValue: (i + 1) * 12500,
    lastContacted: `2026-08-0${(i % 9) + 1}`,
    createdAt: `2026-07-0${(i % 7) + 1}`,
    statusHistory: [
      {
        id: `log-${i}-1`,
        previousStatus: "Not Contacted",
        newStatus: status,
        updatedBy: callers[i % callers.length],
        timestamp: "2026-08-05 10:30 AM",
        notes: `Initial contact via telesales call. Status updated to ${status}.`
      }
    ]
  };
});

export const LEAD_SOURCE_COUNTS = [
  { source: "Referral", count: 128, color: "#C8102E" },
  { source: "Website", count: 96, color: "#0D47A1" },
  { source: "LinkedIn", count: 74, color: "#0A66C2" },
  { source: "Event / Seminar", count: 52, color: "#F59E0B" },
  { source: "Google", count: 34, color: "#EA4335" },
  { source: "Existing Client", count: 41, color: "#059669" },
];

export interface FollowUp {
  id: string;
  customer: string;
  customerId: string;
  time: string;
  purpose: string;
  caller: string;
  reminder: string;
  status: "Scheduled" | "Completed" | "Overdue" | "Missed";
  nextFollowUp: string;
  notes: string;
  bucket: "Today" | "Tomorrow" | "This Week" | "Overdue" | "Completed";
}

const purposes = [
  "Audit engagement kickoff",
  "Corporate tax return review",
  "VAT filing reminder",
  "Transfer pricing documentation call",
  "Financial statements sign-off",
  "Proposal walkthrough",
  "Fee negotiation",
  "Renewal discussion",
];
const buckets: FollowUp["bucket"][] = ["Today", "Tomorrow", "This Week", "Overdue", "Completed"];

export const FOLLOWUPS: FollowUp[] = Array.from({ length: 28 }, (_, i) => ({
  id: `FU-${pad(3001 + i)}`,
  customer: CUSTOMERS[i % CUSTOMERS.length].name,
  customerId: CUSTOMERS[i % CUSTOMERS.length].id,
  time: `2026-07-0${(i % 7) + 1} ${String(9 + (i % 8)).padStart(2, "0")}:${(i % 6) * 10 || "00"}`,
  purpose: purposes[i % purposes.length],
  caller: callers[i % callers.length],
  reminder: ["15 min", "1 hour", "1 day"][i % 3],
  status: (["Scheduled", "Completed", "Overdue", "Missed"] as const)[i % 4],
  nextFollowUp: `2026-07-${String(10 + (i % 15)).padStart(2, "0")}`,
  notes: "Client shared draft trial balance. Awaiting bank confirmations and related-party schedules.",
  bucket: buckets[i % buckets.length],
}));

export interface ServiceRow {
  id: string;
  service: string;
  start: string;
  end: string;
  amount: number;
  status: "Active" | "Expiring" | "Expired" | "Renewed";
}

export const ACTIVE_SERVICES: ServiceRow[] = [
  { id: "SVC-1001", service: "Statutory Audit — FY 2025", start: "2025-01-01", end: "2026-04-30", amount: 45000, status: "Active" },
  { id: "SVC-1002", service: "Corporate Tax Advisory (Retainer)", start: "2025-11-01", end: "2026-10-31", amount: 60000, status: "Expiring" },
  { id: "SVC-1003", service: "VAT Return Filing (Quarterly)", start: "2025-08-15", end: "2026-08-14", amount: 18000, status: "Active" },
  { id: "SVC-1004", service: "Accounting & Bookkeeping (Monthly)", start: "2025-05-01", end: "2026-04-30", amount: 96000, status: "Active" },
];

export const SERVICE_HISTORY: ServiceRow[] = [
  { id: "SVC-0901", service: "Internal Audit — FY 2023", start: "2023-06-10", end: "2024-06-09", amount: 32000, status: "Renewed" },
  { id: "SVC-0902", service: "Transfer Pricing Documentation", start: "2023-02-01", end: "2024-01-31", amount: 55000, status: "Expired" },
  { id: "SVC-0903", service: "Business Setup — DMCC Freezone", start: "2022-01-20", end: "2023-01-19", amount: 28500, status: "Expired" },
];

export interface ServiceCategory {
  name: string;
  tagline: string;
  icon: string;
  price: string;
  intro: string;
  subServices: string[];
  partners?: string[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    name: "Audit & Assurance",
    tagline: "MOE-approved statutory & assurance engagements",
    icon: "ClipboardCheck",
    price: "From AED 25,000",
    intro:
      "One of the most trusted auditing and assurance service providers in the UAE, delivering audit and assurance solutions that go far beyond compliance.",
    subServices: [
      "Statutory Audit (Interim Review, Annual Year-End Audit)",
      "Internal Audit",
      "Forensic Audit",
      "Inventory Audit",
      "Financial Due Diligence",
      "Agreed Upon Procedures",
      "Revenue Assurance and Certification",
      "AML Training",
    ],
  },
  {
    name: "Corporate Tax",
    tagline: "End-to-end UAE Corporate Tax & Transfer Pricing",
    icon: "Landmark",
    price: "From AED 15,000",
    intro:
      "A trusted name in Corporate Tax Consultancy across Dubai, Abu Dhabi and the wider UAE — tailored solutions to stay compliant, reduce risk and optimise tax positions.",
    subServices: [
      "Business Impact Analysis",
      "Transfer Pricing Policy and Methodology Review",
      "Transfer Pricing Implementation Support",
      "Transfer Pricing Documentation Support",
      "Transfer Pricing Benchmarking",
      "Tax Planning Advisory",
      "Tax / Group Registration",
      "Annual Tax Computation and Return Filing",
      "Advance Tax Ruling Support",
      "Tax and Transfer Pricing Training",
    ],
  },
  {
    name: "VAT & Excise Advisory",
    tagline: "FTA-approved tax agency representation",
    icon: "Receipt",
    price: "From AED 12,000",
    intro:
      "Navigating VAT in the UAE demands in-depth expertise, proactive strategy and precise execution — from registration through FTA representation.",
    subServices: [
      "VAT and Excise Registration / De-registration",
      "Excise Product Registration and Compliance",
      "Health Checks and Compliance Reviews",
      "Return Filing and Refund Assistance",
      "Designated Zone and Warehouse Keeper Registration / Renewal",
      "Transaction Advisory for VAT-impact evaluation",
      "Tax Agency Representation before FTA",
      "Audit Assistance and Documentation Support",
      "Voluntary Disclosure and Reconsideration for Penalty Waivers",
    ],
  },
  {
    name: "Accounting Services",
    tagline: "R2R, managed accounting & IFRS reporting",
    icon: "Calculator",
    price: "From AED 4,500 / mo",
    intro:
      "Comprehensive, cost-effective and reliable accounting and accounting-review services tailored to the unique needs of UAE businesses.",
    subServices: [
      "Financial Books and Records — Record to Report Services",
      "Accounting & Corporate Reporting — Managed Services",
      "IFRS Implementation and Transition Management",
      "Multi-GAAP Financial Statements Preparation",
      "Balance Sheet Reconciliation, Substantiation and Governance",
      "Special Purpose and Operational Reconciliations",
      "Preparation of Standard Operating Procedures (SOP) & Finance Manual",
      "Accounting Policy Advisory",
      "Implementation Support for Accounting Systems / ERP",
      "Asset Register Reconciliation and Physical Verification",
      "Accounting Process Automation",
      "Specialised Training",
    ],
  },
  {
    name: "Technology Consulting",
    tagline: "SAP S/4HANA, cyber & digital transformation",
    icon: "Cpu",
    price: "On engagement",
    intro:
      "Strategic and specialised SAP S/4HANA consulting and project management services across the Middle East, driving digital transformation and operational efficiency.",
    subServices: [
      "SAP S/4HANA Implementation and Staff Augmentation",
      "Project Management Services — BRD, FRD, UAT, documentation",
      "Information Security Audit and ISO Certification Support",
      "IT Risk Assessment and Audit",
      "Cybersecurity Consulting",
      "Business Process Automation",
      "Cloud Migration Strategy and Execution",
      "Digital Transformation Roadmap and Delivery",
    ],
    partners: ["FinAce Consulting (Belgium) — SAP S/4HANA Partner"],
  },
  {
    name: "Mergers & Acquisitions",
    tagline: "Buy-side, sell-side & post-merger integration",
    icon: "GitMerge",
    price: "From AED 75,000",
    intro:
      "End-to-end M&A advisory tailored to corporates, SMEs, family businesses and private investors operating in the UAE and across borders.",
    subServices: [
      "Buy-side Advisory",
      "Sell-side Advisory",
      "Due Diligence Services",
      "Business Valuation and Deal Structuring",
      "Post-Merger Integration Support",
    ],
  },
  {
    name: "Finance Consulting",
    tagline: "CFO services, risk, ESG & governance",
    icon: "TrendingUp",
    price: "On engagement",
    intro:
      "Trusted business financial advisor in the UAE — strategic advisory for SMEs and large corporations to define vision, execute strategy and sustain performance.",
    subServices: [
      "Full Suite of CFO Services",
      "Process Mapping, Simplification & Process Directory Services",
      "Finance Transformation Services",
      "Cost Optimisation Services",
      "Environmental, Social and Governance (ESG) Reporting and Disclosures",
      "Business / Enterprise Risk Advisory",
      "Operational Risk Review",
      "Outsourcing / Vendor Risk Assessment Advisory",
      "Internal Control / SOX / ICOFR Design and Assessment Advisory",
      "Contract Review for Oversight, Risk Reduction and Cost Efficiency",
      "Branch / Location Control Review and Financial Oversight",
      "Business Continuity Design & Monitoring (Table-Top Scenarios)",
      "Anti-Money Laundering (AML) Compliance",
      "ESR and UBO Compliance",
      "Financial Feasibility Assessment",
    ],
  },
  {
    name: "Business Set-up & Liquidation",
    tagline: "Mainland, Free Zone & Offshore formation",
    icon: "Building2",
    price: "From AED 15,000",
    intro:
      "Establishing or closing a business in the UAE involves multiple legal, regulatory and financial steps — we deliver end-to-end support across Mainland, Free Zones and Offshore jurisdictions.",
    subServices: [
      "Business structuring & jurisdiction advisory (Mainland, Free Zone, Offshore)",
      "Trade licence issuance and government approvals",
      "MOA drafting, shareholder & UBO documentation",
      "Bank account opening support",
      "Company amendments, share transfers and restructuring",
      "Voluntary liquidation and formal deregistration",
      "Financial settlements and creditor notifications",
      "Free-zone specific set-up (DMCC, DIFC, DAFZA, JAFZA, RAKEZ)",
    ],
  },
  {
    name: "E-Invoicing",
    tagline: "FTA-compliant e-invoicing for 2026-27",
    icon: "FileStack",
    price: "On engagement",
    intro:
      "Comprehensive E-Invoicing solutions to help businesses transition seamlessly to the UAE's new digital invoicing framework, aligned with FTA technical standards.",
    subServices: [
      "Impact assessment and gap analysis",
      "System & Technology Integration",
      "Accounting and VAT reconciliation control testing",
      "Compliance Monitoring",
      "Accredited Service Provider (ASP) integration & onboarding",
    ],
    partners: ["Complyance", "Covoro"],
  },
];

// Legacy alias — keeps older imports (icon strings, price, name, desc) working.
export const SERVICE_CATALOGUE = SERVICE_CATEGORIES.map((s) => ({
  name: s.name,
  desc: s.tagline,
  price: s.price,
  icon: s.icon,
}));

export const INDUSTRIES = [
  { name: "Oil & Gas", icon: "Fuel" },
  { name: "Healthcare", icon: "HeartPulse" },
  { name: "IT & Technology", icon: "Cpu" },
  { name: "Shipping & Logistics", icon: "Ship" },
  { name: "Insurance", icon: "Shield" },
  { name: "Banking & Financial Services", icon: "Landmark" },
  { name: "Hospitality", icon: "UtensilsCrossed" },
  { name: "FMCG & Retail", icon: "ShoppingCart" },
  { name: "Aviation", icon: "Plane" },
  { name: "Clean Technology", icon: "Leaf" },
  { name: "Manufacturing", icon: "Factory" },
  { name: "Media & Entertainment", icon: "Clapperboard" },
  { name: "Real Estate", icon: "Building" },
  { name: "Education", icon: "GraduationCap" },
  { name: "Transportation", icon: "Truck" },
  { name: "Contracting", icon: "HardHat" },
  { name: "Trading & Services", icon: "Store" },
  { name: "Pharmaceuticals", icon: "Pill" },
];

export const ACCREDITATIONS = [
  "UAE Ministry of Economy Approved Auditor",
  "FTA Approved Tax Agency",
  "ISO 9001:2015 Certified",
  "Free Zone Accredited (DMCC, DIFC, DAFZA, JAFZA, RAKEZ)",
  "Approved Dubai ICV Auditor",
];

export const COMPANY_STATS = [
  { label: "Years in UAE", value: "10+" },
  { label: "Happy Customers", value: "1,100+" },
  { label: "Industries Served", value: "18+" },
  { label: "Geographical Presence", value: "3+" },
  { label: "Approved Free Zones", value: "5+" },
];

export interface Invoice {
  id: string;
  number: string;
  customer: string;
  customerId: string;
  date: string;
  services: { name: string; qty: number; price: number }[];
  paid: boolean;
}

export const INVOICES: Invoice[] = [
  { id: "INV-2026-0142", number: "INV-2026-0142", customer: CUSTOMERS[0].name, customerId: CUSTOMERS[0].id, date: "2026-07-01", paid: true, services: [{ name: "Statutory Audit FY 2025", qty: 1, price: 45000 }, { name: "Out-of-pocket expenses", qty: 1, price: 1200 }] },
  { id: "INV-2026-0141", number: "INV-2026-0141", customer: CUSTOMERS[1].name, customerId: CUSTOMERS[1].id, date: "2026-06-29", paid: false, services: [{ name: "Corporate Tax Advisory — Annual Retainer", qty: 1, price: 60000 }] },
  { id: "INV-2026-0140", number: "INV-2026-0140", customer: CUSTOMERS[2].name, customerId: CUSTOMERS[2].id, date: "2026-06-28", paid: true, services: [{ name: "VAT Return Filing Q2", qty: 1, price: 4500 }, { name: "FTA Reconsideration Support", qty: 1, price: 3800 }] },
  { id: "INV-2026-0139", number: "INV-2026-0139", customer: CUSTOMERS[3].name, customerId: CUSTOMERS[3].id, date: "2026-06-26", paid: true, services: [{ name: "Transfer Pricing Documentation FY 2025", qty: 1, price: 55000 }] },
  { id: "INV-2026-0138", number: "INV-2026-0138", customer: CUSTOMERS[4].name, customerId: CUSTOMERS[4].id, date: "2026-06-25", paid: false, services: [{ name: "Internal Audit — Q2 Review", qty: 1, price: 18500 }] },
];

export const PAYMENTS = [
  { invoice: "INV-2026-0142", customer: CUSTOMERS[0].name, amount: 48510, method: "Bank Transfer", date: "2026-07-01", status: "Paid" },
  { invoice: "INV-2026-0140", customer: CUSTOMERS[2].name, amount: 8715, method: "Bank Transfer", date: "2026-06-28", status: "Paid" },
  { invoice: "INV-2026-0139", customer: CUSTOMERS[3].name, amount: 57750, method: "Cheque", date: "2026-06-26", status: "Paid" },
  { invoice: "INV-2026-0141", customer: CUSTOMERS[1].name, amount: 63000, method: "Card", date: "2026-06-30", status: "Pending" },
  { invoice: "INV-2026-0138", customer: CUSTOMERS[4].name, amount: 19425, method: "Bank Transfer", date: "2026-06-25", status: "Partial" },
  { invoice: "INV-2026-0137", customer: CUSTOMERS[5].name, amount: 26250, method: "Bank Transfer", date: "2026-06-24", status: "Paid" },
  { invoice: "INV-2026-0136", customer: CUSTOMERS[6].name, amount: 4725, method: "Card", date: "2026-06-23", status: "Paid" },
  { invoice: "INV-2026-0135", customer: CUSTOMERS[7].name, amount: 96000, method: "Bank Transfer", date: "2026-06-22", status: "Paid" },
];

export const ACTIVITY_FEED = [
  { time: "09:10", type: "Lead Created", detail: "LuLu Group — LinkedIn enquiry for Corporate Tax", icon: "UserPlus" },
  { time: "09:20", type: "Follow-up Completed", detail: "Komatsu ME — VAT filing reminder", icon: "PhoneCall" },
  { time: "09:45", type: "Engagement Renewed", detail: "Statutory Audit — J.S. Lootah Group FY 2026", icon: "RefreshCw" },
  { time: "10:00", type: "Payment Received", detail: "AED 48,510 — Bank Transfer", icon: "CreditCard" },
  { time: "10:32", type: "Document Uploaded", detail: "Trial Balance FY25 — MEPCO", icon: "FileUp" },
  { time: "11:05", type: "Lead Converted", detail: "TAMM Real Estate → Transfer Pricing engagement", icon: "TrendingUp" },
  { time: "11:40", type: "Note Added", detail: "Kick-off meeting scheduled for Monday 10 AM", icon: "MessageSquare" },
];

export const NOTIFICATIONS = [
  { title: "11 audit engagements to sign off", detail: "FY 2025 statutory audits pending partner review", time: "2m ago" },
  { title: "New lead from LinkedIn", detail: "GII Capital enquiring about VAT health-check", time: "18m ago" },
  { title: "Payment received", detail: "AED 48,510 — INV-2026-0142 (LuLu Group)", time: "1h ago" },
  { title: "Corporate Tax return overdue", detail: "AMIT International — filing due 3 days ago", time: "3h ago" },
];

export const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 384000 },
  { month: "Feb", revenue: 412000 },
  { month: "Mar", revenue: 528000 },
  { month: "Apr", revenue: 612000 },
  { month: "May", revenue: 574000 },
  { month: "Jun", revenue: 698000 },
  { month: "Jul", revenue: 742000 },
];

export const CONVERSION_TREND = [
  { week: "W1", rate: 18 },
  { week: "W2", rate: 22 },
  { week: "W3", rate: 26 },
  { week: "W4", rate: 24 },
  { week: "W5", rate: 31 },
  { week: "W6", rate: 34 },
  { week: "W7", rate: 38 },
];

export const NOTES_DUMMY = [
  { id: "n1", author: "Priya Menon", time: "Today, 10:24", text: "Client confirmed FY25 statutory audit engagement. Awaiting signed engagement letter and prior-year working papers." },
  { id: "n2", author: "Rahul Sharma", time: "Yesterday, 16:12", text: "Discussed Corporate Tax registration timeline with CFO. Group registration proposal to be shared by Thursday." },
  { id: "n3", author: "Anita Desai", time: "Jul 3, 09:00", text: "Sent VAT health-check scope and fee proposal via email. Client will revert after board review." },
];

export const TIMELINE_EVENTS = [
  { time: "2026-07-01 09:10", type: "Lead Created", detail: "Source: LinkedIn — referral from existing client" },
  { time: "2026-07-01 11:22", type: "Discovery Call", detail: "Scope discussion with CFO, 22 min" },
  { time: "2026-07-02 14:05", type: "Documents Uploaded", detail: "Trade licence, MOA, prior FS" },
  { time: "2026-07-03 10:40", type: "Engagement Letter Signed", detail: "Statutory Audit FY 2025 — AED 45,000" },
  { time: "2026-07-03 12:15", type: "Engagement Activated", detail: "Audit team assigned, planning memo issued" },
  { time: "2026-07-05 15:30", type: "Fieldwork Started", detail: "Interim review commenced at client premises" },
  { time: "2026-07-07 09:00", type: "Reminder Sent", detail: "Automated request for bank confirmations" },
];

export const DOCUMENT_TYPES = [
  { type: "Trade Licence", status: "Verified", expiry: "2027-04-12" },
  { type: "Memorandum of Association", status: "Verified", expiry: "—" },
  { type: "VAT Certificate (TRN)", status: "Verified", expiry: "—" },
  { type: "Engagement Letter", status: "Verified", expiry: "2026-12-31" },
  { type: "Trial Balance FY 2025", status: "Uploaded", expiry: "—" },
  { type: "Bank Confirmations", status: "Pending", expiry: "—" },
  { type: "Prior Year Financials", status: "Uploaded", expiry: "—" },
];

export const USERS_LIST = [
  { name: "Sana Al Hashimi", email: "sana@ay-uae.com", role: "Managing Partner", status: "Active" },
  { name: "Priya Menon", email: "priya@ay-uae.com", role: "Audit Manager", status: "Active" },
  { name: "Rahul Sharma", email: "rahul@ay-uae.com", role: "Tax Consultant", status: "Active" },
  { name: "Anita Desai", email: "anita@ay-uae.com", role: "Senior Accountant", status: "Active" },
  { name: "Kareem Ali", email: "kareem@ay-uae.com", role: "Advisory Partner", status: "Active" },
  { name: "Sonia Verma", email: "sonia@ay-uae.com", role: "Associate", status: "Inactive" },
];

export const AUDIT_LOG = [
  { time: "2026-07-07 11:24", user: "Sana Al Hashimi", action: "Updated fee schedule for Statutory Audit engagements" },
  { time: "2026-07-07 10:03", user: "Priya Menon", action: "Reassigned 3 audit engagements to Rahul Sharma" },
  { time: "2026-07-06 17:45", user: "Kareem Ali", action: "Approved fee waiver AED 2,500 — INV-2026-0128" },
  { time: "2026-07-06 09:12", user: "Anita Desai", action: "Marked VAT filing follow-up completed for AY-1028" },
];
