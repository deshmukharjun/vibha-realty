"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPriceRangeDisplay } from "@/lib/formatPrice";
import { WatermarkedImage } from "./WatermarkedImage";
import type { Listing } from "@/types/cms";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919881199152";

interface ListingCardProps {
  listing: Listing;
}

/**
 * Card shows area, property type, price range, status tag. Clicking card opens full listing detail at /listings/[id].
 * PRD: Never builder/project name, exact address, RERA, floor plans, brochures.
 */
export function ListingCard({ listing }: ListingCardProps) {
  const media = listing.media ?? [];
  const primaryMedia = media.find((m) => m.isPrimary) ?? media[0];
  const message = `Hi Charushila, I'm interested in the ${listing.category} property in ${listing.area} you listed. Could we talk?`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const detailHref = `/listings/${listing.id}`;

  return (
    <article
      className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[320px] rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow touch-manipulation"
      data-ownership={listing.ownership}
    >
      <Link href={detailHref} className="block">
        <div className="relative h-40 sm:h-44 w-full">
          {primaryMedia ? (
            <WatermarkedImage
              src={primaryMedia.url}
              alt={`${listing.area} – ${listing.propertyType}`}
              className="rounded-t-xl"
              sizes="320px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-t-xl">
              No image
            </div>
          )}
          {listing.statusTag && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold bg-green-600 text-white shadow-sm">
              {listing.statusTag}
            </span>
          )}
          {listing.ownership === "channel-partner" && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
              Partner
            </span>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-green-600">{listing.area}</p>
          <p className="text-gray-900 font-semibold mt-1 text-sm sm:text-base line-clamp-1">{listing.propertyType}</p>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{formatPriceRangeDisplay(listing.priceRangeMin, listing.priceRangeMax)}</p>
        </div>
      </Link>
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 -mt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-green-600 font-semibold text-xs sm:text-sm hover:text-green-700 hover:underline transition-colors min-h-[44px] items-center"
        >
          <Image src="/whatsapp.svg" alt="" width={18} height={18} />
          Talk to Charushila
        </a>
      </div>
    </article>
  );
}
