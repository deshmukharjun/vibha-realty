import type { Listing } from "@/types/cms";
import { parsePriceRangeTextToRupeesRange } from "@/lib/amountUtils";

/**
 * Returns true if the string already contains a currency symbol (₹, Rs, etc).
 */
function hasCurrencySymbol(text: string): boolean {
  return /₹|Rs\.?|INR/i.test(text.trim());
}

/**
 * Returns the display string for a listing's price.
 * Uses only priceDisplayText (or legacy priceDisplay/priceRangeDisplayText).
 * No fallback to numeric range – if no string exists, returns "Price on request".
 */
export function getListingPriceDisplay(listing: Listing): string {
  const raw =
    listing.priceDisplayText ?? listing.priceDisplay ?? listing.priceRangeDisplayText ?? "";
  const trimmed = raw.trim();
  if (!trimmed) return "Price on request";

  const clean = trimmed.replace(/^[₹\s]+/, "").trim();
  if (!clean) return "Price on request";

  if (hasCurrencySymbol(trimmed)) return trimmed;
  return `₹ ${trimmed}`;
}

/**
 * Returns a numeric value for EMI calculations (full rupees).
 * Parses priceDisplayText: for single values (e.g. "65L/acre") uses that value;
 * for ranges (e.g. "78-90L") uses the higher end (90L).
 */
export function getListingPriceForEmiRupees(listing: Listing): number {
  const raw =
    listing.priceDisplayText ?? listing.priceDisplay ?? listing.priceRangeDisplayText ?? "";
  const trimmed = raw.trim();
  if (!trimmed) return 0;

  const parsed = parsePriceRangeTextToRupeesRange(trimmed);
  if (parsed.error) return 0;
  // For ranges use max; for single values max equals min
  return parsed.maxRupees ?? parsed.minRupees ?? 0;
}
