"use client";

import { useState, useEffect } from "react";
import { useAreas } from "@/hooks/useCMS";
import type {
  Listing,
  ListingCategory,
  ListingTransactionType,
  ListingOwnership,
  ListingStatusTag,
  ListingAdminStatus,
} from "@/types/cms";

/** Property type options aligned with filter modal. */
const PROPERTY_TYPE_OPTIONS: { value: string; label: string; category: ListingCategory }[] = [
  { value: "Retirement Living", label: "Retirement Living", category: "residential" },
  { value: "House", label: "House", category: "residential" },
  { value: "Land", label: "Land", category: "land" },
  { value: "Townhouse", label: "Townhouse", category: "residential" },
  { value: "Acreage", label: "Acreage", category: "land" },
  { value: "Apartment & Unit", label: "Apartment & Unit", category: "residential" },
  { value: "2 BHK Apartment", label: "2 BHK Apartment", category: "residential" },
  { value: "3 BHK Apartment", label: "3 BHK Apartment", category: "residential" },
  { value: "Rural", label: "Rural", category: "commercial" },
  { value: "Villa", label: "Villa", category: "residential" },
  { value: "Block Of Units", label: "Block Of Units", category: "commercial" },
  { value: "Commercial", label: "Commercial", category: "commercial" },
  { value: "Other", label: "Other", category: "residential" },
];

const TRANSACTION_OPTIONS: { value: ListingTransactionType; label: string }[] = [
  { value: "buying", label: "Buy" },
  { value: "selling", label: "Sold" },
];

const OWNERSHIP_OPTIONS: { value: ListingOwnership; label: string }[] = [
  { value: "personal", label: "Personal" },
  { value: "channel-partner", label: "Channel Partner" },
];

const STATUS_TAG_OPTIONS: { value: ListingStatusTag | ""; label: string }[] = [
  { value: "", label: "None" },
  { value: "New", label: "New" },
  { value: "Limited", label: "Limited" },
  { value: "Hot", label: "Hot" },
];

const ADMIN_STATUS_OPTIONS: { value: ListingAdminStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "sold", label: "Sold" },
  { value: "hidden", label: "Hidden" },
];

function lakhsToPaise(l: number): number {
  return l * 1_00_000;
}
function paiseToLakhs(p: number): number {
  return p / 1_00_000;
}

export interface ListingFormValues {
  ownership: ListingOwnership;
  transactionType: ListingTransactionType;
  category: ListingCategory;
  propertyType: string;
  area: string;
  priceRangeMinLakhs: string;
  priceRangeMaxLakhs: string;
  statusTag: ListingStatusTag | "";
  adminStatus: ListingAdminStatus;
  mediaUrls: string[];
  primaryMediaIndex: number;
  valueStatement: string;
}

const defaultValues: ListingFormValues = {
  ownership: "personal",
  transactionType: "buying",
  category: "residential",
  propertyType: "Apartment & Unit",
  area: "",
  priceRangeMinLakhs: "",
  priceRangeMaxLakhs: "",
  statusTag: "",
  adminStatus: "active",
  mediaUrls: [""],
  primaryMediaIndex: 0,
  valueStatement: "",
};

function listingToFormValues(l: Listing): ListingFormValues {
  const primaryIdx = l.media.findIndex((m) => m.isPrimary);
  return {
    ownership: l.ownership,
    transactionType: l.transactionType,
    category: l.category,
    propertyType: l.propertyType,
    area: l.area,
    priceRangeMinLakhs: l.priceRangeMin != null ? String(paiseToLakhs(l.priceRangeMin)) : "",
    priceRangeMaxLakhs: l.priceRangeMax != null ? String(paiseToLakhs(l.priceRangeMax)) : "",
    statusTag: l.statusTag ?? "",
    adminStatus: l.adminStatus,
    mediaUrls: l.media?.length ? l.media.map((m) => m.url) : [""],
    primaryMediaIndex: primaryIdx >= 0 ? primaryIdx : 0,
    valueStatement: l.valueStatement ?? "",
  };
}

function formValuesToListingPayload(
  v: ListingFormValues
): Omit<Listing, "id" | "createdAt" | "updatedAt"> {
  const minPaise = v.priceRangeMinLakhs ? lakhsToPaise(Number(v.priceRangeMinLakhs)) : undefined;
  const maxPaise = v.priceRangeMaxLakhs ? lakhsToPaise(Number(v.priceRangeMaxLakhs)) : undefined;
  const urls = v.mediaUrls.filter((url) => url.trim());
  const primaryIdx = Math.min(v.primaryMediaIndex, urls.length - 1);
  const media = urls.map((url, i) => ({
    url: url.trim(),
    type: "image" as const,
    order: i,
    isPrimary: i === primaryIdx,
  }));
  return {
    ownership: v.ownership,
    transactionType: v.transactionType,
    category: v.category,
    propertyType: v.propertyType,
    area: v.area.trim(),
    priceRangeMin: minPaise,
    priceRangeMax: maxPaise,
    statusTag: v.statusTag || undefined,
    adminStatus: v.adminStatus,
    media,
    valueStatement: v.valueStatement.trim() || undefined,
  } as Omit<Listing, "id" | "createdAt" | "updatedAt">;
}

interface ListingFormProps {
  initialListing?: Listing | null;
  onSubmit: (payload: Omit<Listing, "id" | "createdAt" | "updatedAt">) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ListingForm({
  initialListing,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: ListingFormProps) {
  const { areas } = useAreas();
  const [values, setValues] = useState<ListingFormValues>(
    initialListing ? listingToFormValues(initialListing) : defaultValues
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialListing) setValues(listingToFormValues(initialListing));
  }, [initialListing?.id, initialListing?.updatedAt]);

  const set = <K extends keyof ListingFormValues>(k: K, v: ListingFormValues[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    setError(null);
  };

  const handlePropertyTypeChange = (opt: (typeof PROPERTY_TYPE_OPTIONS)[0]) => {
    set("propertyType", opt.value);
    if (opt.value !== "Other") set("category", opt.category);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!values.area.trim()) {
      setError("Area is required.");
      return;
    }
    const urls = values.mediaUrls.filter((u) => u.trim());
    if (urls.length === 0) {
      setError("At least one image URL is required.");
      return;
    }
    const primaryIdx = Math.min(values.primaryMediaIndex, urls.length - 1);
    setSaving(true);
    try {
      const payload = formValuesToListingPayload({ ...values, primaryMediaIndex: primaryIdx });
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const addMedia = () => {
    setValues((prev) => ({ ...prev, mediaUrls: [...prev.mediaUrls, ""] }));
  };
  const removeMedia = (i: number) => {
    if (values.mediaUrls.length <= 1) return;
    const next = values.mediaUrls.filter((_, j) => j !== i);
    const nextPrimary = values.primaryMediaIndex >= next.length ? next.length - 1 : values.primaryMediaIndex;
    setValues((prev) => ({ ...prev, mediaUrls: next, primaryMediaIndex: nextPrimary }));
  };
  const setMediaUrl = (i: number, url: string) => {
    setValues((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls.map((u, j) => (j === i ? url : u)),
    }));
  };

  const propTypeInOptions = PROPERTY_TYPE_OPTIONS.some(
    (p) => p.category === values.category && p.value === values.propertyType
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction *</label>
        <div className="flex flex-wrap gap-2">
          {TRANSACTION_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => set("transactionType", o.value)}
              className={`rounded-lg border-2 px-4 py-2 text-sm font-medium ${
                values.transactionType === o.value
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">Matches filter: Buy / Sold</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <div className="flex flex-wrap gap-2">
          {(["land", "commercial", "residential"] as ListingCategory[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                set("category", c);
                const opt = PROPERTY_TYPE_OPTIONS.find((p) => p.category === c && p.value !== "Other");
                if (opt) set("propertyType", opt.value);
              }}
              className={`rounded-lg border-2 px-4 py-2 text-sm font-medium capitalize ${
                values.category === c
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">Matches filter: Property type (Land / Commercial / Residential)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Property type *</label>
        <select
          value={propTypeInOptions ? values.propertyType : "Other"}
          onChange={(e) => {
            const opt = PROPERTY_TYPE_OPTIONS.find(
              (p) => p.value === e.target.value && (p.category === values.category || p.value === "Other")
            );
            if (opt) handlePropertyTypeChange(opt);
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
        >
          {PROPERTY_TYPE_OPTIONS.filter(
            (p) => p.category === values.category || p.value === "Other"
          ).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {(!propTypeInOptions || values.propertyType === "Other") && (
          <input
            type="text"
            value={values.propertyType === "Other" ? "" : values.propertyType}
            onChange={(e) => set("propertyType", e.target.value || "Other")}
            placeholder="Enter property type (e.g. 2 BHK Apartment)"
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
          />
        )}
        <p className="text-xs text-gray-500 mt-1">Use options that match the filter modal, or Other + custom type.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ownership *</label>
        <div className="flex flex-wrap gap-2">
          {OWNERSHIP_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => set("ownership", o.value)}
              className={`rounded-lg border-2 px-4 py-2 text-sm font-medium ${
                values.ownership === o.value
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
        {areas.length > 0 ? (
          <select
            value={values.area}
            onChange={(e) => set("area", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
          >
            <option value="">Select area</option>
            {areas.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={values.area}
            onChange={(e) => set("area", e.target.value)}
            placeholder="Area name (e.g. Baner, Wakad)"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price min (₹ lakh)</label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={values.priceRangeMinLakhs}
            onChange={(e) => set("priceRangeMinLakhs", e.target.value)}
            placeholder="e.g. 75"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price max (₹ lakh)</label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={values.priceRangeMaxLakhs}
            onChange={(e) => set("priceRangeMaxLakhs", e.target.value)}
            placeholder="e.g. 95"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 -mt-2">Used by filter: Price Min / Max</p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status tag</label>
        <select
          value={values.statusTag}
          onChange={(e) => set("statusTag", e.target.value as ListingStatusTag | "")}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
        >
          {STATUS_TAG_OPTIONS.map((o) => (
            <option key={o.value || "none"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Admin status *</label>
        <select
          value={values.adminStatus}
          onChange={(e) => set("adminStatus", e.target.value as ListingAdminStatus)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
        >
          {ADMIN_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Active = visible on site (filtered by listing filters).</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Images *</label>
        <p className="text-xs text-gray-500 mb-2">At least one URL. Set which image is primary.</p>
        {values.mediaUrls.map((url, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setMediaUrl(i, e.target.value)}
              placeholder="https://..."
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
            />
            <label className="flex items-center gap-1 whitespace-nowrap text-sm text-gray-600">
              <input
                type="radio"
                name="primaryMedia"
                checked={values.primaryMediaIndex === i}
                onChange={() => set("primaryMediaIndex", i)}
                className="rounded border-gray-300 text-green-600"
              />
              Primary
            </label>
            <button
              type="button"
              onClick={() => removeMedia(i)}
              className="text-red-600 hover:underline text-sm"
              disabled={values.mediaUrls.length <= 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addMedia} className="text-green-600 hover:underline text-sm">
          + Add image URL
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Value statement (optional)</label>
        <textarea
          value={values.valueStatement}
          onChange={(e) => set("valueStatement", e.target.value)}
          rows={3}
          placeholder="High-level value line for the listing"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-(--color-accent) text-white px-6 py-2 font-medium text-sm hover:brightness-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
