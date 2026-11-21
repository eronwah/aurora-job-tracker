import { calculateMatchScore } from "../utils/matchScore";
import { parseSalaryToPhp, formatPhp, USD_TO_PHP_RATE } from "../utils/currency";
import { generateHumanCoverLetter } from "../utils/coverLetterGenerator";

/**
 * Domain/website-only blacklist of AI-operated job websites and AI auto-apply portals.
 * NOTE: This ONLY excludes AI-run job platforms by website domain/platform name—it NEVER
 * excludes legitimate job postings that mention AI tools or automation matching your resume.
 */
export const AI_JOB_PLATFORM_DOMAINS = [
  "lazyapply",
  "loopcv",
  "sonara.ai",
  "autojob",
  "aijobs.net",
  "ai-jobs.net",
  "aijobboard",
  "jobai",
  "jobgpt",
  "botjob",
  "resumeworded",
  "careerflow.ai",
  "massive.ai",
  "usemassive",
  "talentprise",
  "applyai",
  "jobright.ai",
  "simplify.jobs",
  "aiapply.co",
  "jobhire.ai",
  "earnbetter",
  "tealhq.com",
  "scale.jobs",
  "mercor.com",
  "sorce.jobs",
  "ai-job-search"
];

export const SKILL_SEARCH_PRESETS = [
  { id: "ops", label: "Operations & DB Admin", query: "Operations" },
  { id: "workspace", label: "Google Sheets / Admin", query: "Admin" },
  { id: "customer", label: "Customer Support", query: "Customer" },
  { id: "qa", label: "QA & Compliance", query: "Quality" },
  { id: "data", label: "Data & Automation", query: "Data" }
];

function decodeHtmlEntities(str = "") {
  return str
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&rdquo;|&ldquo;/gi, '"')
    .replace(/&mdash;|&ndash;/gi, "-")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
}

function cleanJobDescriptionHtml(html = "") {
  if (!html) return "";
  const withBreaks = html
    .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<br\s*\/?>/gi, "\n");
  const stripped = decodeHtmlEntities(withBreaks.replace(/<[^>]*>?/gm, ""))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return stripped.length > 1500 ? `${stripped.slice(0, 1500).trim()}...` : stripped;
}

/**
 * Checks ONLY the job listing's URL hostname / platform origin against AI_JOB_PLATFORM_DOMAINS.
 * Does NOT exclude legitimate roles mentioning AI skills or automation in job titles/descriptions.
 */
function isAiJobPlatformUrl(url = "", platform = "") {
  let host = "";
  try {
    if (url) host = new URL(url).hostname.toLowerCase();
  } catch {
    host = String(url || "").toLowerCase();
  }
  const target = `${host} ${String(url || "").toLowerCase()} ${String(platform || "").toLowerCase()}`;
  return AI_JOB_PLATFORM_DOMAINS.some((domain) => target.includes(domain));
}

function isStrictRemoteLocation(location = "") {
  const loc = String(location || "").toLowerCase();
  if (!loc) return true;
  if (loc.includes("on-site") || loc.includes("onsite") || loc.includes("in-office")) {
    return false;
  }
  return true;
}

function formatDateRelative(dateStr = "") {
  if (!dateStr) return "Live Feed";
  const parsed = typeof dateStr === "number" ? new Date(dateStr * 1000) : new Date(dateStr);
  if (isNaN(parsed.getTime())) return "Live Feed";
  const diffDays = Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

async function fetchJsonWithTimeout(url, timeoutMs = 7000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchRemoteOkJobs() {
  const data = await fetchJsonWithTimeout("https://remoteok.com/api");
  if (!Array.isArray(data)) return [];

  // Index 0 is a legal notice object without `position`
  return data
    .filter((job) => {
      if (!job || !job.position || !job.company) return false;
      const targetUrl = job.apply_url || job.url || "";
      if (isAiJobPlatformUrl(targetUrl, "RemoteOK")) return false;
      return isStrictRemoteLocation(job.location);
    })
    .slice(0, 35)
    .map((job) => {
      let salaryPhp = 55000;
      let salaryDisplay = "Salary not listed (Target ₱40k–₱70k)";
      const minAnnual = Number(job.salary_min);
      const maxAnnual = Number(job.salary_max);
      if (minAnnual > 0) {
        const minMonthlyPhp = Math.round((minAnnual / 12) * USD_TO_PHP_RATE);
        const maxMonthlyPhp =
          maxAnnual > 0 ? Math.round((maxAnnual / 12) * USD_TO_PHP_RATE) : minMonthlyPhp;
        salaryPhp = minMonthlyPhp;
        salaryDisplay =
          minMonthlyPhp === maxMonthlyPhp
            ? `${formatPhp(minMonthlyPhp)} / mo`
            : `${formatPhp(minMonthlyPhp)} - ${formatPhp(maxMonthlyPhp)} / mo`;
      }

      return {
        id: `ROK-${job.id || job.slug}`,
        title: decodeHtmlEntities(job.position || ""),
        company: decodeHtmlEntities(job.company || ""),
        location: job.location ? `${job.location} (Remote)` : "100% Remote (Worldwide)",
        platform: "RemoteOK",
        jobUrl: job.url || job.apply_url || "https://remoteok.com",
        salaryPhp,
        salaryDisplay,
        description: cleanJobDescriptionHtml(job.description || ""),
        tags: Array.isArray(job.tags) && job.tags.length ? job.tags : ["Remote"],
        datePosted: formatDateRelative(job.date || job.epoch)
      };
    });
}

async function fetchRemotiveJobs(keyword = "") {
  const urls = keyword.trim()
    ? [`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(keyword.trim())}&limit=25`]
    : [
        "https://remotive.com/api/remote-jobs?category=business&limit=15",
        "https://remotive.com/api/remote-jobs?category=customer-support&limit=15"
      ];

  const settled = await Promise.allSettled(urls.map((u) => fetchJsonWithTimeout(u)));
  const rawJobs = [];
  for (const item of settled) {
    if (item.status === "fulfilled" && Array.isArray(item.value?.jobs)) {
      rawJobs.push(...item.value.jobs);
    }
  }

  return rawJobs
    .filter((job) => {
      if (isAiJobPlatformUrl(job.url, "Remotive")) return false;
      const loc = (job.candidate_required_location || "").toLowerCase();
      return (
        loc === "" ||
        loc.includes("remote") ||
        loc.includes("anywhere") ||
        loc.includes("worldwide") ||
        loc.includes("philippines") ||
        loc.includes("apac") ||
        loc.includes("asia") ||
        loc.includes("usa") ||
        loc.includes("global")
      );
    })
    .map((job) => {
      const hasSalary = Boolean(job.salary && String(job.salary).trim());
      const parsedSalary = hasSalary ? parseSalaryToPhp(job.salary) : null;
      return {
        id: `REM-${job.id}`,
        title: decodeHtmlEntities(job.title || ""),
        company: decodeHtmlEntities(job.company_name || ""),
        location: job.candidate_required_location || "100% Remote (Worldwide)",
        platform: "Remotive",
        jobUrl: job.url,
        salaryPhp: parsedSalary ? parsedSalary.minPhp : 55000,
        salaryDisplay: parsedSalary
          ? parsedSalary.display
          : "Salary not listed (Target ₱40k–₱70k)",
        description: cleanJobDescriptionHtml(job.description),
        tags: Array.isArray(job.tags) && job.tags.length ? job.tags : ["Remote", "Operations"],
        datePosted: formatDateRelative(job.publication_date)
      };
    });
}

async function fetchJobicyJobs(keyword = "") {
  const cleanKw = keyword.trim();
  const isSingleWord = cleanKw && !/\s/.test(cleanKw);
  const url = isSingleWord
    ? `https://jobicy.com/api/v2/remote-jobs?count=25&tag=${encodeURIComponent(cleanKw)}`
    : "https://jobicy.com/api/v2/remote-jobs?count=25";

  const data = await fetchJsonWithTimeout(url);
  const rawJobs = Array.isArray(data?.jobs) ? data.jobs : [];

  return rawJobs
    .filter((job) => {
      if (isAiJobPlatformUrl(job.url, "Jobicy")) return false;
      return isStrictRemoteLocation(job.jobGeo);
    })
    .map((job) => {
      let salaryPhp = 55000;
      let salaryDisplay = "Salary not listed (Target ₱40k–₱70k)";
      const minAnnual = Number(job.annualSalaryMin);
      const maxAnnual = Number(job.annualSalaryMax);

      if (minAnnual > 0) {
        const minMonthlyPhp = Math.round((minAnnual / 12) * USD_TO_PHP_RATE);
        const maxMonthlyPhp =
          maxAnnual > 0 ? Math.round((maxAnnual / 12) * USD_TO_PHP_RATE) : minMonthlyPhp;
        salaryPhp = minMonthlyPhp;
        salaryDisplay =
          minMonthlyPhp === maxMonthlyPhp
            ? `${formatPhp(minMonthlyPhp)} / mo`
            : `${formatPhp(minMonthlyPhp)} - ${formatPhp(maxMonthlyPhp)} / mo`;
      }

      const rawDesc = job.jobDescription || job.jobExcerpt || "";
      const industryTags = Array.isArray(job.jobIndustry)
        ? job.jobIndustry
        : job.jobIndustry
          ? [job.jobIndustry]
          : [];

      return {
        id: `JBC-${job.id}`,
        title: decodeHtmlEntities(job.jobTitle || ""),
        company: decodeHtmlEntities(job.companyName || ""),
        location: job.jobGeo ? `${job.jobGeo} (Remote)` : "100% Remote",
        platform: "Jobicy",
        jobUrl: job.url,
        salaryPhp,
        salaryDisplay,
        description: cleanJobDescriptionHtml(rawDesc),
        tags: [...industryTags, job.jobType || "Remote"].flat().filter(Boolean),
        datePosted: formatDateRelative(job.pubDate)
      };
    });
}

async function fetchArbeitnowJobs() {
  const data = await fetchJsonWithTimeout("https://www.arbeitnow.com/api/job-board-api");
  const rawJobs = Array.isArray(data?.data) ? data.data : [];

  return rawJobs
    .filter((job) => {
      if (job.remote !== true) return false;
      if (isAiJobPlatformUrl(job.url, "Arbeitnow")) return false;
      return true;
    })
    .slice(0, 35)
    .map((job) => ({
      id: `ARB-${job.slug}`,
      title: decodeHtmlEntities(job.title || ""),
      company: decodeHtmlEntities(job.company_name || ""),
      location: job.location ? `${job.location} (Remote)` : "100% Remote",
      platform: "Arbeitnow",
      jobUrl: job.url,
      salaryPhp: 55000,
      salaryDisplay: "Salary not listed (Target ₱40k–₱70k)",
      description: cleanJobDescriptionHtml(job.description),
      tags: Array.isArray(job.tags) && job.tags.length ? job.tags : ["Remote"],
      datePosted: formatDateRelative(job.created_at)
    }));
}

/**
 * Searches 100% live remote jobs from established non-AI remote boards
 * (RemoteOK, Remotive, Jobicy, Arbeitnow) while tagging each job's exact website/platform
 * and keeping legitimate resume-matching roles (including AI tools/automation).
 */
export async function searchRemoteJobs({
  keyword = "",
  category = "all"
} = {}) {
  const [remoteOkRes, remotiveRes, jobicyRes, arbeitnowRes] = await Promise.allSettled([
    fetchRemoteOkJobs(),
    fetchRemotiveJobs(keyword),
    fetchJobicyJobs(keyword),
    fetchArbeitnowJobs()
  ]);

  const remoteOkJobs = remoteOkRes.status === "fulfilled" ? remoteOkRes.value : [];
  const remotiveJobs = remotiveRes.status === "fulfilled" ? remotiveRes.value : [];
  const jobicyJobs = jobicyRes.status === "fulfilled" ? jobicyRes.value : [];
  const arbeitnowJobs = arbeitnowRes.status === "fulfilled" ? arbeitnowRes.value : [];

  const allFailed =
    remoteOkRes.status === "rejected" &&
    remotiveRes.status === "rejected" &&
    jobicyRes.status === "rejected" &&
    arbeitnowRes.status === "rejected";

  const combinedPool = [...remoteOkJobs, ...remotiveJobs, ...jobicyJobs, ...arbeitnowJobs];

  // Deduplicate by normalized url or title+company
  const seenKeys = new Set();
  const deduped = [];
  for (const job of combinedPool) {
    const key = `${job.title.toLowerCase().trim()}::${job.company.toLowerCase().trim()}`;
    const urlKey = (job.jobUrl || "").toLowerCase().trim();
    if (seenKeys.has(key) || (urlKey && seenKeys.has(urlKey))) continue;
    seenKeys.add(key);
    if (urlKey) seenKeys.add(urlKey);
    deduped.push(job);
  }

  // Enrich with match score + warm human cover letter
  const enriched = deduped.map((job) => {
    const matchAnalysis = calculateMatchScore(
      job.title,
      `${job.description} ${(job.tags || []).join(" ")}`
    );
    const coverLetter = generateHumanCoverLetter({
      jobTitle: job.title,
      company: job.company,
      description: job.description,
      matchedSkills: matchAnalysis.matchedSkills,
      platform: job.platform
    });
    return {
      ...job,
      matchScore: matchAnalysis.score,
      matchedSkills: matchAnalysis.matchedSkills,
      matchHighlights: matchAnalysis.highlights,
      coverLetter
    };
  });

  // Apply keyword & category filters
  const categorySynonyms = {
    operations: ["operations", "admin", "administrative", "coordinator", "executive", "back office"],
    google: ["google", "sheets", "workspace", "apps script", "excel", "spreadsheet"],
    database: ["database", "data", "automation", "workflow", "crm", "entry", "analytics"],
    qa: ["qa", "quality", "support", "customer", "moderation", "sop", "compliance", "audit"]
  };

  const filtered = enriched.filter((job) => {
    const searchable = `${job.title} ${job.company} ${job.description} ${(job.tags || []).join(" ")}`.toLowerCase();

    if (keyword.trim()) {
      const q = keyword.trim().toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    if (category !== "all") {
      const terms = categorySynonyms[category] || [category.toLowerCase()];
      if (!terms.some((term) => searchable.includes(term))) return false;
    }

    return true;
  });

  filtered.sort((a, b) => b.matchScore - a.matchScore);

  const sources = {
    remoteok: filtered.filter((j) => j.platform === "RemoteOK").length,
    remotive: filtered.filter((j) => j.platform === "Remotive").length,
    jobicy: filtered.filter((j) => j.platform === "Jobicy").length,
    arbeitnow: filtered.filter((j) => j.platform === "Arbeitnow").length
  };

  return {
    jobs: filtered,
    sources,
    error: allFailed
      ? "Could not reach live remote job boards right now. Check your internet/mobile data connection and tap Retry."
      : null
  };
}
