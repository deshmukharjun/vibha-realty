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
import { ArrowLeft, Share2, MapPin, Home } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919881199152";

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

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { listing, error } = useListing(id);
  const [galleryIndex, setGalleryIndex] = useState(0);

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

  const title = `${listing.area} – ${listing.propertyType}`;

  return (
    <div className="bg-white min-h-screen">
      {/* Back + top bar */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-20">
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
        {/* Hero: title, price, meta */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-green-600" />
              {listing.area}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Home className="w-4 h-4 text-green-600" />
              {listing.propertyType}
            </span>
            {listing.statusTag && (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-600 text-white">
                {listing.statusTag}
              </span>
            )}
          </div>
          <p className="mt-3 text-xl md:text-2xl font-semibold text-green-700">
            {formatPriceRangeDisplay(listing.priceRangeMin, listing.priceRangeMax)}
          </p>
        </div>

        {/* Media gallery */}
        <section className="mb-8 md:mb-12" aria-label="Property images">
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100">
            <div className="relative aspect-[4/3] w-full">
              {activeMedia?.type === "video" ? (
                <video
                  src={activeMedia.url}
                  controls
                  className="w-full h-full object-cover"
                  poster={primaryMedia?.type === "image" ? primaryMedia.url : undefined}
                />
              ) : activeMedia ? (
                <WatermarkedImage
                  src={activeMedia.url}
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
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === galleryIndex ? "border-green-600" : "border-gray-200 hover:border-gray-300"
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

        {/* Property highlights / description */}
        {(listing.valueStatement || listing.area) && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property highlights</h2>
            <div className="prose prose-gray max-w-none text-gray-700">
              {listing.valueStatement ? (
                <p className="whitespace-pre-wrap">{listing.valueStatement}</p>
              ) : (
                <p>
                  {listing.propertyType} in {listing.area}. {formatPriceRangeDisplay(listing.priceRangeMin, listing.priceRangeMax)}.
                  Get in touch for full details, visit, or inspection.
                </p>
              )}
            </div>
          </section>
        )}

        {/* Key details */}
        <section className="mb-8 md:mb-12 rounded-xl border border-gray-200 p-6 bg-gray-50/50">
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
              <dt className="text-gray-500 font-medium">Listing type</dt>
              <dd className="text-gray-900 mt-0.5 capitalize">{listing.transactionType}</dd>
            </div>
            <div>
              <dt className="text-gray-500 font-medium">Price</dt>
              <dd className="text-gray-900 mt-0.5 font-medium text-green-700">
                {formatPriceRangeDisplay(listing.priceRangeMin, listing.priceRangeMax)}
              </dd>
            </div>
          </dl>
        </section>

        {/* Disclaimer */}
        <section className="mb-8 text-xs text-gray-500 border-t border-gray-200 pt-6">
          <p>
            All information contained herein is gathered from sources we deem reliable. We do not guarantee its accuracy.
            Interested persons should rely on their own enquiries. Figures and details are subject to change without notice.
          </p>
        </section>

        {/* Contact CTA */}
        <section className="rounded-xl border-2 border-green-600 bg-green-50/50 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Interested in this property?</h2>
          <p className="text-gray-700 mb-6">
            Reach out to Charushila for more details, site visit, or to discuss this listing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
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
