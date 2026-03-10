"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { uploadImage, uploadVideo, uploadRawFile, isCloudinaryConfigured } from "@/lib/cloudinary";
import { useAreas } from "@/hooks/useCMS";
import type {
  Listing,
  ListingCategory,
  ListingOwnership,
  ListingStatusTag,
  ListingAdminStatus,
  ListingFeatureKey,
  ChannelPartnerName,
} from "@/types/cms";
import { AMENITY_FEATURE_OPTIONS } from "@/lib/listingFeatures";
import { parseLatLngFromMapLink } from "@/lib/mapLink";
import { ImagePlus, Star, Trash2, FileText, MapPin, Video } from "lucide-react";

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

const OWNERSHIP_OPTIONS: { value: ListingOwnership; label: string }[] = [
  { value: "personal", label: "Personal" },
  { value: "channel-partner", label: "Channel Partner" },
];

const CHANNEL_PARTNER_OPTIONS: { value: ChannelPartnerName; label: string }[] = [
  { value: "Amar Builders", label: "Amar Builders" },
  { value: "Puranik Builders", label: "Puranik Builders" },
  { value: "Shapoorji Pallonji Joyville", label: "Shapoorji Pallonji Joyville" },
  { value: "Mantra", label: "Mantra" },
  { value: "Godrej", label: "Godrej" },
  { value: "Kalpataru", label: "Kalpataru" },
  { value: "Yashada", label: "Yashada" },
  { value: "Kolte Patil", label: "Kolte Patil" },
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

function toPaise(value: number, unit: 'lakh' | 'crore'): number {
  return unit === 'crore' ? value * 1_00_00_000 : value * 1_00_000;
}
function paiseToLakhs(p: number): number {
  return p / 1_00_000;
}

export interface ListingFormValues {
  ownership: ListingOwnership;
  channelPartner: ChannelPartnerName | "";
  category: ListingCategory;
  propertyType: string;
  area: string;
  name: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  mapLink: string;
  latitude: string;
  longitude: string;
  priceRangeMinLakhs: string;
  priceRangeMinUnit: 'lakh' | 'crore';
  priceRangeMaxLakhs: string;
  priceRangeMaxUnit: 'lakh' | 'crore';
  statusTag: ListingStatusTag | "";
  adminStatus: ListingAdminStatus;
  mediaUrls: string[];
  videoUrls: string[];
  primaryMediaIndex: number;
  floorPlanUrl: string;
  floorPlanFile: File | null;
  features: ListingFeatureKey[];
  featuresOther: string[];
  valueStatement: string;
}

const defaultValues: ListingFormValues = {
  ownership: "personal",
  channelPartner: "",
  category: "residential",
  propertyType: "Apartment & Unit",
  area: "",
  name: "",
  address: "",
  bedrooms: "",
  bathrooms: "",
  parking: "",
  mapLink: "",
  latitude: "",
  longitude: "",
  priceRangeMinLakhs: "",
  priceRangeMinUnit: "lakh",
  priceRangeMaxLakhs: "",
  priceRangeMaxUnit: "lakh",
  statusTag: "",
  adminStatus: "active",
  mediaUrls: [""],
  videoUrls: [],
  primaryMediaIndex: 0,
  floorPlanUrl: "",
  floorPlanFile: null,
  features: [],
  featuresOther: [],
  valueStatement: "",
};

const MAX_IMAGES = 13;
const MAX_VIDEOS = 2;

function listingToFormValues(l: Listing): ListingFormValues {
  const images = l.media?.filter((m) => m.type === "image") ?? [];
  const videos = l.media?.filter((m) => m.type === "video") ?? [];
  const primaryIdx = images.findIndex((m) => m.isPrimary);
  const imageUrls = images.map((m) => m.url);
  const videoUrls = videos.map((m) => m.url);
  return {
    ownership: l.ownership,
    channelPartner: l.channelPartner ?? "",
    category: l.category,
    propertyType: l.propertyType,
    area: l.area,
    name: l.name ?? "",
    address: l.address ?? "",
    bedrooms: l.bedrooms != null ? String(l.bedrooms) : "",
    bathrooms: l.bathrooms != null ? String(l.bathrooms) : "",
    parking: l.parking != null ? String(l.parking) : "",
    mapLink: l.mapLink ?? "",
    latitude: l.latitude != null ? String(l.latitude) : "",
    longitude: l.longitude != null ? String(l.longitude) : "",
    priceRangeMinLakhs: l.priceRangeMin != null ? String(paiseToLakhs(l.priceRangeMin)) : "",
    priceRangeMinUnit: "lakh",
    priceRangeMaxLakhs: l.priceRangeMax != null ? String(paiseToLakhs(l.priceRangeMax)) : "",
    priceRangeMaxUnit: "lakh",
    statusTag: l.statusTag ?? "",
    adminStatus: l.adminStatus,
    mediaUrls: imageUrls.length ? imageUrls : [""],
    videoUrls,
    primaryMediaIndex: primaryIdx >= 0 ? primaryIdx : 0,
    floorPlanUrl: l.floorPlanUrl ?? "",
    floorPlanFile: null,
    features: l.features ?? [],
    featuresOther: (l as { featuresOther?: string[] }).featuresOther ?? [],
    valueStatement: l.valueStatement ?? "",
  };
}

function formValuesToListingPayload(
  v: ListingFormValues,
  resolvedFloorPlanUrl?: string,
  resolvedVideoUrls?: string[]
): Omit<Listing, "id" | "createdAt" | "updatedAt"> {
  const minPaise = v.priceRangeMinLakhs ? toPaise(Number(v.priceRangeMinLakhs), v.priceRangeMinUnit) : undefined;
  const maxPaise = v.priceRangeMaxLakhs ? toPaise(Number(v.priceRangeMaxLakhs), v.priceRangeMaxUnit) : undefined;
  const imageUrls = v.mediaUrls.filter((url) => url.trim());
  const videoUrls = resolvedVideoUrls ?? v.videoUrls.filter((url) => url.trim());
  const primaryIdx = Math.min(v.primaryMediaIndex, Math.max(0, imageUrls.length - 1));
  const media: { url: string; type: "image" | "video"; order: number; isPrimary: boolean }[] = [
    ...imageUrls.map((url, i) => ({
      url: url.trim(),
      type: "image" as const,
      order: i,
      isPrimary: i === primaryIdx,
    })),
    ...videoUrls.map((url, i) => ({
      url: url.trim(),
      type: "video" as const,
      order: imageUrls.length + i,
      isPrimary: false,
    })),
  ];
  const valueStatement = v.valueStatement.trim() || undefined;
  const name = v.name.trim() || undefined;
  const address = v.address.trim() || undefined;
  const bedrooms = v.bedrooms.trim() ? Number(v.bedrooms) : undefined;
  const bathrooms = v.bathrooms.trim() ? Number(v.bathrooms) : undefined;
  const parking = v.parking.trim() ? Number(v.parking) : undefined;
  const mapLink = v.mapLink.trim() || undefined;
  const lat = v.latitude.trim() ? Number(v.latitude) : undefined;
  const lng = v.longitude.trim() ? Number(v.longitude) : undefined;
  const floorPlanUrl = resolvedFloorPlanUrl ?? (v.floorPlanUrl.trim() || undefined);
  const features = v.features.length ? v.features : undefined;
  const featuresOther = v.featuresOther.filter((x) => x.trim()).length ? v.featuresOther.filter((x) => x.trim()) : undefined;
  return {
    ownership: v.ownership,
    ...(v.ownership === "channel-partner" && v.channelPartner && { channelPartner: v.channelPartner }),
    transactionType: 'buying' as const,
    category: v.category,
    propertyType: v.propertyType,
    area: v.area.trim(),
    ...(name && { name }),
    ...(address && { address }),
    ...(bedrooms != null && { bedrooms }),
    ...(bathrooms != null && { bathrooms }),
    ...(parking != null && { parking }),
    ...(lat != null && { latitude: lat }),
    ...(lng != null && { longitude: lng }),
    ...(mapLink && { mapLink }),
    ...(minPaise != null && { priceRangeMin: minPaise }),
    ...(maxPaise != null && { priceRangeMax: maxPaise }),
    ...(v.statusTag && { statusTag: v.statusTag }),
    adminStatus: v.adminStatus,
    media,
    ...(floorPlanUrl && { floorPlanUrl }),
    ...(features && { features }),
    ...(featuresOther && { featuresOther }),
    ...(valueStatement && { valueStatement }),
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
  /** Image list: existing URLs or pending Files. Max 13. Upload happens only on Save. */
  const [imageItems, setImageItems] = useState<(string | File)[]>(() => {
    const imgs = initialListing?.media?.filter((m) => m.type === "image") ?? [];
    return imgs.length ? imgs.map((m) => m.url) : [];
  });
  /** Video list: existing URLs or pending Files. Max 2, optional. No watermark. */
  const [videoItems, setVideoItems] = useState<(string | File)[]>(() => {
    const vids = initialListing?.media?.filter((m) => m.type === "video") ?? [];
    return vids.length ? vids.map((m) => m.url) : [];
  });
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialListing) {
      setValues(listingToFormValues(initialListing));
      const imgs = initialListing.media?.filter((m) => m.type === "image") ?? [];
      const vids = initialListing.media?.filter((m) => m.type === "video") ?? [];
      setImageItems(imgs.length ? imgs.map((m) => m.url) : []);
      setVideoItems(vids.length ? vids.map((m) => m.url) : []);
    }
  }, [initialListing?.id, initialListing?.updatedAt]);

  const set = <K extends keyof ListingFormValues>(k: K, v: ListingFormValues[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    setError(null);
  };

  const handlePropertyTypeChange = (opt: (typeof PROPERTY_TYPE_OPTIONS)[0]) => {
    set("propertyType", opt.value);
    if (opt.value !== "Other") set("category", opt.category);
  };

  const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB (Cloudinary free tier)
  const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB (Cloudinary free tier)

  const resolveImageUrls = async (): Promise<string[]> => {
    const urls: string[] = [];
    const total = imageItems.length;
    let skipped = 0;
    for (let i = 0; i < total; i++) {
      setUploadProgress({ current: i + 1, total });
      const item = imageItems[i];
      if (typeof item === "string") {
        urls.push(item);
        continue;
      }
      if (item.size > MAX_IMAGE_BYTES) {
        skipped++;
        continue;
      }
      const url = await uploadImage(item, "listings");
      urls.push(url);
    }
    if (skipped > 0) setError(`${skipped} image(s) exceeded 10 MB and were skipped.`);
    return urls;
  };

  const resolveVideoUrls = async (): Promise<string[]> => {
    const urls: string[] = [];
    const total = imageItems.length + videoItems.length;
    let skipped = 0;
    for (let i = 0; i < videoItems.length; i++) {
      setUploadProgress({ current: imageItems.length + i + 1, total });
      const item = videoItems[i];
      if (typeof item === "string") {
        urls.push(item);
        continue;
      }
      if (item.size > MAX_VIDEO_BYTES) {
        skipped++;
        continue;
      }
      const url = await uploadVideo(item, "listings/videos");
      urls.push(url);
    }
    if (skipped > 0) setError(`${skipped} video(s) exceeded 100 MB and were skipped.`);
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!values.area.trim()) {
      setError("Area is required.");
      return;
    }
    if (imageItems.length === 0) {
      setError("Add at least one image.");
      return;
    }
    const hasNewImages = imageItems.some((item) => typeof item !== "string");
    const hasNewVideos = videoItems.some((item) => typeof item !== "string");
    if ((hasNewImages || hasNewVideos) && !isCloudinaryConfigured()) {
      setError("Image/Video upload is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local (see CLOUDINARY_SETUP.md).");
      return;
    }
    const primaryIdx = Math.min(values.primaryMediaIndex, Math.max(0, imageItems.length - 1));
    setSaving(true);
    try {
      const mediaUrls = await resolveImageUrls();
      const resolvedVideoUrls = await resolveVideoUrls();
      setUploadProgress(null);
      let floorPlanUrl: string | undefined = values.floorPlanUrl.trim() || undefined;
      if (values.floorPlanFile && isCloudinaryConfigured()) {
        if (values.floorPlanFile.size <= MAX_IMAGE_BYTES) {
          floorPlanUrl = await uploadRawFile(values.floorPlanFile, "floorplans");
        } else {
          setError("Floor plan PDF exceeded 10 MB and was skipped.");
        }
      }
      const payload = formValuesToListingPayload(
        {
          ...values,
          mediaUrls,
          primaryMediaIndex: primaryIdx,
        },
        floorPlanUrl,
        resolvedVideoUrls
      );
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload or save failed. Please try again.");
      setUploadProgress(null);
    } finally {
      setSaving(false);
    }
  };

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (valid.length !== files.length) setError("Some files were not images and were skipped.");
    setImageItems((prev) => [...prev, ...valid].slice(0, MAX_IMAGES));
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addVideoFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith("video/"));
    if (valid.length !== files.length) setError("Some files were not videos and were skipped.");
    setVideoItems((prev) => [...prev, ...valid].slice(0, MAX_VIDEOS));
    setError(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeImageItem = (index: number) => {
    if (imageItems.length <= 1) return;
    setImageItems((prev) => prev.filter((_, j) => j !== index));
    if (values.primaryMediaIndex >= imageItems.length - 1) {
      setValues((prev) => ({ ...prev, primaryMediaIndex: Math.max(0, imageItems.length - 2) }));
    } else if (index < values.primaryMediaIndex) {
      setValues((prev) => ({ ...prev, primaryMediaIndex: prev.primaryMediaIndex - 1 }));
    }
  };

  const removeVideoItem = (index: number) => {
    setVideoItems((prev) => prev.filter((_, j) => j !== index));
  };

  const setPrimary = (index: number) => {
    setValues((prev) => ({ ...prev, primaryMediaIndex: index }));
  };

  // Stable preview URLs for image File items (avoids blob ERR_FILE_NOT_FOUND)
  const fileBlobUrlsRef = useRef<Map<File, string>>(new Map());
  const imagePreviewUrls = useMemo(() => {
    const urls: string[] = [];
    const currentFiles = new Set<File>();
    for (const item of imageItems) {
      if (typeof item === "string") {
        urls.push(item);
        continue;
      }
      currentFiles.add(item);
      if (!fileBlobUrlsRef.current.has(item)) {
        fileBlobUrlsRef.current.set(item, URL.createObjectURL(item));
      }
      urls.push(fileBlobUrlsRef.current.get(item)!);
    }
    return urls;
  }, [imageItems]);
  useEffect(() => {
    const files = new Set(imageItems.filter((x): x is File => typeof x !== "string"));
    fileBlobUrlsRef.current.forEach((url, file) => {
      if (!files.has(file)) {
        URL.revokeObjectURL(url);
        fileBlobUrlsRef.current.delete(file);
      }
    });
  }, [imageItems]);

  const propTypeInOptions = PROPERTY_TYPE_OPTIONS.some(
    (p) => p.category === values.category && p.value === values.propertyType
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm" role="alert">
          {error}
        </div>
      )}

      {uploadProgress && (
        <div className="rounded-xl bg-(--color-secondary) border border-(--color-accent) px-4 py-3 text-sm text-gray-800">
          Uploading… {uploadProgress.current} of {uploadProgress.total}
        </div>
      )}

      {/* Section: Listing type */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Listing type</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
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
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    values.category === c
                      ? "border-(--color-accent) bg-(--color-accent) text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property type</label>
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
                placeholder="e.g. 2 BHK Apartment"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ownership</label>
            <div className="flex flex-wrap gap-2">
              {OWNERSHIP_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => set("ownership", o.value)}
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    values.ownership === o.value
                      ? "border-(--color-accent) bg-(--color-accent) text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {values.ownership === "channel-partner" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Channel partner</label>
                <select
                  value={values.channelPartner}
                  onChange={(e) => set("channelPartner", e.target.value as ChannelPartnerName | "")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
                >
                  <option value="">Select builder</option>
                  {CHANNEL_PARTNER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section: Property details */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Property details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Listing name (optional)</label>
            <input
              type="text"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Land in Baner, Akashay nagar society"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Shown as the main title on the listing page. If empty, area + property type is used.</p>
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
                placeholder="e.g. Baner, Wakad"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address / locality (optional)</label>
            <input
              type="text"
              value={values.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="e.g. Sector 5, Near XYZ Mall"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input
                type="number"
                min={0}
                max={20}
                value={values.bedrooms}
                onChange={(e) => set("bedrooms", e.target.value)}
                placeholder="—"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input
                type="number"
                min={0}
                max={20}
                value={values.bathrooms}
                onChange={(e) => set("bathrooms", e.target.value)}
                placeholder="—"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parking</label>
              <input
                type="number"
                min={0}
                max={20}
                value={values.parking}
                onChange={(e) => set("parking", e.target.value)}
                placeholder="—"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price min</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={values.priceRangeMinLakhs}
                  onChange={(e) => set("priceRangeMinLakhs", e.target.value)}
                  placeholder="e.g. 75"
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
                />
                <select
                  value={values.priceRangeMinUnit}
                  onChange={(e) => set("priceRangeMinUnit", e.target.value as "lakh" | "crore")}
                  className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
                >
                  <option value="lakh">Lakh</option>
                  <option value="crore">Crore</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price max</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={values.priceRangeMaxLakhs}
                  onChange={(e) => set("priceRangeMaxLakhs", e.target.value)}
                  placeholder="e.g. 95"
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
                />
                <select
                  value={values.priceRangeMaxUnit}
                  onChange={(e) => set("priceRangeMaxUnit", e.target.value as "lakh" | "crore")}
                  className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
                >
                  <option value="lakh">Lakh</option>
                  <option value="crore">Crore</option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
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
              <p className="text-xs text-gray-500 mt-1">Active = visible on site</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Location (map) */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600" /> Location
        </h2>
        <p className="text-sm text-gray-500 mb-4">Paste a Google Maps link. If the link contains coordinates, the map will be embedded on the listing page.</p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps link (optional)</label>
          <input
            type="url"
            value={values.mapLink}
            onChange={(e) => set("mapLink", e.target.value)}
            onBlur={() => {
              const parsed = parseLatLngFromMapLink(values.mapLink);
              if (parsed) {
                setValues((prev) => ({
                  ...prev,
                  latitude: String(parsed.lat),
                  longitude: String(parsed.lng),
                }));
              }
            }}
            placeholder="e.g. https://www.google.com/maps?q=18.52,73.85"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
          />
          {values.latitude && values.longitude && (
            <p className="text-xs text-gray-500 mt-1">
              Coordinates detected: {values.latitude}, {values.longitude} — map will be embedded on the listing page.
            </p>
          )}
        </div>
      </section>

      {/* Section: Images */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Images</h2>
        <p className="text-sm text-gray-500 mb-4">
          Up to {MAX_IMAGES} images. Pick one as primary (shown first). Watermark is applied when you save.
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={(e) => addFiles(e.target.files)}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={saving || imageItems.length >= MAX_IMAGES}
          className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-(--color-accent) hover:bg-(--color-secondary)/30 hover:text-gray-900 transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          <ImagePlus className="w-5 h-5" />
          Select images ({imageItems.length}/{MAX_IMAGES})
        </button>
        {imageItems.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imageItems.map((_, i) => (
              <ImageThumbnail
                key={i}
                src={imagePreviewUrls[i] ?? ""}
                isPrimary={values.primaryMediaIndex === i}
                onSetPrimary={() => setPrimary(i)}
                onRemove={() => removeImageItem(i)}
                canRemove={imageItems.length > 1}
              />
            ))}
          </div>
        )}
        {imageItems.length > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            {imageItems.length} image{imageItems.length !== 1 ? "s" : ""}. Click the star to set primary.
          </p>
        )}
      </section>

      {/* Section: Videos (optional) */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Video className="w-5 h-5 text-green-600" /> Videos (optional)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Up to {MAX_VIDEOS} videos. No watermark applied.
        </p>
        <input
          type="file"
          accept="video/*"
          multiple
          ref={videoInputRef}
          onChange={(e) => addVideoFiles(e.target.files)}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          disabled={saving || videoItems.length >= MAX_VIDEOS}
          className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-(--color-accent) hover:bg-(--color-secondary)/30 hover:text-gray-900 transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          <Video className="w-5 h-5" />
          Select videos ({videoItems.length}/{MAX_VIDEOS})
        </button>
        {videoItems.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {videoItems.map((item, i) => (
              <VideoThumbnail
                key={i}
                item={item}
                onRemove={() => removeVideoItem(i)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section: Floor plan */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" /> Floor plan
        </h2>
        <p className="text-sm text-gray-500 mb-4">Optional. Upload a PDF to show on the listing page.</p>
        <input
          type="file"
          accept=".pdf,application/pdf"
          className="sr-only"
          id="floorplan-input"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setValues((prev) => ({
              ...prev,
              floorPlanFile: file ?? null,
              floorPlanUrl: file ? "" : prev.floorPlanUrl,
            }));
            e.target.value = "";
          }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="floorplan-input"
            className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-green-500 hover:bg-green-50/50 cursor-pointer"
          >
            <FileText className="w-5 h-5" />
            {values.floorPlanFile ? values.floorPlanFile.name : values.floorPlanUrl ? "Replace PDF" : "Upload PDF"}
          </label>
          {(values.floorPlanUrl || values.floorPlanFile) && (
            <button
              type="button"
              onClick={() => setValues((prev) => ({ ...prev, floorPlanUrl: "", floorPlanFile: null }))}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Remove floor plan
            </button>
          )}
        </div>
        {values.floorPlanUrl && !values.floorPlanFile && (
          <p className="mt-2 text-xs text-gray-500">Current file is saved. Upload a new PDF to replace.</p>
        )}
      </section>

      {/* Section: Features */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Features & amenities</h2>
        <p className="text-sm text-gray-500 mb-4">Select all that apply. Add custom facilities in the text field below.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {AMENITY_FEATURE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const checked = values.features.includes(opt.key);
            return (
              <label
                key={opt.key}
                className={`inline-flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                  checked
                    ? "border-green-600 bg-green-50 text-green-800"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    setValues((prev) => ({
                      ...prev,
                      features: e.target.checked
                        ? [...prev.features, opt.key]
                        : prev.features.filter((k) => k !== opt.key),
                    }));
                  }}
                  className="sr-only"
                />
                <Icon className="w-4 h-4 shrink-0" />
                {opt.label}
              </label>
            );
          })}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Other facilities (comma-separated)</label>
          <input
            type="text"
            value={values.featuresOther.join(", ")}
            onChange={(e) =>
              set(
                "featuresOther",
                e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
              )
            }
            placeholder="e.g. Conference room, Cafeteria"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
          />
        </div>
      </section>

      {/* Section: Notes */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes (optional)</h2>
        <textarea
          value={values.valueStatement}
          onChange={(e) => set("valueStatement", e.target.value)}
          rows={3}
          placeholder="Short value line or description for this listing"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
        />
      </section>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || imageItems.length === 0}
          className="rounded-lg bg-(--color-accent) text-white px-6 py-3 font-medium text-sm hover:brightness-90 disabled:opacity-50 transition-opacity"
        >
          {saving
            ? uploadProgress
              ? `Uploading… ${uploadProgress.current}/${uploadProgress.total}`
              : "Saving…"
            : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

/** Thumbnail with primary star and remove. Receives stable preview URL from parent. */
function ImageThumbnail({
  src,
  isPrimary,
  onSetPrimary,
  onRemove,
  canRemove,
}: {
  src: string;
  isPrimary: boolean;
  onSetPrimary: () => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div
      className={`relative rounded-lg border-2 overflow-hidden bg-gray-100 aspect-[4/3] ${
        isPrimary ? "border-(--color-accent) ring-2 ring-(--color-accent)/30" : "border-gray-200"
      }`}
    >
      <img src={src} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex items-end justify-between p-2 bg-gradient-to-t from-black/60 to-transparent">
        <button
          type="button"
          onClick={onSetPrimary}
          className={`p-1.5 rounded-full transition-colors ${
            isPrimary ? "bg-(--color-accent) text-white" : "bg-white/90 text-gray-500 hover:bg-white"
          }`}
          title="Set as primary image"
        >
          <Star className={`w-4 h-4 ${isPrimary ? "fill-current" : ""}`} />
        </button>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      {isPrimary && (
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-(--color-accent) text-white">
          Primary
        </span>
      )}
    </div>
  );
}

/** Video card with remove button. */
function VideoThumbnail({
  item,
  onRemove,
}: {
  item: string | File;
  onRemove: () => void;
}) {
  const label = typeof item === "string" ? "Saved video" : item.name;
  return (
    <div className="flex items-center gap-3 rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3">
      <Video className="w-8 h-8 text-gray-500 shrink-0" />
      <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]" title={label}>
        {label}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors shrink-0"
        title="Remove video"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
