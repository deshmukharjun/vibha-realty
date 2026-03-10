//src/types/cms.ts
export interface Area {
  id: string
  name: string
  shortDescription: string
  fullDescription: string
  /** WhatsApp broadcast group link for this area (e.g. wa.me/group/xxx). Required for Areas I Cover cards. */
  whatsappBroadcastLink?: string
  createdAt: string
  updatedAt: string
}

/** Listing ownership – determines which hero section and labels. */
export type ListingOwnership = 'personal' | 'channel-partner'

/** Transaction intent. */
export type ListingTransactionType = 'buying' | 'selling'

/** Property category – primary filter tab. */
export type ListingCategory = 'land' | 'commercial' | 'residential'

/** Public status tag on cards. */
export type ListingStatusTag = 'New' | 'Limited' | 'Hot' | 'Exclusive' | 'Premium'

/** Admin lifecycle status. */
export type ListingAdminStatus = 'active' | 'sold' | 'hidden'

export interface ListingMedia {
  url: string
  type: 'image' | 'video'
  order: number
  isPrimary: boolean
}

/** Feature keys for listing features (icons shown on detail page and in form). */
export type ListingFeatureKey =
  | 'bedrooms'
  | 'bathrooms'
  | 'parking'
  | 'balcony'
  | 'gym'
  | 'pool'
  | 'garden'
  | 'security'
  | 'power_backup'
  | 'lift'
  | 'modular_kitchen'
  | 'ac'
  | 'furnished'
  | 'vaastu'
  | 'club_house'
  | 'play_area'

/** Channel partner / builder names for listings. */
export type ChannelPartnerName =
  | 'Amar Builders'
  | 'Puranik Builders'
  | 'Shapoorji Pallonji Joyville'
  | 'Mantra'
  | 'Godrej'
  | 'Kalpataru'
  | 'Yashada'
  | 'Kolte Patil'

export interface Listing {
  id: string
  ownership: ListingOwnership
  /** Builder/channel partner name when ownership is channel-partner. */
  channelPartner?: ChannelPartnerName
  transactionType: ListingTransactionType
  category: ListingCategory
  area: string
  propertyType: string
  /** Optional display name (e.g. "Land in Baner, Akashay nagar society"). */
  name?: string
  priceRangeMin?: number
  priceRangeMax?: number
  statusTag?: ListingStatusTag
  adminStatus: ListingAdminStatus
  media: ListingMedia[]
  /** High-level value line / description. */
  valueStatement?: string
  /** Optional display address / locality (e.g. "Sector 5, Baner"). */
  address?: string
  /** Bedrooms count (optional). */
  bedrooms?: number
  /** Bathrooms count (optional). */
  bathrooms?: number
  /** Parking / car spaces (optional). */
  parking?: number
  /** Latitude for map (optional; can be parsed from mapLink). */
  latitude?: number
  /** Longitude for map (optional; can be parsed from mapLink). */
  longitude?: number
  /** Google Maps URL (optional; use instead of or with lat/lng for "View on map"). */
  mapLink?: string
  /** URL to floor plan PDF (uploaded to Cloudinary raw). */
  floorPlanUrl?: string
  /** Feature keys for icons (e.g. gym, pool). */
  features?: ListingFeatureKey[]
  /** Custom facility names when "Other" is used (free text). */
  featuresOther?: string[]
  createdAt: string
  updatedAt: string
}

export interface ChannelPartner {
  id: string
  name: string
  description: string
  propertyTypes: string[]
  areas: string[]
  status: 'active' | 'inactive'
  logo?: string
  createdAt: string
  updatedAt: string
}

/** Approval status for testimonials. Public submissions are pending until admin approves. */
export type TestimonialStatus = 'pending' | 'approved'

export interface Testimonial {
  id: string
  clientName: string
  area: string
  testimonial: string
  image?: string
  rating: number
  /** When missing, treat as 'approved' for backward compatibility. */
  status?: TestimonialStatus
  createdAt: string
  updatedAt: string
}

/** Enquiry requirement type – supports multi-select (buy, rent, invest, sell). */
export type EnquiryRequirement = 'buy' | 'rent' | 'invest' | 'sell'

export interface Enquiry {
  id: string
  name: string
  phone: string
  /** Selected requirements; stored as array for multi-select. Legacy: single string stored as single-element array. */
  requirement: EnquiryRequirement[]
  /** Custom requirement when "Other" is selected. */
  requirementOther?: string
  /** Selected areas; stored as array for multi-select. Legacy: area (string) may exist on old records. */
  areas: string[]
  /** Budget range (e.g. "50L-80L", "Under 1 Cr", "1.5 Crore"). */
  budget?: string
  createdAt: string
}

export interface AdminUser {
  id: string
  email: string
  username: string
  role: 'admin' | 'editor'
  createdAt: string
  lastLogin: string
}
