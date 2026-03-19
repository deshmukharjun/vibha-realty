const LAKHS = 1_00_000;
/**
 * Formats an amount in rupees for display. Values >= 100L show as Cr (e.g. 1Cr, 1.3Cr); below 100L show as L (e.g. 75L).
 */
export function formatRupeesAsLakhsOrCrore(rupees: number): string {
  const lakhs = rupees / LAKHS;
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    const rounded = Math.round(cr);
    const isInt = Math.abs(cr - rounded) < 1e-9;
    return isInt ? `${rounded}Cr` : `${cr.toFixed(1)}Cr`;
  }
  const roundedLakhs = Math.round(lakhs);
  const isLakhsInt = Math.abs(lakhs - roundedLakhs) < 1e-9;
  return `${lakhs.toFixed(isLakhsInt ? 0 : 1)}L`;
}

/**
 * Formats a price range (min/max in rupees) for display. Uses L for < 100L and Cr for >= 100L.
 */
export function formatPriceRangeDisplay(minRupees?: number, maxRupees?: number): string {
  if (minRupees != null && maxRupees != null) {
    const lakhsMin = minRupees / LAKHS;
    const lakhsMax = maxRupees / LAKHS;

    // Collapse "X - X" even if rupees differ slightly due to rounding/parsing.
    if (Math.round(lakhsMin) === Math.round(lakhsMax)) {
      return `₹ ${formatRupeesAsLakhsOrCrore(minRupees)}`;
    }

    const minStr = formatRupeesAsLakhsOrCrore(minRupees);
    const maxStr = formatRupeesAsLakhsOrCrore(maxRupees);
    if (minStr === maxStr) return `₹ ${minStr}`;

    return `₹ ${minStr} – ₹ ${maxStr}`;
  }
  if (minRupees != null) return `₹ ${formatRupeesAsLakhsOrCrore(minRupees)}+`;
  if (maxRupees != null) return `Up to ₹ ${formatRupeesAsLakhsOrCrore(maxRupees)}`;
  return "Price on request";
}
