import { generateHumanCoverLetter } from "../utils/coverLetterGenerator.js";

export const PIPELINE_STAGES = [
  { id: "saved", label: "Saved / Target", color: "indigo", badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "applied", label: "Applied", color: "cyan", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
  { id: "screening", label: "Screening / HR", color: "amber", badge: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { id: "interview", label: "Technical / Interview", color: "violet", badge: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { id: "offer", label: "Offer Received", color: "emerald", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "rejected", label: "Archived / Rejected", color: "slate", badge: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
];

const rawDefaultApplications = [
  {
    id: "APP-001",
    jobTitle: "Remote Operations & Workflow Specialist",
    company: "CloudScale Dynamics",
    salaryPhp: 55000,
    salaryDisplay: "₱55,000 / mo",
    status: "applied",
    jobUrl: "https://remotive.com/remote-jobs/business/operations-specialist",
    platform: "Remotive",
    dateApplied: "2026-11-20",
    followUpDate: "2026-11-27",
    resumeUsed: "Jesse_Aaron_Cuartero_Resume.pdf",
    notes: "Applied via official portal; emphasized Google Workspace automation and Apps Script expertise in cover letter.",
    location: "Worldwide (Remote)",
    matchScore: 94,
    lastUpdated: "2026-11-20T14:30:00Z",
    jobDescription: `We are looking for a Remote Operations & Workflow Specialist to help keep our internal systems structured and reliable as our distributed team grows.

Key Responsibilities:
- Build, maintain, and audit internal tracking sheets and dashboards using Google Workspace (Google Sheets, Docs, Apps Script).
- Identify repetitive manual data entry tasks and design simple workflow automations to save team hours.
- Document and update Standard Operating Procedures (SOPs) across operations, onboarding, and client delivery.
- Coordinate cross-functional handoffs and capture operational interaction metrics for weekly leadership reporting.

Requirements:
- 2+ years of experience in remote operations, database administration, or workflow coordination.
- Strong command of Google Sheets formulas, data validation, and Google Apps Script automations.
- High attention to detail, clear written communication, and ability to work independently in a remote setting.`
  },
  {
    id: "APP-002",
    jobTitle: "Google Workspace & Database Admin",
    company: "NextEra Tech Solutions",
    salaryPhp: 65000,
    salaryDisplay: "₱65,000 / mo",
    status: "screening",
    jobUrl: "https://weworkremotely.com/remote-jobs/nextera-google-workspace-admin",
    platform: "WeWorkRemotely",
    dateApplied: "2026-11-18",
    followUpDate: "2026-11-25",
    resumeUsed: "Jesse_Aaron_Cuartero_Resume.pdf",
    notes: "HR screening call scheduled; passed initial resume review.",
    location: "Remote (APAC / US overlap)",
    matchScore: 98,
    lastUpdated: "2026-11-19T09:15:00Z",
    jobDescription: `NextEra Tech Solutions is hiring a Google Workspace & Database Administrator to own our internal data integrity, workspace organization, and automated reporting tools.

What You Will Do:
- Manage member and client database records in Google Sheets and AppSheet with strict accuracy and confidentiality.
- Maintain and improve our receipt, billing, and status-tracking automations built on Google Apps Script.
- Support department leads with clean weekly operational reports and real-time visibility into business metrics.
- Audit workspace permissions, shared drives, and SOP documentation so every team member works from up-to-date templates.

Qualifications:
- Proven hands-on background with Google Workspace administration (Sheets, Docs, Drive, Apps Script, AppSheet).
- Experience managing structured databases and preventing data entry errors.
- Reliable home office setup with overlap availability across APAC or US mornings.`
  },
  {
    id: "APP-003",
    jobTitle: "Customer Operations & QA Specialist",
    company: "E-Commerce Pulse",
    salaryPhp: 48000,
    salaryDisplay: "₱48,000 / mo",
    status: "interview",
    jobUrl: "https://jobspresso.co/remote-work/ecommerce-pulse-ops-qa",
    platform: "Jobspresso",
    dateApplied: "2026-11-15",
    followUpDate: "2026-11-23",
    resumeUsed: "Jesse_Aaron_Cuartero_Resume.pdf",
    notes: "SOP and ticketing simulation assessment completed; scheduled for technical final round interview.",
    location: "100% Remote",
    matchScore: 89,
    lastUpdated: "2026-11-18T16:00:00Z",
    jobDescription: `E-Commerce Pulse is seeking a Customer Operations & QA Specialist to oversee inbound customer resolutions, order monitoring, and internal quality audits.

Core Duties:
- Manage prioritized inbound customer inquiries and complex fulfillment requests while adhering strictly to company SOPs.
- Conduct daily order monitoring, logistics tracking, and exception handling via Google Sheets and our CRM.
- Perform routine Quality Assurance checks on team tickets and operational logs to catch procedural errors early.
- Prepare clear briefing guides and operational documentation when workflows are updated.

Ideal Candidate:
- Background in e-commerce customer operations, logistics tracking, or QA auditing.
- Comfortable working with high-volume queues without sacrificing accuracy or customer care.
- Strong Google Sheets / Excel skills for daily reconciliation and tracking.`
  },
  {
    id: "APP-004",
    jobTitle: "Database & Operations Lead",
    company: "SaaS Flow Global",
    salaryPhp: 70000,
    salaryDisplay: "₱70,000 / mo",
    status: "saved",
    jobUrl: "https://remotive.com/remote-jobs/data/database-operations-lead",
    platform: "Remotive",
    dateApplied: "2026-11-21",
    followUpDate: "2026-11-28",
    resumeUsed: "Jesse_Aaron_Cuartero_Resume.pdf",
    notes: "High skill match (92%); preparing tailored cover letter highlighting receipt automation and AppSheet experience.",
    location: "Global Remote",
    matchScore: 92,
    lastUpdated: "2026-11-21T08:00:00Z",
    jobDescription: `SaaS Flow Global is looking for a detail-focused Database & Operations Lead to streamline back-office workflows, maintain clean CRM records, and automate operational reporting.

Key Responsibilities:
- Own end-to-end operational databases, ensuring data integrity across billing, customer onboarding, and internal tracking sheets.
- Develop automated administrative tools (such as receipt/invoice generation and alert scripts) to eliminate manual errors.
- Collaborate across support, finance, and management teams to refine SOPs and capture interaction metrics.
- Train team members on updated data entry standards and reporting workflows.

Requirements:
- BS in Information Technology or equivalent practical experience in Database & Operations Administration.
- Deep proficiency in Google Workspace (Sheets, Apps Script, AppSheet) and Microsoft Office Suite.
- Demonstrated discretion handling sensitive organizational and financial records.`
  },
  {
    id: "APP-005",
    jobTitle: "Administrative & Automation Coordinator",
    company: "Peak Digital Agency",
    salaryPhp: 50000,
    salaryDisplay: "₱50,000 / mo",
    status: "offer",
    jobUrl: "https://weworkremotely.com/remote-jobs/peak-digital-ops",
    platform: "WeWorkRemotely",
    dateApplied: "2026-11-05",
    followUpDate: "2026-11-24",
    resumeUsed: "Jesse_Aaron_Cuartero_Resume.pdf",
    notes: "Received written offer! Reviewing contract terms and equipment stipend details.",
    location: "Remote",
    matchScore: 88,
    lastUpdated: "2026-11-20T11:00:00Z",
    jobDescription: `Peak Digital Agency needs an Administrative & Automation Coordinator to organize our Google Drive workspace, track project deliverables, and automate recurring admin tasks.

Responsibilities:
- Organize client and project folders, internal trackers, and SOP documentation in Google Workspace.
- Build and maintain Google Sheets trackers for team capacity, receipts, and monthly operational summaries.
- Coordinate multi-stakeholder schedules and follow up on pending administrative action items.
- Spot workflow bottlenecks and introduce simple AI or script-based automations where helpful.

What We Value:
- Strong organizational habits, responsiveness, and a proactive approach to solving administrative friction.
- Experience supporting fast-moving remote leadership teams with discretion.`
  }
];

export const defaultApplications = rawDefaultApplications.map((app) => ({
  ...app,
  coverLetter: generateHumanCoverLetter({
    jobTitle: app.jobTitle,
    company: app.company,
    description: app.jobDescription,
    platform: app.platform,
  }),
}));
