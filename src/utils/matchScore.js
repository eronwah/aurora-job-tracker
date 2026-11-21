import { resumeData } from "../data/resumeData";

/**
 * Calculates a match score between a job title + description and Jesse's skills
 * @param {string} title 
 * @param {string} description 
 * @returns {{ score: number, matchedSkills: string[], highlights: string[] }}
 */
export function calculateMatchScore(title = "", description = "") {
  const combined = `${title} ${description}`.toLowerCase();
  
  const skillKeywords = [
    { name: "Google Workspace", terms: ["google workspace", "gsuite", "g suite", "google suite"], weight: 15 },
    { name: "Google Sheets", terms: ["google sheets", "spreadsheets", "excel", "sheets"], weight: 12 },
    { name: "Apps Script & Automation", terms: ["apps script", "appscript", "appsscript", "automation", "automate", "workflow automation"], weight: 15 },
    { name: "Operations & Admin", terms: ["operations", "operational", "administrative", "operations specialist", "admin"], weight: 12 },
    { name: "Database & Data Management", terms: ["database", "data entry", "data management", "data integrity", "records"], weight: 10 },
    { name: "Standard Operating Procedures (SOP)", terms: ["sop", "sops", "procedures", "guidelines", "compliance"], weight: 8 },
    { name: "Quality Assurance (QA)", terms: ["qa", "quality assurance", "content moderation", "audit", "review"], weight: 8 },
    { name: "Customer Operations & Support", terms: ["customer operations", "inbound", "tickets", "support", "crm"], weight: 6 },
    { name: "Reporting & Metrics", terms: ["reporting", "metrics", "analytics", "kpis", "dashboard"], weight: 7 },
    { name: "Information Technology", terms: ["it", "information technology", "systems", "tech support"], weight: 7 }
  ];

  let totalWeightEarned = 0;
  const maxPossibleWeight = skillKeywords.reduce((acc, curr) => acc + curr.weight, 0);
  const matchedSkills = [];
  const highlights = [];

  for (const skill of skillKeywords) {
    const isMatched = skill.terms.some(term => combined.includes(term));
    if (isMatched) {
      totalWeightEarned += skill.weight;
      matchedSkills.push(skill.name);
    }
  }

  // Base score calculation normalized between 55% and 98%
  let score = Math.round((totalWeightEarned / maxPossibleWeight) * 100);
  if (score < 40) score = 55; // minimum baseline for curated jobs
  if (score > 98) score = 98;

  // Generate highlights
  if (matchedSkills.includes("Google Workspace") || matchedSkills.includes("Google Sheets")) {
    highlights.push("Matches your core Google Workspace & Sheets administration experience.");
  }
  if (matchedSkills.includes("Apps Script & Automation")) {
    highlights.push("Direct match with your workflow & receipt automation background.");
  }
  if (matchedSkills.includes("Operations & Admin")) {
    highlights.push("Aligns with your business operations and executive tracking profile.");
  }
  if (matchedSkills.includes("Quality Assurance (QA)")) {
    highlights.push("Leverages your QA and Content Moderation expertise at WIPRO.");
  }

  if (highlights.length === 0) {
    highlights.push("Matches your broad Information Technology & administrative operations skill set.");
  }

  return {
    score,
    matchedSkills,
    highlights
  };
}
