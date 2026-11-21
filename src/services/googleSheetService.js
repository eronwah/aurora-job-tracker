import { defaultApplications, PIPELINE_STAGES } from "../data/defaultApplications";
import { generateHumanCoverLetter } from "../utils/coverLetterGenerator";
import { calculateMatchScore } from "../utils/matchScore";
import { formatPhp } from "../utils/currency";
import { getPrivateConfig, savePrivateConfig } from "./profileConfigService";

const LOCAL_STORAGE_KEY = "aurora_job_tracker_applications";

const VALID_STAGE_IDS = new Set(PIPELINE_STAGES.map((s) => s.id));

/**
 * Normalizes a raw row coming back from Google Apps Script doGet()
 */
function normalizeSheetRow(row, index) {
  const rawSalary = row.salaryDisplay !== undefined ? String(row.salaryDisplay) : "";
  const numericSalary = parseInt(rawSalary.replace(/[^0-9]/g, ""), 10) || 55000;
  const rawStatus = String(row.status || "saved").trim().toLowerCase();
  const status = VALID_STAGE_IDS.has(rawStatus) ? rawStatus : "saved";

  const jobTitle = String(row.jobTitle || "").trim();
  const company = String(row.company || "").trim();
  const jobDescription = String(row.jobDescription || "").trim();
  const platform = String(row.platform || "Direct").trim();

  const coverLetter =
    row.coverLetter && String(row.coverLetter).trim()
      ? String(row.coverLetter)
      : generateHumanCoverLetter({
          jobTitle,
          company,
          description: jobDescription,
          platform
        });

  const matchAnalysis = calculateMatchScore(jobTitle, jobDescription);

  return {
    id: row.id ? String(row.id) : `APP-${Date.now().toString().slice(-4)}-${index}`,
    jobTitle,
    company,
    salaryPhp: numericSalary,
    salaryDisplay: `${formatPhp(numericSalary)} / mo`,
    status,
    jobUrl: row.jobUrl ? String(row.jobUrl) : "",
    platform,
    dateApplied: row.dateApplied ? String(row.dateApplied).slice(0, 10) : "",
    followUpDate: row.followUpDate ? String(row.followUpDate).slice(0, 10) : "",
    resumeUsed: row.resumeUsed ? String(row.resumeUsed) : "Jesse_Aaron_Cuartero_Resume.pdf",
    notes: row.notes ? String(row.notes) : "",
    jobDescription,
    coverLetter,
    location: "100% Remote",
    matchScore: matchAnalysis.score,
    lastUpdated: row.lastUpdated ? String(row.lastUpdated) : new Date().toISOString()
  };
}

/**
 * Get current applications from local storage (or defaults),
 * backfilling jobDescription and coverLetter on any legacy stored entries.
 */
export function getStoredApplications() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultApplications));
      return defaultApplications;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultApplications));
      return defaultApplications;
    }

    let didBackfill = false;
    const migrated = parsed.map((app) => {
      const hasDescription = Boolean(app.jobDescription && app.jobDescription.trim());
      const hasCoverLetter = Boolean(app.coverLetter && app.coverLetter.trim());
      if (hasDescription && hasCoverLetter) {
        return app;
      }

      didBackfill = true;
      const defaultMatch = defaultApplications.find((d) => d.id === app.id);
      const jobDescription = hasDescription
        ? app.jobDescription
        : defaultMatch?.jobDescription ||
          `Remote ${app.jobTitle || "Operations"} opportunity at ${app.company || "the hiring company"}.${
            app.notes ? `\n\nApplication Notes: ${app.notes}` : ""
          }`;

      const coverLetter = hasCoverLetter
        ? app.coverLetter
        : defaultMatch?.coverLetter ||
          generateHumanCoverLetter({
            jobTitle: app.jobTitle,
            company: app.company,
            description: jobDescription,
            platform: app.platform,
          });

      return {
        ...app,
        jobDescription,
        coverLetter,
      };
    });

    if (didBackfill) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(migrated));
    }

    return migrated;
  } catch (err) {
    console.error("Error reading localStorage:", err);
    return defaultApplications;
  }
}

/**
 * Save applications to local storage
 */
export function saveStoredApplications(applications) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(applications));
  } catch (err) {
    console.error("Error saving to localStorage:", err);
  }
}

/**
 * Clear all applications cleanly from local storage
 */
export function clearAllApplications() {
  saveStoredApplications([]);
  return [];
}

/**
 * Get configured Google Apps Script Web App URL
 */
export function getGasWebhookUrl() {
  return getPrivateConfig().gasWebhookUrl || "";
}

/**
 * Set configured Google Apps Script Web App URL
 */
export function setGasWebhookUrl(url) {
  savePrivateConfig({ gasWebhookUrl: url });
}

/**
 * Pull applications from the Google Sheet via Apps Script doGet()
 */
export async function fetchFromGoogleSheet() {
  const endpoint = getGasWebhookUrl();
  if (!endpoint) {
    return {
      success: false,
      isConfigured: false,
      applications: null,
      message: "Google Apps Script Web App URL is not set yet. Paste your deployment URL in the Google Sheet tab to sync across devices."
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(endpoint, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        isConfigured: true,
        applications: null,
        message: `Google Sheet returned HTTP ${response.status}. Verify Web App access is set to "Anyone".`
      };
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      return {
        success: false,
        isConfigured: true,
        applications: null,
        message: "Unexpected response from Google Apps Script doGet(). Expected a JSON array."
      };
    }

    const normalized = data
      .filter((row) => row && (row.jobTitle || row.company))
      .map((row, idx) => normalizeSheetRow(row, idx));

    saveStoredApplications(normalized);

    return {
      success: true,
      isConfigured: true,
      applications: normalized,
      message: `Pulled ${normalized.length} application${normalized.length === 1 ? "" : "s"} from Google Sheet!`
    };
  } catch (err) {
    console.error("Pull from Google Sheet error:", err);
    return {
      success: false,
      isConfigured: true,
      applications: null,
      message: `Could not pull from Google Sheet: ${err.message}`
    };
  }
}

/**
 * Push applications to the Google Sheet via Apps Script Web App API
 */
export async function syncToGoogleSheet(applications) {
  const endpoint = getGasWebhookUrl();
  if (!endpoint) {
    return {
      success: false,
      isConfigured: false,
      message: "Google Apps Script Web App URL is not set yet. Changes are saved locally in this browser."
    };
  }

  const payload = JSON.stringify({
    action: "syncAll",
    applications,
    timestamp: new Date().toISOString()
  });

  try {
    // Use text/plain to avoid OPTIONS CORS preflight while Apps Script still reads e.postData.contents
    const response = await fetch(endpoint, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: payload
    });

    if (response.ok) {
      try {
        const resJson = await response.json();
        if (resJson && resJson.status === "error") {
          return {
            success: false,
            isConfigured: true,
            message: `Google Sheet error: ${resJson.message}`
          };
        }
      } catch {
        // Response opaque or non-JSON; treat HTTP ok as dispatched
      }
    }

    return {
      success: true,
      isConfigured: true,
      message: `Synced ${applications.length} application${applications.length === 1 ? "" : "s"} to Google Sheet!`
    };
  } catch (err) {
    // Fallback to no-cors if Apps Script redirect blocks reading response headers
    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: payload
      });
      return {
        success: true,
        isConfigured: true,
        message: "Sync request dispatched to Google Sheet!"
      };
    } catch (fallbackErr) {
      console.error("Sync error:", fallbackErr);
      return {
        success: false,
        isConfigured: true,
        message: `Failed to connect to Google Apps Script: ${fallbackErr.message}`
      };
    }
  }
}

function escapeCsvCell(value) {
  const str = value === null || value === undefined ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Export applications as a 14-column downloadable CSV
 */
export function exportToCsv(applications) {
  const headers = [
    "ID",
    "Job Title",
    "Company",
    "Salary (PHP)",
    "Status",
    "Job URL",
    "Platform",
    "Date Applied",
    "Follow Up Date",
    "Resume Used",
    "Notes",
    "Last Updated",
    "Job Description",
    "Cover Letter"
  ];

  const rows = applications.map(app => [
    escapeCsvCell(app.id || ""),
    escapeCsvCell(app.jobTitle || ""),
    escapeCsvCell(app.company || ""),
    escapeCsvCell(app.salaryPhp ? `₱${app.salaryPhp}` : (app.salaryDisplay || "")),
    escapeCsvCell(app.status || ""),
    escapeCsvCell(app.jobUrl || ""),
    escapeCsvCell(app.platform || ""),
    escapeCsvCell(app.dateApplied || ""),
    escapeCsvCell(app.followUpDate || ""),
    escapeCsvCell(app.resumeUsed || ""),
    escapeCsvCell(app.notes || ""),
    escapeCsvCell(app.lastUpdated || new Date().toISOString()),
    escapeCsvCell(app.jobDescription || ""),
    escapeCsvCell(app.coverLetter || "")
  ]);

  const csvContent = [headers.map(escapeCsvCell).join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Job_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
