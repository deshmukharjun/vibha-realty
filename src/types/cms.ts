export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: 'residential-updates' | 'investment-guide' | 'commercial-insights' | 'market-trends'
  area: string
  publishedAt: string
  readingTime: number
  author: string
  featured: boolean
  createdAt: string
  updatedAt: string
  status: 'draft' | 'published'
}

export interface Area {
  id: string
  name: string
  shortDescription: string
  fullDescription: string
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

export interface Testimonial {
  id: string
  clientName: string
  area: string
  testimonial: string
  image?: string
  rating: number
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
