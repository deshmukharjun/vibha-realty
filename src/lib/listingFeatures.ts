import type { ListingFeatureKey } from "@/types/cms";
import {
  BedDouble,
  Bath,
  Car,
  TreePine,
  Dumbbell,
  Waves,
  Flower2,
  ShieldCheck,
  Zap,
  Building2,
  ChefHat,
  AirVent,
  Sofa,
  Sun,
  Users,
  Baby,
  type LucideIcon,
} from "lucide-react";

export interface FeatureOption {
  key: ListingFeatureKey;
  label: string;
  icon: LucideIcon;
}

/** All feature options for form checkboxes and detail page icons. */
export const LISTING_FEATURE_OPTIONS: FeatureOption[] = [
  { key: "bedrooms", label: "Bedrooms", icon: BedDouble },
  { key: "bathrooms", label: "Bathrooms", icon: Bath },
  { key: "parking", label: "Parking", icon: Car },
  { key: "balcony", label: "Balcony", icon: TreePine },
  { key: "gym", label: "Gym", icon: Dumbbell },
  { key: "pool", label: "Pool", icon: Waves },
  { key: "garden", label: "Garden", icon: Flower2 },
  { key: "security", label: "Security", icon: ShieldCheck },
  { key: "power_backup", label: "Power backup", icon: Zap },
  { key: "lift", label: "Lift", icon: Building2 },
  { key: "modular_kitchen", label: "Modular kitchen", icon: ChefHat },
  { key: "ac", label: "AC", icon: AirVent },
  { key: "furnished", label: "Furnished", icon: Sofa },
  { key: "vaastu", label: "Vaastu compliant", icon: Sun },
  { key: "club_house", label: "Club house", icon: Users },
  { key: "play_area", label: "Play area", icon: Baby },
];

/** Numeric feature keys (show count on listing page; use listing.bedrooms etc.). */
export const NUMERIC_FEATURE_KEYS: ListingFeatureKey[] = ["bedrooms", "bathrooms", "parking"];

/** Amenity features only (for form checkboxes; beds/baths/parking are number inputs). */
export const AMENITY_FEATURE_OPTIONS = LISTING_FEATURE_OPTIONS.filter(
  (f) => !NUMERIC_FEATURE_KEYS.includes(f.key)
);

export function getFeatureOption(key: ListingFeatureKey): FeatureOption | undefined {
  return LISTING_FEATURE_OPTIONS.find((f) => f.key === key);
}
