const PRIVATE_CONFIG_KEY = "aurora_job_tracker_private_config";
const LEGACY_GAS_KEY = "aurora_job_tracker_gas_url";

export const DEFAULT_GAS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycby7paz2luBvIHrne6N_ya6J0DKhn1Dn16da9JWaLgXhkRwYALT4ZzMJOZ1Ck5ROVnJTCg/exec";

const DEFAULT_PRIVATE_CONFIG = {
  email: "",
  phone: "",
  location: "Philippines (Remote)",
  linkedin: "",
  driveResumeUrl: "",
  gasWebhookUrl: DEFAULT_GAS_WEBHOOK_URL
};

/**
 * Loads user-specific private contact details and Google Drive resume link
 * from browser localStorage, while keeping the pre-wired Google Apps Script
 * /exec endpoint connected directly for automatic Desktop & iPhone syncing.
 */
export function getPrivateConfig() {
  try {
    const raw = localStorage.getItem(PRIVATE_CONFIG_KEY);
    const legacyGasUrl = localStorage.getItem(LEGACY_GAS_KEY) || "";

    if (!raw) {
      return {
        ...DEFAULT_PRIVATE_CONFIG,
        gasWebhookUrl: legacyGasUrl || DEFAULT_GAS_WEBHOOK_URL
      };
    }

    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PRIVATE_CONFIG,
      ...parsed,
      location: parsed.location || DEFAULT_PRIVATE_CONFIG.location,
      gasWebhookUrl: parsed.gasWebhookUrl || legacyGasUrl || DEFAULT_GAS_WEBHOOK_URL
    };
  } catch (err) {
    console.error("Failed to read private config:", err);
    return { ...DEFAULT_PRIVATE_CONFIG };
  }
}

/**
 * Merges and saves private configuration into browser localStorage.
 */
export function savePrivateConfig(partial = {}) {
  try {
    const current = getPrivateConfig();
    const trimmed = Object.fromEntries(
      Object.entries(partial).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
    );
    const next = {
      ...current,
      ...trimmed,
      location: trimmed.location !== undefined ? (trimmed.location || "Philippines (Remote)") : current.location
    };
    localStorage.setItem(PRIVATE_CONFIG_KEY, JSON.stringify(next));
    if (trimmed.gasWebhookUrl !== undefined) {
      localStorage.setItem(LEGACY_GAS_KEY, next.gasWebhookUrl || "");
    }
    return next;
  } catch (err) {
    console.error("Failed to save private config:", err);
    return getPrivateConfig();
  }
}

/**
 * Extracts a Google Drive File ID from a Drive URL or returns the raw ID if already an ID.
 */
export function extractDriveFileId(urlOrId = "") {
  if (!urlOrId || typeof urlOrId !== "string") return "";
  const trimmed = urlOrId.trim();
  if (!trimmed) return "";

  const matchPath = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchPath && matchPath[1]) return matchPath[1];

  const matchQuery = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchQuery && matchQuery[1]) return matchQuery[1];

  if (/^[a-zA-Z0-9_-]{15,}$/.test(trimmed)) return trimmed;
  return "";
}
