const LAKHS = 1_00_000;
/**
 * Formats an amount in rupees for display. Values >= 100L show as Cr (e.g. 1Cr, 1.3Cr); below 100L show as L (e.g. 75L).
 */
export function formatRupeesAsLakhsOrCrore(rupees: number): string {
  const lakhs = rupees / LAKHS;
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    return cr % 1 === 0 ? `${cr}Cr` : `${cr.toFixed(1)}Cr`;
  }
  return `${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 1)}L`;
}

/**
 * Formats a price range (min/max in rupees) for display. Uses L for < 100L and Cr for >= 100L.
 */
export function formatPriceRangeDisplay(minRupees?: number, maxRupees?: number): string {
  if (minRupees != null && maxRupees != null) {
    return `₹ ${formatRupeesAsLakhsOrCrore(minRupees)} – ₹ ${formatRupeesAsLakhsOrCrore(maxRupees)}`;
  }
  if (minRupees != null) return `₹ ${formatRupeesAsLakhsOrCrore(minRupees)}+`;
  if (maxRupees != null) return `Up to ₹ ${formatRupeesAsLakhsOrCrore(maxRupees)}`;
  return "Price on request";
}
