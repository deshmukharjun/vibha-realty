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

export type ParsedPriceRange = {
  minRupees?: number;
  maxRupees?: number;
  error?: string;
};

function detectUnitFromToken(tokenLower: string): AmountUnit | null {
  const t = tokenLower.trim().replace(/\/.*$/, "");
  if (/(cr|crore)s?$/.test(t)) return "crore";
  if (/(lakh|lakhs|l)$/.test(t)) return "lakh";
  return null;
}

function parseNumberFromToken(token: string): number {
  // Keep digits and one decimal point; strip currency symbols/letters.
  const cleaned = token
    .replace(/,/g, "")
    .replace(/₹/g, "")
    .replace(/[^0-9.]/g, "");
  if (cleaned === "" || cleaned === ".") return NaN;
  return parseFloat(cleaned);
}

/**
 * Parse admin price expressions into full rupees range.
 *
 * Supported examples:
 * - "25-30L" / "25 - 30 lakh"
 * - "1-1.5Cr"
 * - "80L+"
 * - "Up to 50L"
 * - "10L/acre" (treated as a single value)
 */
export function parsePriceRangeTextToRupeesRange(input: string): ParsedPriceRange {
  const raw = input.trim();
  if (!raw) return {};

  const normalized = raw
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/–|—/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  const rangeTokens = normalized.split(/\s*(?:-|to)\s*/i).filter(Boolean);
  const hasRangeSeparator = rangeTokens.length === 2 && (normalized.includes("-") || /\bto\b/i.test(normalized));

  const plusOnly = /\+$/.test(normalized) || /\+\s*$/.test(normalized);
  const uptoOnly = /^(upto|up to)\b/i.test(normalized);

  const parseSide = (token: string, fallbackUnit: AmountUnit): { valueRupees?: number; unitUsed: AmountUnit | null } => {
    const unit = detectUnitFromToken(token) ?? fallbackUnit;
    const num = parseNumberFromToken(token);
    if (!Number.isFinite(num)) return { unitUsed: null };
    return { valueRupees: Math.round(amountToRupees(num, unit)), unitUsed: unit };
  };

  if (hasRangeSeparator) {
    const [aTokenRaw, bTokenRaw] = rangeTokens;
    const aToken = aTokenRaw.trim();
    const bToken = bTokenRaw.trim();

    const unitA = detectUnitFromToken(aToken);
    const unitB = detectUnitFromToken(bToken);
    const defaultUnit: AmountUnit =
      unitA ?? unitB ?? (parseNumberFromToken(aToken) >= 100 ? "crore" : "lakh");

    const aParsed = parseSide(aToken, defaultUnit);
    const bParsed = parseSide(bToken, unitB ?? unitA ?? defaultUnit);

    if (aParsed.valueRupees == null || bParsed.valueRupees == null) {
      return { error: "Invalid price range. Try e.g. 25-30L or 1-1.5Cr." };
    }

    const minRupees = Math.min(aParsed.valueRupees, bParsed.valueRupees);
    const maxRupees = Math.max(aParsed.valueRupees, bParsed.valueRupees);
    return { minRupees, maxRupees };
  }

  // Single value forms
  const token = normalized.replace(/\+$/, "").trim();
  const unit = detectUnitFromToken(token) ?? (parseNumberFromToken(token) >= 100 ? "crore" : "lakh");
  const num = parseNumberFromToken(token);
  if (!Number.isFinite(num)) return { error: "Invalid price value." };

  const rupees = Math.round(amountToRupees(num, unit));

  if (uptoOnly) return { maxRupees: rupees };
  if (plusOnly) return { minRupees: rupees };
  return { minRupees: rupees, maxRupees: rupees };
}
