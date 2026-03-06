/**
 * Tries to extract latitude and longitude from a Google Maps URL.
 * Supports: ?q=lat,lng | @lat,lng | /@lat,lng,zoom
 */
export function parseLatLngFromMapLink(url: string): { lat: number; lng: number } | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  // ?q=18.52,73.85 or &q=18.52,73.85
  const qMatch = trimmed.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) {
    const lat = Number(qMatch[1]);
    const lng = Number(qMatch[2]);
    if (isValidLatLng(lat, lng)) return { lat, lng };
  }

  // @18.52,73.85 or @18.52,73.85,15z
  const atMatch = trimmed.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) {
    const lat = Number(atMatch[1]);
    const lng = Number(atMatch[2]);
    if (isValidLatLng(lat, lng)) return { lat, lng };
  }

  // /place/... sometimes has /@lat,lng - same as above
  return null;
}

function isValidLatLng(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
