/**
 * Property amount utilities: Lakhs/Crores ↔ Rupees, Indian number formatting,
 * and human-readable display. All stored values are in full rupees.
 */

export const LAKHS_RUPEE = 1_00_000;
export const CRORE_RUPEE = 1_00_00_000;

export type AmountUnit = "lakh" | "crore";

/** Convert display value (e.g. 65 in Lakhs) to full rupees. */
export function amountToRupees(value: number, unit: AmountUnit): number {
  if (unit === "crore") return value * CRORE_RUPEE;
  return value * LAKHS_RUPEE;
}

/** Convert full rupees to lakhs (for display in Lakhs unit). */
export function rupeesToLakhs(rupees: number): number {
  return rupees / LAKHS_RUPEE;
}

/** Convert full rupees to crores (for display in Crores unit). */
export function rupeesToCrores(rupees: number): number {
  return rupees / CRORE_RUPEE;
}

/**
 * Format an integer with Indian numbering (lakh/crore commas).
 * e.g. 6500000 → "65,00,000" and 12500000 → "1,25,00,000"
 */
export function formatIndianInteger(rupees: number): string {
  if (!Number.isFinite(rupees) || rupees < 0) return "0";
  const n = Math.round(rupees);
  if (n === 0) return "0";
  const s = String(n);
  const len = s.length;
  if (len <= 3) return s;
  // Last 3 digits, then groups of 2
  const last3 = s.slice(-3);
  let rest = s.slice(0, -3);
  const parts: string[] = [last3];
  while (rest.length > 0) {
    parts.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  return parts.join(",");
}

/**
 * Human-readable string for display below input.
 * e.g. "₹ 65,00,000" or "₹ 1.25 Crore"
 */
export function rupeesToHumanReadable(rupees: number): string {
  if (!Number.isFinite(rupees) || rupees < 0) return "₹ 0";
  const n = Math.round(rupees);
  if (n >= CRORE_RUPEE) {
    const cr = n / CRORE_RUPEE;
    const crStr = cr % 1 === 0 ? String(cr) : cr.toFixed(2).replace(/\.?0+$/, "");
    return `₹ ${crStr} Crore`;
  }
  return `₹ ${formatIndianInteger(n)}`;
}

/**
 * Parse user input (may contain Indian commas) to a number.
 * Strips spaces and commas; allows one decimal point.
 */
export function parseAmountInput(displayValue: string): number {
  const cleaned = displayValue.replace(/,/g, "").replace(/\s/g, "").trim();
  if (cleaned === "" || cleaned === ".") return NaN;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Format a raw numeric string for display with Indian-style commas (in the selected unit).
 * e.g. "6500000" -> "65,00,000" (65 Lakhs), "1.25" stays "1.25".
 */
export function formatDisplayWithIndianCommas(rawValue: string): string {
  const num = parseAmountInput(rawValue);
  if (Number.isNaN(num)) return rawValue;
  const isDecimal = /\./.test(rawValue.trim());
  if (isDecimal) {
    const [intPart, decPart] = rawValue.split(".");
    const intNum = parseInt(intPart.replace(/,/g, ""), 10);
    if (Number.isNaN(intNum)) return rawValue;
    const formattedInt = formatIndianInteger(intNum);
    return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  }
  const intNum = Math.floor(num);
  if (intNum !== num) return rawValue;
  return formatIndianInteger(intNum);
}

/**
 * Suggest switching to Crores when value in Lakhs is > 99.
 * Returns the equivalent value in Crores (e.g. 150 Lakhs → 1.5 Crores).
 */
export function suggestCroreIfOver99Lakh(value: number, unit: AmountUnit): {
  suggestCrore: boolean;
  valueInCrores: number;
} {
  if (unit !== "lakh" || !Number.isFinite(value) || value <= 99) {
    return { suggestCrore: false, valueInCrores: value / 100 };
  }
  return { suggestCrore: true, valueInCrores: value / 100 };
}
