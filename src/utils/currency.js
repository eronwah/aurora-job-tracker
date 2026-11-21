export const USD_TO_PHP_RATE = 58.5; // Approximate exchange rate

/**
 * Format number into Philippine Peso string
 * @param {number|string} amount
 * @returns {string}
 */
export function formatPhp(amount) {
  if (!amount && amount !== 0) return "₱0";
  const num = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount;
  if (isNaN(num)) return "₱0";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Convert USD monthly or hourly salary to PHP
 * @param {number} usdAmount
 * @param {boolean} isHourly
 * @returns {{ monthlyPhp: number, formatted: string }}
 */
export function convertUsdToPhp(usdAmount, isHourly = false) {
  if (!usdAmount) return { monthlyPhp: 0, formatted: "₱0" };
  const monthlyUsd = isHourly ? usdAmount * 160 : usdAmount;
  const monthlyPhp = Math.round(monthlyUsd * USD_TO_PHP_RATE);
  return {
    monthlyPhp,
    formatted: formatPhp(monthlyPhp),
  };
}

/**
 * Parses salary text (e.g. "$1,200 - $1,800 / mo" or "₱50,000") into a PHP number and formatted range
 */
export function parseSalaryToPhp(salaryStr) {
  if (!salaryStr) return { minPhp: 50000, maxPhp: 65000, display: "₱50,000 - ₱65,000 / mo" };

  // Check if already in PHP
  if (salaryStr.includes("₱") || salaryStr.toUpperCase().includes("PHP")) {
    const numbers = salaryStr.match(/\d+[\d,]*/g);
    if (numbers && numbers.length > 0) {
      const cleanNums = numbers.map(n => parseInt(n.replace(/,/g, ""), 10)).filter(n => !isNaN(n));
      const min = cleanNums[0] || 45000;
      const max = cleanNums[1] || min;
      return { minPhp: min, maxPhp: max, display: salaryStr };
    }
  }

  // If in USD ($)
  if (salaryStr.includes("$") || salaryStr.toUpperCase().includes("USD")) {
    const lower = salaryStr.toLowerCase();
    const isHourly = /\/?\b(hr|hour|hourly)\b/.test(lower);
    const isAnnualExplicit = /\/?\b(yr|year|yearly|annual|annum)\b/.test(lower);

    const matches = [...salaryStr.matchAll(/(\d+(?:,\d{3})*(?:\.\d+)?)\s*(k)?/gi)];
    const cleanNums = matches
      .map(m => {
        const base = parseFloat(m[1].replace(/,/g, ""));
        if (isNaN(base)) return NaN;
        return m[2] ? base * 1000 : base;
      })
      .filter(n => !isNaN(n) && n > 0);

    if (cleanNums.length > 0) {
      const minRaw = cleanNums[0];
      const maxRaw = cleanNums[1] || minRaw;

      const toMonthlyUsd = (val) => {
        if (isHourly) return val * 160;
        if (isAnnualExplicit || val >= 15000) return val / 12;
        return val;
      };

      const minPhp = Math.round(toMonthlyUsd(minRaw) * USD_TO_PHP_RATE);
      const maxPhp = Math.round(toMonthlyUsd(maxRaw) * USD_TO_PHP_RATE);
      return {
        minPhp,
        maxPhp,
        display: minPhp === maxPhp ? `${formatPhp(minPhp)} / mo` : `${formatPhp(minPhp)} - ${formatPhp(maxPhp)} / mo`
      };
    }
  }

  return { minPhp: 45000, maxPhp: 65000, display: salaryStr };
}
