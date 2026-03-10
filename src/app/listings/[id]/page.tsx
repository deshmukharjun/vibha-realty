"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { formatPriceRangeDisplay } from "@/lib/formatPrice";
import { WatermarkedImage } from "@/components/listings/WatermarkedImage";
import { getListingPublic } from "@/hooks/useCMS";
import type { Listing } from "@/types/cms";
import {
  ArrowLeft,
  Share2,
  MapPin,
  Home,
  FileText,
  Calculator,
  User,
  Building2,
} from "lucide-react";
import {
  NUMERIC_FEATURE_KEYS,
  getFeatureOption,
} from "@/lib/listingFeatures";
import { parseLatLngFromMapLink } from "@/lib/mapLink";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919881199152";

/** For listing detail page: request higher-res image when source is Unsplash (card uses 320x220). */
function toHighResListingImageUrl(url: string): string {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("unsplash.com")) return url;
    u.searchParams.set("w", "1200");
    u.searchParams.set("h", "800");
    u.searchParams.set("fit", "crop");
    return u.toString();
  } catch {
    return url;
  }
}

function useListing(id: string | undefined) {
  const [listing, setListing] = useState<Listing | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getListingPublic(id)
      .then((data) => {
        setListing(data ?? null);
        if (!data) setError("Listing not found.");
      })
      .catch(() => {
        setError("Failed to load listing.");
        setListing(null);
      });
  }, [id]);

  return { listing, error };
}

/**
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1).
 * principalRupees: loan amount in rupees.
 * Returns monthly EMI in rupees.
 */
function emi(principalRupees: number, annualRatePercent: number, tenureYears: number): number {
  const P = principalRupees;
  const r = annualRatePercent / 100 / 12;
  const n = tenureYears * 12;
  if (r === 0) return P / n;
  return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { listing, error } = useListing(id);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [emiDownPaymentPercent, setEmiDownPaymentPercent] = useState(20);
  const [emiTenure, setEmiTenure] = useState(20);
  const [emiRate, setEmiRate] = useState(8.5);

  if (listing === undefined && !error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <Container className="py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>
        <p className="mt-6 text-red-600">{error ?? "Listing not found."}</p>
      </Container>
    );
  }

  const media = listing.media ?? [];
  const sortedMedia = [...media].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const primaryMedia = sortedMedia.find((m) => m.isPrimary) ?? sortedMedia[0];
  const activeMedia = sortedMedia[galleryIndex] ?? primaryMedia;

  const message = `Hi Charushila, I'm interested in the ${listing.category} property in ${listing.area} you listed. Could we talk?`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${listing.propertyType} in ${listing.area}`,
          url: shareUrl,
          text: `${listing.propertyType} in ${listing.area} – ${formatPriceRangeDisplay(listing.priceRangeMin, listing.priceRangeMax)}`,
        });
      } catch {
        if (navigator.clipboard) navigator.clipboard.writeText(shareUrl);
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  const title = listing.name?.trim() || `${listing.area} – ${listing.propertyType}`;

  // Resolve coordinates: use stored lat/lng if valid (not 0,0), otherwise parse from mapLink
  const storedValid =
    listing.latitude != null &&
    listing.longitude != null &&
    (listing.latitude !== 0 || listing.longitude !== 0);
  const parsedFromLink = listing.mapLink?.trim()
    ? parseLatLngFromMapLink(listing.mapLink)
    : null;
  const embedLatLng = storedValid
    ? { lat: listing.latitude!, lng: listing.longitude! }
    : parsedFromLink;

  const hasLatLng = embedLatLng != null;
  const mapUrl =
    listing.mapLink?.trim() ||
    (hasLatLng ? `https://www.google.com/maps?q=${embedLatLng!.lat},${embedLatLng!.lng}` : undefined);

  // Listing prices are stored in rupees (e.g. 90L = 9_000_000)
  const priceForEmiRupees = listing.priceRangeMax ?? listing.priceRangeMin ?? 0;
  const loanPercent = 100 - emiDownPaymentPercent;
  const loanPrincipalRupees = Math.round((priceForEmiRupees * loanPercent) / 100);
  const downPaymentRupees = Math.round((priceForEmiRupees * emiDownPaymentPercent) / 100);
  const monthlyEmi = emi(loanPrincipalRupees, emiRate, emiTenure);
  const LAKHS = 100_000;
  const priceLakhs = priceForEmiRupees / LAKHS;
  const loanLakhs = loanPrincipalRupees / LAKHS;
  const downPaymentLakhs = downPaymentRupees / LAKHS;

  return (
    <div className="bg-(--color-primary) min-h-screen">
      {/* Back + top bar */}
      <div className="border-b border-gray-200 bg-(--color-primary) sticky top-0 z-20">
        <Container>
          <div className="flex items-center justify-between py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to listings
            </Link>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </Container>
      </div>

      <Container maxWidth="lg" className="py-6 md:py-10">
        {/* Ownership badge */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
              listing.ownership === "channel-partner"
                ? "bg-indigo-100 text-indigo-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {listing.ownership === "channel-partner" ? (
              <>
                <Building2 className="w-4 h-4" />
                {listing.channelPartner ? `${listing.channelPartner}` : "Channel partner listing"}
              </>
            ) : (
              <>
                <User className="w-4 h-4" /> Private listing
              </>
            )}
          </span>
        </div>

        {/* Hero: title, price, meta */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {title}
          </h1>
          {(listing.address || listing.area) && (
            <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-600">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                {listing.address ? `${listing.address}, ${listing.area}` : listing.area}
              </span>
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <Home className="w-4 h-4 text-green-600" />
              {listing.propertyType}
            </span>
            {listing.statusTag && (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-(--color-accent) text-white">
                {listing.statusTag}
              </span>
            )}
          </div>
          <p className="mt-3 text-xl md:text-2xl font-semibold text-green-700">
            {formatPriceRangeDisplay(listing.priceRangeMin, listing.priceRangeMax)}
          </p>
        </div>

        {/* Media gallery */}
        <section className="mb-8 md:mb-10" aria-label="Property images">
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-black">
            <div className="relative aspect-[4/3] w-full flex items-center justify-center">
              {activeMedia?.type === "video" ? (
                <video
                  src={activeMedia.url}
                  controls
                  className="w-full h-full object-contain"
                  poster={
                    primaryMedia?.type === "image"
                      ? toHighResListingImageUrl(primaryMedia.url)
                      : undefined
                  }
                />
              ) : activeMedia ? (
                <WatermarkedImage
                  src={toHighResListingImageUrl(activeMedia.url)}
                  alt={`${title}, image ${galleryIndex + 1} of ${sortedMedia.length}`}
                  className="rounded-none"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}
              {sortedMedia.length > 1 && (
                <p className="absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-medium bg-black/60 text-white">
                  {galleryIndex + 1} of {sortedMedia.length}
                </p>
              )}
            </div>
            {sortedMedia.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide border-t border-gray-200 bg-white">
                {sortedMedia.map((m, i) => (
                  <button
                    key={`${m.url}-${i}`}
                    type="button"
                    onClick={() => setGalleryIndex(i)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === galleryIndex
                        ? "border-green-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {m.type === "video" ? (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                        Video
                      </div>
                    ) : (
                      <Image
                        src={m.url}
                        alt=""
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features with icons */}
        <section className="mb-8 md:mb-10 rounded-xl border border-gray-200 p-6 bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
          <div className="flex flex-wrap gap-4">
            {NUMERIC_FEATURE_KEYS.map((key) => {
              const val =
                key === "bedrooms"
                  ? listing.bedrooms
                  : key === "bathrooms"
                    ? listing.bathrooms
                    : listing.parking;
              if (val == null) return null;
              const opt = getFeatureOption(key);
              if (!opt) return null;
              const Icon = opt.icon;
              return (
                <div
                  key={key}
                  className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 border border-gray-100"
                >
                  <Icon className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {val} {opt.label}
                  </span>
                </div>
              );
            })}
            {(listing.features ?? [])
              .filter((k) => !NUMERIC_FEATURE_KEYS.includes(k))
              .map((key) => {
                const opt = getFeatureOption(key);
                if (!opt) return null;
                const Icon = opt.icon;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 border border-gray-100"
                  >
                    <Icon className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                  </div>
                );
              })}
            {((listing as { featuresOther?: string[] }).featuresOther ?? []).map((name) => (
              <div
                key={name}
                className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 border border-gray-100"
              >
                <span className="text-sm font-medium text-gray-900">{name}</span>
              </div>
            ))}
          </div>
          {(!listing.bedrooms && !listing.bathrooms && !listing.parking && (!listing.features || listing.features.length === 0) && !((listing as { featuresOther?: string[] }).featuresOther?.length)) && (
            <p className="text-sm text-gray-500">No features added for this listing.</p>
          )}
        </section>

        {/* Property description */}
        {(listing.valueStatement || listing.area) && (
          <section className="mb-8 md:mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <div className="prose prose-gray max-w-none text-gray-700">
              {listing.valueStatement ? (
                <p className="whitespace-pre-wrap">{listing.valueStatement}</p>
              ) : (
                <p>
                  {listing.propertyType} in {listing.area}.{" "}
                  {formatPriceRangeDisplay(listing.priceRangeMin, listing.priceRangeMax)}. Get
                  in touch for full details, visit, or inspection.
                </p>
              )}
            </div>
          </section>
        )}

        {/* Key details */}
        <section className="mb-8 md:mb-10 rounded-xl border border-gray-200 p-6 bg-(--color-secondary)/50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key details</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500 font-medium">Property type</dt>
              <dd className="text-gray-900 mt-0.5">{listing.propertyType}</dd>
            </div>
            <div>
              <dt className="text-gray-500 font-medium">Area</dt>
              <dd className="text-gray-900 mt-0.5">{listing.area}</dd>
            </div>
            <div>
              <dt className="text-gray-500 font-medium">Category</dt>
              <dd className="text-gray-900 mt-0.5 capitalize">{listing.category}</dd>
            </div>
            <div>
              <dt className="text-gray-500 font-medium">Price</dt>
              <dd className="mt-0.5 font-medium text-green-700">
                {formatPriceRangeDisplay(listing.priceRangeMin, listing.priceRangeMax)}
              </dd>
            </div>
          </dl>
        </section>

        {/* Location / Map */}
        {mapUrl && (
          <section className="mb-8 md:mb-10 rounded-xl border border-gray-200 overflow-hidden bg-white">
            <h2 className="text-lg font-semibold text-gray-900 p-4 pb-0">Location</h2>
            <p className="text-sm text-gray-600 px-4 pt-1">
              {listing.address ? `${listing.address}, ${listing.area}` : listing.area}
            </p>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 py-4 px-4 bg-gray-50 border-t border-gray-200 text-green-700 font-medium hover:bg-gray-100"
            >
              <MapPin className="w-5 h-5" /> View on Google Maps
            </a>
            {hasLatLng && embedLatLng && (
              <iframe
                title="Map"
                src={`https://www.google.com/maps?q=${embedLatLng.lat},${embedLatLng.lng}&z=15&output=embed`}
                className="w-full h-64 border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </section>
        )}

        {/* Floor plan */}
        {listing.floorPlanUrl && (
          <section className="mb-8 md:mb-10 rounded-xl border border-gray-200 p-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" /> Floor plan
            </h2>
            <a
              href={listing.floorPlanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-green-600 px-4 py-2 text-green-700 font-medium hover:bg-green-50"
            >
              <FileText className="w-4 h-4" /> View floor plan (PDF)
            </a>
          </section>
        )}

        {/* EMI calculator */}
        {(listing.priceRangeMin != null || listing.priceRangeMax != null) && (
          <section className="mb-8 md:mb-10 rounded-xl border border-gray-200 p-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-green-600" /> EMI calculator
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Property value: ₹{priceLakhs >= 1 ? priceLakhs.toLocaleString("en-IN", { maximumFractionDigits: 1 }) : priceLakhs.toFixed(1)} lakh. Adjust sliders below. For exact figures, consult your bank.
            </p>

            <div className="space-y-6 mb-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Down payment</label>
                  <span className="text-base font-bold text-green-700 tabular-nums">{emiDownPaymentPercent}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={5}
                  value={emiDownPaymentPercent}
                  onChange={(e) => setEmiDownPaymentPercent(Number(e.target.value))}
                  className="emi-slider w-full h-3 rounded-full cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(34 197 94) ${((emiDownPaymentPercent - 10) / 40) * 100}%, rgb(229 231 235) ${((emiDownPaymentPercent - 10) / 40) * 100}%, rgb(229 231 235) 100%)`,
                  }}
                  aria-label="Down payment percentage"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                  <span>10%</span>
                  <span>50%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Loan tenure</label>
                  <span className="text-base font-bold text-green-700 tabular-nums">{emiTenure} years</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={emiTenure}
                  onChange={(e) => setEmiTenure(Number(e.target.value))}
                  className="emi-slider w-full h-3 rounded-full cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(34 197 94) ${((emiTenure - 5) / 25) * 100}%, rgb(229 231 235) ${((emiTenure - 5) / 25) * 100}%, rgb(229 231 235) 100%)`,
                  }}
                  aria-label="Loan tenure in years"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                  <span>5 yr</span>
                  <span>30 yr</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Interest rate (p.a.)</label>
                  <span className="text-base font-bold text-green-700 tabular-nums">{emiRate}%</span>
                </div>
                <input
                  type="range"
                  min={7.5}
                  max={10}
                  step={0.5}
                  value={emiRate}
                  onChange={(e) => setEmiRate(Number(e.target.value))}
                  className="emi-slider w-full h-3 rounded-full cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(34 197 94) ${((emiRate - 7.5) / 2.5) * 100}%, rgb(229 231 235) ${((emiRate - 7.5) / 2.5) * 100}%, rgb(229 231 235) 100%)`,
                  }}
                  aria-label="Interest rate percent per annum"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                  <span>7.5%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                <p className="text-gray-500 font-medium">Down payment</p>
                <p className="text-gray-900 font-semibold mt-1 text-lg">
                  ₹{downPaymentLakhs >= 1 ? downPaymentLakhs.toLocaleString("en-IN", { maximumFractionDigits: 1 }) : downPaymentLakhs.toFixed(1)} lakh
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{emiDownPaymentPercent}% of value</p>
              </div>
              <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                <p className="text-green-700 font-medium">Loan amount</p>
                <p className="text-green-900 font-semibold mt-1 text-lg">
                  ₹{loanLakhs >= 1 ? loanLakhs.toLocaleString("en-IN", { maximumFractionDigits: 1 }) : loanLakhs.toFixed(1)} lakh
                </p>
                <p className="text-xs text-green-600 mt-0.5">{loanPercent}% of value</p>
              </div>
            </div>

            <div className="rounded-xl bg-green-50 border-2 border-green-200 p-5">
              <p className="text-sm text-gray-600 font-medium">Estimated EMI (₹/month)</p>
              <p className="text-2xl md:text-3xl font-bold text-green-800 mt-1 tabular-nums">
                ₹{Math.round(monthlyEmi).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Loan of ₹{loanLakhs >= 1 ? loanLakhs.toLocaleString("en-IN", { maximumFractionDigits: 1 }) : loanLakhs.toFixed(1)} lakh ({loanPercent}%) over {emiTenure} years at {emiRate}% p.a.
              </p>
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="mb-8 text-xs text-gray-500 border-t border-gray-200 pt-6">
          <p>
            All information contained herein is gathered from sources we deem reliable. We
            do not guarantee its accuracy. Interested persons should rely on their own
            enquiries. Figures and details are subject to change without notice.
          </p>
        </section>

        {/* Contact CTA */}
        <section className="rounded-xl border-2 border-green-600 bg-green-50/50 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Interested in this property?
          </h2>
          <p className="text-gray-700 mb-6">
            Reach out to Charushila for more details, site visit, or to discuss this
            listing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-(--color-accent) text-white font-semibold hover:brightness-90 transition-colors"
            >
              <Image src="/whatsapp.svg" alt="" width={22} height={22} />
              Message Charushila
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-green-600 text-green-700 font-semibold hover:bg-green-50 transition-colors"
            >
              Request inspection
            </a>
          </div>
        </section>
      </Container>
    </div>
  );
}
