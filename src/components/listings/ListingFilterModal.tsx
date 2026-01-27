"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import type { ListingCategory, ListingTransactionType } from "@/types/cms";

const TRANSACTION_OPTIONS: { value: ListingTransactionType | "rent"; label: string }[] = [
  { value: "buying", label: "Buy" },
  { value: "rent", label: "Rent" },
  { value: "selling", label: "Sold" },
];

const PROPERTY_TYPES: { value: string; label: string; category?: ListingCategory }[] = [
  { value: "", label: "All types" },
  { value: "retirement", label: "Retirement Living", category: "residential" },
  { value: "house", label: "House", category: "residential" },
  { value: "land", label: "Land", category: "land" },
  { value: "townhouse", label: "Townhouse", category: "residential" },
  { value: "acreage", label: "Acreage", category: "land" },
  { value: "apartment", label: "Apartment & Unit", category: "residential" },
  { value: "rural", label: "Rural", category: "commercial" },
  { value: "villa", label: "Villa", category: "residential" },
  { value: "block", label: "Block Of Units", category: "commercial" },
  { value: "commercial", label: "Commercial", category: "commercial" },
];

const NEW_ESTABLISHED = [
  { value: "", label: "All types" },
  { value: "new", label: "New" },
  { value: "established", label: "Established" },
];

const OUTDOOR_FEATURES = ["Swimming pool", "Garage", "Balcony", "Outdoor area"];
const INDOOR_FEATURES = ["Ensuite", "Dishwasher", "Study", "Built in robes"];
const CLIMATE_FEATURES = ["Air conditioning", "Solar panels", "Heating", "Fireplace"];
const ACCESSIBILITY_FEATURES = ["Single storey", "Step free entry", "Wide doorways", "Elevator"];

const SALE_METHODS = [
  { value: "", label: "All types" },
  { value: "private", label: "Private treaty sale" },
  { value: "auction", label: "Auction" },
];

export interface ListingFilters {
  transactionType?: ListingTransactionType;
  category?: ListingCategory;
  priceMin?: number;
  priceMax?: number;
  bedroomsMin?: number;
  bedroomsMax?: number;
  bathrooms?: string;
  carSpaces?: string;
  landMin?: string;
  landMax?: string;
  newEstablished?: string;
  outdoor: string[];
  indoor: string[];
  climate: string[];
  accessibility: string[];
  keywords: string;
  saleMethod?: string;
  excludeUnderContract?: boolean;
}

const defaultFilters: ListingFilters = {
  outdoor: [],
  indoor: [],
  climate: [],
  accessibility: [],
  keywords: "",
};

interface ListingFilterModalProps {
  open: boolean;
  onClose: () => void;
  filters: ListingFilters;
  onApply: (filters: ListingFilters) => void;
  transactionType: ListingTransactionType | undefined;
  category: ListingCategory | undefined;
  onTransactionTypeChange: (v: ListingTransactionType | undefined) => void;
  onCategoryChange: (v: ListingCategory | undefined) => void;
}

function ExpandableSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left text-sm font-medium text-gray-900"
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="mt-2 space-y-2 pl-0">{children}</div>}
    </div>
  );
}

export function ListingFilterModal({
  open,
  onClose,
  filters,
  onApply,
  transactionType,
  category,
  onTransactionTypeChange,
  onCategoryChange,
}: ListingFilterModalProps) {
  const [localTransaction, setLocalTransaction] = useState<ListingTransactionType | "rent">(
    transactionType ?? "buying"
  );
  const [localCategory, setLocalCategory] = useState<string>(
    !category ? "" : category === "land" ? "land" : category === "commercial" ? "commercial" : "residential"
  );
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bedMin, setBedMin] = useState("");
  const [bedMax, setBedMax] = useState("");
  const [bathrooms, setBathrooms] = useState("any");
  const [carSpaces, setCarSpaces] = useState("any");
  const [landMin, setLandMin] = useState("");
  const [landMax, setLandMax] = useState("");
  const [newEst, setNewEst] = useState("");
  const [outdoor, setOutdoor] = useState<string[]>(filters.outdoor);
  const [indoor, setIndoor] = useState<string[]>(filters.indoor);
  const [climate, setClimate] = useState<string[]>(filters.climate);
  const [accessibility, setAccessibility] = useState<string[]>(filters.accessibility);
  const [keywords, setKeywords] = useState(filters.keywords);
  const [saleMethod, setSaleMethod] = useState("");
  const [excludeContract, setExcludeContract] = useState(false);
  const [onlyWithPrice, setOnlyWithPrice] = useState(false);

  useEffect(() => {
    if (open) {
      setLocalTransaction(transactionType ?? "buying");
      setLocalCategory(!category ? "" : category === "land" ? "land" : category === "commercial" ? "commercial" : "residential");
      setPriceMin(filters.priceMin != null ? String(filters.priceMin) : "");
      setPriceMax(filters.priceMax != null ? String(filters.priceMax) : "");
      setOutdoor(filters.outdoor ?? []);
      setIndoor(filters.indoor ?? []);
      setClimate(filters.climate ?? []);
      setAccessibility(filters.accessibility ?? []);
      setKeywords(filters.keywords ?? "");
    }
  }, [open, transactionType, category, filters.priceMin, filters.priceMax, filters.outdoor, filters.indoor, filters.climate, filters.accessibility, filters.keywords]);

  const toggle = (arr: string[], item: string, set: (a: string[]) => void) => {
    if (arr.includes(item)) set(arr.filter((x) => x !== item));
    else set([...arr, item]);
  };

  const handleClear = () => {
    setLocalTransaction("buying");
    setLocalCategory("");
    setPriceMin("");
    setPriceMax("");
    setBedMin("");
    setBedMax("");
    setBathrooms("any");
    setCarSpaces("any");
    setLandMin("");
    setLandMax("");
    setNewEst("");
    setOutdoor([]);
    setIndoor([]);
    setClimate([]);
    setAccessibility([]);
    setKeywords("");
    setSaleMethod("");
    setExcludeContract(false);
    setOnlyWithPrice(false);
  };

  const handleSearch = () => {
    const cat: ListingCategory | undefined =
      localCategory === "" ? undefined : (localCategory === "land" ? "land" : localCategory === "commercial" ? "commercial" : "residential");
    const tx: ListingTransactionType | undefined =
      localTransaction === "buying" || localTransaction === "selling" ? localTransaction : undefined;
    const pMin = priceMin ? Number(priceMin) : undefined;
    const pMax = priceMax ? Number(priceMax) : undefined;
    onTransactionTypeChange(tx);
    onCategoryChange(cat);
    onApply({
      ...defaultFilters,
      transactionType: tx,
      category: cat as ListingCategory | undefined,
      priceMin: pMin,
      priceMax: pMax,
      outdoor,
      indoor,
      climate,
      accessibility,
      keywords,
      excludeUnderContract: excludeContract,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto scrollbar-hide bg-black/20 pt-8 pb-20"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        className="relative w-full max-w-lg bg-white shadow-xl rounded-t-2xl md:rounded-2xl mx-4 max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-modal-title"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 id="filter-modal-title" className="text-lg font-semibold text-gray-900">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-1">
          {/* Buy / Rent / Sold */}
          <div className="py-3 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Transaction
            </p>
            <div className="flex flex-wrap gap-2">
              {TRANSACTION_OPTIONS.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => setLocalTransaction(o.value)}
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    localTransaction === o.value
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {localTransaction === "rent" && (
              <p className="text-xs text-gray-500 mt-1">Rent listings coming soon. Showing all for now.</p>
            )}
          </div>

          {/* Property type */}
          <div className="py-3 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Property type
            </p>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((p) => {
                const value = !p.value ? "" : p.value === "land" ? "land" : p.value === "commercial" ? "commercial" : "residential";
                const isAll = !p.value;
                return (
                  <button
                    key={p.value || "all"}
                    type="button"
                    onClick={() => setLocalCategory(isAll ? "" : value)}
                    className={`rounded-lg border-2 px-3 py-1.5 text-sm font-medium transition-colors ${
                      (isAll && localCategory === "") || (!isAll && value === localCategory)
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price */}
          <div className="py-3 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Price</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <select
                  value={priceMin || "any"}
                  onChange={(e) => setPriceMin(e.target.value === "any" ? "" : e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                >
                  <option value="any">Any</option>
                  <option value="50">₹50L</option>
                  <option value="75">₹75L</option>
                  <option value="100">₹1Cr</option>
                  <option value="150">₹1.5Cr</option>
                  <option value="200">₹2Cr</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <select
                  value={priceMax || "any"}
                  onChange={(e) => setPriceMax(e.target.value === "any" ? "" : e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                >
                  <option value="any">Any</option>
                  <option value="100">₹1Cr</option>
                  <option value="150">₹1.5Cr</option>
                  <option value="200">₹2Cr</option>
                  <option value="250">₹2.5Cr</option>
                  <option value="300">₹3Cr+</option>
                </select>
              </div>
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyWithPrice}
                onChange={(e) => setOnlyWithPrice(e.target.checked)}
                className="rounded border-gray-300 text-green-600"
              />
              Only show properties with a price
            </label>
          </div>

          {/* Bedrooms */}
          <div className="py-3 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Bedrooms
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <select
                  value={bedMin || "any"}
                  onChange={(e) => setBedMin(e.target.value === "any" ? "" : e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                >
                  <option value="any">Any</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={String(n)}>{n}+</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <select
                  value={bedMax || "any"}
                  onChange={(e) => setBedMax(e.target.value === "any" ? "" : e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                >
                  <option value="any">Any</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bathrooms & Car spaces */}
          <div className="py-3 border-b border-gray-200 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Bathrooms
              </p>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
              >
                <option value="any">Any</option>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={String(n)}>{n}+</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Car spaces
              </p>
              <select
                value={carSpaces}
                onChange={(e) => setCarSpaces(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
              >
                <option value="any">Any</option>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={String(n)}>{n}+</option>
                ))}
              </select>
            </div>
          </div>

          {/* Land size */}
          <div className="py-3 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Land size
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <select
                  value={landMin || "any"}
                  onChange={(e) => setLandMin(e.target.value === "any" ? "" : e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                >
                  <option value="any">Any</option>
                  <option value="200">200 sq m</option>
                  <option value="500">500 sq m</option>
                  <option value="1000">1000 sq m</option>
                  <option value="2000">2000 sq m</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <select
                  value={landMax || "any"}
                  onChange={(e) => setLandMax(e.target.value === "any" ? "" : e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                >
                  <option value="any">Any</option>
                  <option value="500">500 sq m</option>
                  <option value="1000">1000 sq m</option>
                  <option value="2000">2000 sq m</option>
                  <option value="5000">5000 sq m+</option>
                </select>
              </div>
            </div>
          </div>

          {/* New or established */}
          <div className="py-3 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              New or established property
            </p>
            <div className="flex flex-wrap gap-2">
              {NEW_ESTABLISHED.map((o) => (
                <button
                  key={o.value || "all"}
                  type="button"
                  onClick={() => setNewEst(o.value)}
                  className={`rounded-lg border-2 px-3 py-1.5 text-sm font-medium transition-colors ${
                    newEst === o.value ? "border-green-600 bg-green-600 text-white" : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outdoor features */}
          <ExpandableSection title="Outdoor features" defaultOpen={false}>
            {OUTDOOR_FEATURES.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={outdoor.includes(f)}
                  onChange={() => toggle(outdoor, f, setOutdoor)}
                  className="rounded border-gray-300 text-green-600"
                />
                {f}
              </label>
            ))}
            <button type="button" className="text-sm text-green-600 font-medium">
              Show more outdoor features
            </button>
          </ExpandableSection>

          {/* Indoor features */}
          <ExpandableSection title="Indoor features" defaultOpen={false}>
            {INDOOR_FEATURES.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={indoor.includes(f)}
                  onChange={() => toggle(indoor, f, setIndoor)}
                  className="rounded border-gray-300 text-green-600"
                />
                {f}
              </label>
            ))}
            <button type="button" className="text-sm text-green-600 font-medium">
              Show more indoor features
            </button>
          </ExpandableSection>

          {/* Climate control & energy */}
          <ExpandableSection title="Climate control & energy" defaultOpen={false}>
            {CLIMATE_FEATURES.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={climate.includes(f)}
                  onChange={() => toggle(climate, f, setClimate)}
                  className="rounded border-gray-300 text-green-600"
                />
                {f}
              </label>
            ))}
            <button type="button" className="text-sm text-green-600 font-medium">
              Show more climate control & energy
            </button>
          </ExpandableSection>

          {/* Accessibility features */}
          <ExpandableSection title="Accessibility features" defaultOpen={false}>
            <p className="text-xs text-gray-500 mb-2">
              These filters find properties with accessibility features in their descriptions.
            </p>
            {ACCESSIBILITY_FEATURES.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={accessibility.includes(f)}
                  onChange={() => toggle(accessibility, f, setAccessibility)}
                  className="rounded border-gray-300 text-green-600"
                />
                {f}
              </label>
            ))}
            <button type="button" className="text-sm text-green-600 font-medium">
              Show more accessibility features
            </button>
          </ExpandableSection>

          {/* Keywords */}
          <div className="py-3 border-b border-gray-200">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Keywords
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Air con, pool, garage, solar, ensuite..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">Add specific property features to your search</p>
          </div>

          {/* Sale method */}
          <div className="py-3 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Sale method
            </p>
            <div className="flex flex-wrap gap-2">
              {SALE_METHODS.map((o) => (
                <button
                  key={o.value || "all"}
                  type="button"
                  onClick={() => setSaleMethod(o.value)}
                  className={`rounded-lg border-2 px-3 py-1.5 text-sm font-medium transition-colors ${
                    saleMethod === o.value ? "border-green-600 bg-green-600 text-white" : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 py-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={excludeContract}
              onChange={(e) => setExcludeContract(e.target.checked)}
              className="rounded border-gray-300 text-green-600"
            />
            Exclude properties under contract/offer
          </label>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 rounded-lg border-2 border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Clear filters
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className="flex-1 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
