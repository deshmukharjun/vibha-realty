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

export interface Listing {
  id: string
  ownership: ListingOwnership
  transactionType: ListingTransactionType
  category: ListingCategory
  area: string
  propertyType: string
  priceRangeMin?: number
  priceRangeMax?: number
  statusTag?: ListingStatusTag
  adminStatus: ListingAdminStatus
  media: ListingMedia[]
  /** High-level value line only. No builder, project, address, RERA, plans, brochures. */
  valueStatement?: string
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

export interface Enquiry {
  id: string
  name: string
  phone: string
  requirement: 'buy' | 'rent' | 'invest'
  area: string
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
