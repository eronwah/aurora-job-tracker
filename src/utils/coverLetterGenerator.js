/**
 * Generates a warm, conversational, human-sounding cover letter grounded
 * in Jesse Aaron Cuartero's real work experience (~120-150 words).
 * Strictly avoids AI clichés, corporate buzzwords, and pushy language.
 */

function getDeterministicHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Count words in a given text string
 * @param {string} text
 * @returns {number}
 */
export function countWords(text = "") {
  if (!text || typeof text !== "string") return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Generates a natural, conversational cover letter for a specific job
 * @param {Object} params
 * @param {string} params.jobTitle
 * @param {string} params.company
 * @param {string} [params.description]
 * @param {string[]} [params.matchedSkills]
 * @param {string} [params.platform]
 * @returns {string}
 */
export function generateHumanCoverLetter({
  jobTitle = "Operations Specialist",
  company = "",
  description = "",
  matchedSkills = [],
  platform = "",
} = {}) {
  const safeCompany = company && company.trim() ? company.trim() : "Hiring";
  const safeTitle = jobTitle && jobTitle.trim() ? jobTitle.trim() : "this role";
  const combined = `${safeTitle} ${description} ${(matchedSkills || []).join(" ")}`.toLowerCase();

  const hash = getDeterministicHash(`${safeTitle}|${safeCompany}`);
  const variant = hash % 3;

  const platformMention =
    platform && !platform.toLowerCase().includes("direct")
      ? ` on ${platform.replace(" (Live)", "")}`
      : "";

  // 3 natural, low-key opening variations
  const openings = [
    `I saw your ${safeTitle} post${platformMention} and wanted to reach out. A lot of the day-to-day work you described lines up well with what I have been doing in remote operations and database admin over the last few years.`,
    `I came across the ${safeTitle} opening${platformMention} and thought I would send a quick note. The mix of structured workflows, data accuracy, and steady team support sounds right in line with my daily work.`,
    `I am reaching out about the ${safeTitle} role${platformMention}. Your description caught my eye because most of my recent work has centered around keeping operational records clean, organized, and moving on schedule.`
  ];

  // Detect focus areas from title + description + matchedSkills
  const isWorkspace =
    combined.includes("google workspace") ||
    combined.includes("google sheets") ||
    combined.includes("apps script") ||
    combined.includes("appsheet") ||
    combined.includes("spreadsheet") ||
    combined.includes("automation") ||
    combined.includes("receipt") ||
    combined.includes("invoic");

  const isCustomerOps =
    combined.includes("customer") ||
    combined.includes("client") ||
    combined.includes("inbound") ||
    combined.includes("ticket") ||
    combined.includes("logistics") ||
    combined.includes("order") ||
    combined.includes("crm");

  const isQa =
    combined.includes("qa") ||
    combined.includes("quality assurance") ||
    combined.includes("content moderation") ||
    combined.includes("audit") ||
    combined.includes("review") ||
    combined.includes("sop") ||
    combined.includes("compliance");

  let middleParagraph = "";

  if (isWorkspace && isCustomerOps) {
    middleParagraph =
      `At a telecommunications cooperative, I built internal Google Sheets trackers and simple Apps Script automations, including a receipt generator, so our team could cut down on repetitive manual data entry. I also worked as a Customer Operations Specialist at MAËLYS Cosmetics handling high-volume client inquiries, order monitoring, and logistics tracking in Google Sheets while sticking closely to SOPs.`;
  } else if (isWorkspace) {
    middleParagraph =
      `In my current role as a Database and Operations Administrator at a telecommunications service cooperative, I built internal tracking systems in Google Sheets and Apps Script to keep membership data and team metrics accurate for leadership. I also put together small workflow automations like a receipt generation tool that helped reduce manual entry and keep daily reporting reliable.`;
  } else if (isCustomerOps && isQa) {
    middleParagraph =
      `Most recently, I worked as a Customer Operations Specialist at MAËLYS Cosmetics managing high-volume inbound requests, order monitoring, and logistics tracking in Google Sheets under clear SOPs. Before that, I spent time at WIPRO as a Quality Assurance Specialist and Workflow Trainer, where I reviewed digital content carefully, caught workflow errors early, and helped new hires get comfortable with process guidelines.`;
  } else if (isCustomerOps) {
    middleParagraph =
      `As a Customer Operations Specialist at MAËLYS Cosmetics, I handled high-volume client messages, tracked orders, and managed logistics records inside Google Sheets while following company SOPs closely. Alongside that, my background in database administration has made me comfortable organizing CRM data, documenting complex requests cleanly, and spotting delays before they reach clients.`;
  } else if (isQa) {
    middleParagraph =
      `At WIPRO, I worked as a Quality Assurance Specialist for a pioneer account and later served as a Workflow Trainer, reviewing digital content under strict guidelines, spotting procedural errors, and helping onboard new teammates with clear briefing notes. Combined with my operations and Google Workspace background, I enjoy keeping documentation tidy and data reliable.`;
  } else {
    middleParagraph =
      `Over the past few years, I have worked as a Database and Operations Administrator at a telecommunications service cooperative and in customer operations and QA roles at MAËLYS Cosmetics and WIPRO. Day to day, I spend my time organizing data in Google Workspace, keeping documentation up to date, following SOPs carefully, and coordinating across remote teams so nothing slips through the cracks.`;
  }

  const closings = [
    `If my background sounds like a good fit for what your team needs right now, I would be happy to chat or share a bit more about how I work.`,
    `If this matches what you are looking for, I would gladly hop on a brief call or answer any questions about my experience.`,
    `If you think my experience could help your team, I would be glad to connect and talk through how I can support your daily workflows.`
  ];

  const opening = openings[variant];
  const closing = closings[variant];

  return [
    `Hi ${safeCompany} team,`,
    "",
    opening,
    "",
    middleParagraph,
    "",
    closing,
    "",
    `Thanks for taking the time to read this,`,
    `Jesse Aaron Cuartero`
  ].join("\n");
}
