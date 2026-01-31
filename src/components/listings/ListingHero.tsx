"use client";

import { useState, useRef, useCallback } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useListings } from "@/hooks/useCMS";
import { ListingCard } from "./ListingCard";
import { ListingFilterModal, type ListingFilters } from "./ListingFilterModal";
import type { ListingCategory, ListingTransactionType } from "@/types/cms";

const CATEGORIES: { value: ListingCategory | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
  { value: "residential", label: "Residential" },
];

const SCROLL_AMOUNT = 300;

function HorizontalList({ children, hasCards }: { children: React.ReactNode; hasCards: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  return (
    <div className="relative -mx-1 px-1 sm:-mx-4 sm:px-4 md:-mx-6 md:px-8">
      {hasCards && (
        <>
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-2 sm:bottom-4 z-10 w-10 h-full flex items-center justify-center focus:outline-none rounded-l-xl touch-manipulation"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-(--color-accent) drop-shadow-sm" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-2 sm:bottom-4 z-10 w-10 h-full flex items-center justify-center  focus:outline-none rounded-r-xl touch-manipulation"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-(--color-accent) drop-shadow-sm" />
          </button>
        </>
      )}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide pb-2 sm:pb-4 touch-pan-x"
      >
        <div className="flex gap-3 sm:gap-4 w-max min-w-full">{children}</div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-8 sm:py-12 text-center text-gray-500 text-xs sm:text-sm rounded-lg border border-dashed border-gray-300 bg-gray-50/50 px-4">
      {message}
    </div>
  );
}

/**
 * realestate.com.au–style hero + explore:
 * - Hero: bg image, overlay title, prominent search card (tabs + input + Filters + Search)
 * - Explore: heading, pills, two listing sections
 * Green accent (not red).
 */
export function ListingHero() {
  const [category, setCategory] = useState<ListingCategory | undefined>(undefined);
  const [transactionType, setTransactionType] = useState<ListingTransactionType | undefined>("buying");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<ListingFilters | null>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const { personal, channelPartner, loading, error } = useListings(
    {
      category,
      transactionType,
      priceMin: appliedFilters?.priceMin,
      priceMax: appliedFilters?.priceMax,
      areaSearch: searchQuery,
    }
  );

  const scrollToExplore = () => {
    exploreRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero: clean white background, light search card */}
      <section className="relative min-h-0 w-full bg-(--color-primary) flex flex-col items-center justify-center pt-6 pb-4 md:min-h-[280px] md:pt-10 md:pb-6">

        <div className="w-full max-w-4xl px-4 sm:px-0">
            <div className="bg-(--color-secondary) rounded-xl shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value ?? "all"}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`flex-1 py-3 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm font-semibold transition-colors touch-manipulation ${
                    category === c.value
                      ? "text-green-600 border-b-2 border-green-500 -mb-px"
                      : "text-gray-600 hover:text-gray-900 border-b-2 border-transparent"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
              <div className="flex-1 min-w-0 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-(--color-accent) pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search area or locality"
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-(--color-accent) bg-transparent text-gray-900 text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(101,139,88,0.12)]"
                  aria-label="Search area or locality"
                />
              </div>
              <div className="flex gap-2 sm:gap-0 sm:contents">
                <button
                  type="button"
                  onClick={() => setFilterModalOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-(--color-accent) bg-transparent text-gray-700 font-medium text-xs sm:text-sm hover:bg-gray-50 hover:border-[rgba(101,139,88,0.4)] transition-colors shrink-0 touch-manipulation focus:outline-none focus:ring-2 focus:ring-[rgba(101,139,88,0.2)] focus:border-[rgba(101,139,88,0.4)]"
                  aria-label="Open filters"
                >
                  <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                  Filters
                </button>
                <button
                  type="button"
                  onClick={scrollToExplore}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-(--color-accent) text-white font-semibold text-xs sm:text-sm hover:brightness-90 transition-colors whitespace-nowrap shrink-0 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[rgba(101,139,88,0.4)]"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={exploreRef} className="pt-0 pb-8 md:pb-12 bg-(--color-primary) scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <ListingFilterModal
            open={filterModalOpen}
            onClose={() => setFilterModalOpen(false)}
            filters={appliedFilters ?? { outdoor: [], indoor: [], climate: [], accessibility: [], keywords: "" }}
            onApply={(f) => setAppliedFilters(f)}
            transactionType={transactionType}
            category={category}
            onTransactionTypeChange={setTransactionType}
            onCategoryChange={(v) => setCategory(v)}
          />

          {error && (
            <div className="mb-4 sm:mb-6 py-3 sm:py-4 px-3 sm:px-4 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm">
              Listings are temporarily unavailable. Please try again in a moment.
            </div>
          )}

          {loading ? (
            <div className="space-y-6 md:space-y-8">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Charushila&apos;s Personal Listings
                </h3>
                <div className="h-48 sm:h-64 rounded-xl bg-white border border-gray-200 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Verified Channel Partner Listings
                </h3>
                <div className="h-48 sm:h-64 rounded-xl bg-white border border-gray-200 animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              {/* Charushila's Personal Listings */}
              <div className="mb-5 sm:mb-8 md:mb-10">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
                  Charushila&apos;s Personal Listings
                </h3>
                <div className="rounded-xl bg-(--color-secondary) p-3 sm:p-4 shadow-sm">
                  <HorizontalList hasCards={personal.length > 0}>
                    {personal.length === 0 ? (
                      <div className="min-w-full">
                        <EmptyState message="No personal listings match this filter yet." />
                      </div>
                    ) : (
                      personal.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))
                    )}
                  </HorizontalList>
                </div>
              </div>

              {/* Verified Channel Partner Listings */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
                  Verified Channel Partner Listings
                </h3>
                <div className="rounded-xl bg-(--color-secondary) p-3 sm:p-4 shadow-sm">
                  <HorizontalList hasCards={channelPartner.length > 0}>
                    {channelPartner.length === 0 ? (
                      <div className="min-w-full">
                        <EmptyState message="No channel partner listings match this filter yet." />
                      </div>
                    ) : (
                      channelPartner.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))
                    )}
                  </HorizontalList>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
