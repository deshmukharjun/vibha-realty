import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Area, ChannelPartner, Testimonial, Enquiry, Listing } from '@/types/cms'

/** House/property placeholder images for dummy listings (Unsplash, allowed in next.config remotePatterns). Uses seed so each listing gets a distinct image. Only verified working IDs (some Unsplash IDs 404). */
const HOUSE_IMAGES = [
  '1564013799919-ab600027ffc6',
  '1600596542815-ffad4c1539a9',
  '1600585154340-be6161a56a0c',
  '1564013799919-ab600027ffc6',
  '1600596542815-ffad4c1539a9',
  '1600585154340-be6161a56a0c',
]
const placeholder = (seed: string) => {
  let i = 0
  for (let j = 0; j < seed.length; j++) i = (i + seed.charCodeAt(j)) % HOUSE_IMAGES.length
  return `https://images.unsplash.com/photo-${HOUSE_IMAGES[i]}?w=320&h=220&fit=crop`
}

/** 7–8 dummy listings for public hero when Firestore returns empty. Mix of personal/channel-partner, categories, and transaction types. */
const DUMMY_LISTINGS: Listing[] = [
  // ... (Your original 8 listings)
  {
    id: 'dummy-1',
    ownership: 'personal',
    transactionType: 'buying',
    category: 'residential',
    area: 'Baner',
    propertyType: '2 BHK Apartment',
    priceRangeMin: 75_00_000,
    priceRangeMax: 95_00_000,
    statusTag: 'Hot',
    adminStatus: 'active',
    media: [{ url: placeholder('baner-2bhk'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-2',
    ownership: 'personal',
    transactionType: 'selling',
    category: 'residential',
    area: 'Wakad',
    propertyType: '3 BHK Apartment',
    priceRangeMin: 1_20_00_000,
    priceRangeMax: 1_50_00_000,
    statusTag: 'New',
    adminStatus: 'active',
    media: [{ url: placeholder('wakad-3bhk'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-3',
    ownership: 'personal',
    transactionType: 'buying',
    category: 'land',
    area: 'Hadapsar',
    propertyType: 'Residential Plot',
    priceRangeMin: 50_00_000,
    priceRangeMax: 70_00_000,
    statusTag: 'Limited',
    adminStatus: 'active',
    media: [{ url: placeholder('hadapsar-plot'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-4',
    ownership: 'personal',
    transactionType: 'selling',
    category: 'commercial',
    area: 'Kalyani Nagar',
    propertyType: 'Retail Shop',
    priceRangeMin: 2_00_00_000,
    priceRangeMax: 2_50_00_000,
    adminStatus: 'active',
    media: [{ url: placeholder('kalyani-shop'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-5',
    ownership: 'channel-partner',
    transactionType: 'buying',
    category: 'residential',
    area: 'Kothrud',
    propertyType: '2 BHK Ready Apartment',
    priceRangeMin: 80_00_000,
    priceRangeMax: 1_00_00_000,
    statusTag: 'New',
    adminStatus: 'active',
    media: [{ url: placeholder('kothrud-apt'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-6',
    ownership: 'channel-partner',
    transactionType: 'selling',
    category: 'residential',
    area: 'Viman Nagar',
    propertyType: 'Independent Villa',
    priceRangeMin: 2_50_00_000,
    statusTag: 'Hot',
    adminStatus: 'active',
    media: [{ url: placeholder('viman-villa'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-7',
    ownership: 'channel-partner',
    transactionType: 'buying',
    category: 'commercial',
    area: 'Pune City',
    propertyType: 'Office Space',
    priceRangeMin: 1_50_00_000,
    priceRangeMax: 2_00_00_000,
    adminStatus: 'active',
    media: [{ url: placeholder('pune-office'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-8',
    ownership: 'channel-partner',
    transactionType: 'selling',
    category: 'land',
    area: 'Hinjewadi',
    propertyType: 'Plot for Construction',
    priceRangeMin: 60_00_000,
    priceRangeMax: 85_00_000,
    statusTag: 'Limited',
    adminStatus: 'active',
    media: [{ url: placeholder('hinjewadi-plot'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- 10 NEW LISTINGS ---
  {
    id: 'dummy-9',
    ownership: 'personal',
    transactionType: 'selling',
    category: 'residential',
    area: 'Balewadi',
    propertyType: '2.5 BHK Apartment',
    priceRangeMin: 95_00_000,
    priceRangeMax: 1_15_00_000,
    statusTag: 'New',
    adminStatus: 'active',
    media: [{ url: placeholder('balewadi-2-5bhk'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-10',
    ownership: 'channel-partner',
    transactionType: 'buying',
    category: 'residential',
    area: 'Magarpatta City',
    propertyType: 'Studio Apartment',
    priceRangeMin: 45_00_000,
    priceRangeMax: 55_00_000,
    adminStatus: 'active',
    media: [{ url: placeholder('magarpatta-studio'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-11',
    ownership: 'personal',
    transactionType: 'selling',
    category: 'commercial',
    area: 'Bavdhan',
    propertyType: 'Warehouse',
    priceRangeMin: 3_50_00_000,
    statusTag: 'Exclusive',
    adminStatus: 'active',
    media: [{ url: placeholder('bavdhan-warehouse'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-12',
    ownership: 'channel-partner',
    transactionType: 'selling',
    category: 'residential',
    area: 'Pimple Saudagar',
    propertyType: '4 BHK Penthouse',
    priceRangeMin: 2_10_00_000,
    priceRangeMax: 2_60_00_000,
    statusTag: 'Hot',
    adminStatus: 'active',
    media: [{ url: placeholder('pimple-penthouse'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-13',
    ownership: 'personal',
    transactionType: 'buying',
    category: 'land',
    area: 'Wagholi',
    propertyType: 'Industrial Land',
    priceRangeMin: 1_80_00_000,
    adminStatus: 'active',
    media: [{ url: placeholder('wagholi-land'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-14',
    ownership: 'channel-partner',
    transactionType: 'selling',
    category: 'residential',
    area: 'Kharadi',
    propertyType: '1 BHK Smart Home',
    priceRangeMin: 55_00_000,
    priceRangeMax: 65_00_000,
    statusTag: 'New',
    adminStatus: 'active',
    media: [{ url: placeholder('kharadi-1bhk'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-15',
    ownership: 'personal',
    transactionType: 'buying',
    category: 'commercial',
    area: 'Shivajinagar',
    propertyType: 'Showroom Space',
    priceRangeMin: 4_00_00_000,
    priceRangeMax: 6_00_00_000,
    statusTag: 'Premium',
    adminStatus: 'active',
    media: [{ url: placeholder('shivajinagar-showroom'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-16',
    ownership: 'channel-partner',
    transactionType: 'selling',
    category: 'residential',
    area: 'Aundh',
    propertyType: 'Duplex Apartment',
    priceRangeMin: 1_75_00_000,
    priceRangeMax: 2_15_00_000,
    adminStatus: 'active',
    media: [{ url: placeholder('aundh-duplex'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-17',
    ownership: 'personal',
    transactionType: 'buying',
    category: 'residential',
    area: 'Bibwewadi',
    propertyType: 'Row House',
    priceRangeMin: 1_40_00_000,
    statusTag: 'Limited',
    adminStatus: 'active',
    media: [{ url: placeholder('bibwewadi-rowhouse'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-18',
    ownership: 'channel-partner',
    transactionType: 'selling',
    category: 'land',
    area: 'Chakan',
    propertyType: 'NA Plot',
    priceRangeMin: 35_00_000,
    priceRangeMax: 45_00_000,
    statusTag: 'New',
    adminStatus: 'active',
    media: [{ url: placeholder('chakan-plot'), type: 'image', order: 0, isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useListings = (
  filters?: {
    category?: Listing['category']
    transactionType?: Listing['transactionType']
    /** Price min in lakhs (e.g. 75 = ₹75L). Listing passes if its max price >= this. */
    priceMin?: number
    /** Price max in lakhs (e.g. 100 = ₹1Cr). Listing passes if its min price <= this. */
    priceMax?: number
    /** Area/locality search: listings whose area (or propertyType) contains this string (case-insensitive). */
    areaSearch?: string
  },
  options?: { forAdmin?: boolean }
) => {
  const [rawListings, setRawListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const forAdmin = options?.forAdmin ?? false

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      setError(null)
      try {
        const listingsCollection = collection(db, 'listings')
        const q = forAdmin
          ? query(listingsCollection)
          : query(listingsCollection, where('adminStatus', '==', 'active'))
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Listing[]
        setRawListings(data)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch listings'
        if (forAdmin) {
          setError(msg)
          setRawListings([])
        } else if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('insufficient')) {
          setRawListings([])
          setError(null)
        } else {
          setError(msg)
          setRawListings([])
        }
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [forAdmin])

  const sourceList =
    !forAdmin && rawListings.length === 0 && !error ? DUMMY_LISTINGS : rawListings
  const priceMinPaise = filters?.priceMin != null ? filters.priceMin * 1_00_000 : null
  const priceMaxPaise = filters?.priceMax != null ? filters.priceMax * 1_00_000 : null
  const areaQuery = filters?.areaSearch?.trim().toLowerCase() ?? ''
  const filtered = sourceList.filter((l) => {
    if (filters?.category && l.category !== filters.category) return false
    if (filters?.transactionType && l.transactionType !== filters.transactionType) return false
    if (priceMinPaise != null) {
      const listingMax = l.priceRangeMax ?? l.priceRangeMin ?? 0
      if (listingMax < priceMinPaise) return false
    }
    if (priceMaxPaise != null) {
      const listingMin = l.priceRangeMin ?? l.priceRangeMax ?? Infinity
      if (listingMin > priceMaxPaise) return false
    }
    if (areaQuery) {
      const area = (l.area ?? '').toLowerCase()
      const propertyType = (l.propertyType ?? '').toLowerCase()
      if (!area.includes(areaQuery) && !propertyType.includes(areaQuery)) return false
    }
    return true
  })
  const personal = filtered.filter((l) => l.ownership === 'personal')
  const channelPartner = filtered.filter((l) => l.ownership === 'channel-partner')
  return { listings: filtered, personal, channelPartner, rawListings, loading, error }
}

export const useAreas = () => {
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const areasCollection = collection(db, 'areas')
        const snapshot = await getDocs(areasCollection)
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Area[]
        setAreas(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch areas')
      } finally {
        setLoading(false)
      }
    }

    fetchAreas()
  }, [])

  return { areas, loading, error }
}

export const useChannelPartners = (onlyActive = true) => {
  const [partners, setPartners] = useState<ChannelPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const partnersCollection = collection(db, 'channelPartners')
        const constraints = onlyActive ? [where('status', '==', 'active')] : []
        const q = query(partnersCollection, ...constraints)
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ChannelPartner[]
        setPartners(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch partners')
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [onlyActive])

  return { partners, loading, error }
}

/** Public site uses approvedOnly true (default). Admin uses false to see all (pending + approved). */
export const useTestimonials = (approvedOnly = true) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsCollection = collection(db, 'testimonials')
        // When approvedOnly: no filter; Firestore rules allow read only when
        // resource.data.get('status','approved') == 'approved', so only approved/legacy docs are returned.
        // When !approvedOnly (admin): no filter, auth allows reading all.
        const q = query(testimonialsCollection)
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Testimonial[]
        const list = approvedOnly
          ? data.filter((t) => (t.status ?? 'approved') === 'approved')
          : data
        setTestimonials(list)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch testimonials')
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [approvedOnly])

  return { testimonials, loading, error }
}

// Admin functions
export const addArea = async (area: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString()
  return await addDoc(collection(db, 'areas'), {
    ...area,
    createdAt: now,
    updatedAt: now,
  })
}

export const updateArea = async (id: string, updates: Partial<Area>) => {
  const docRef = doc(db, 'areas', id)
  return await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export const deleteArea = async (id: string) => {
  return await deleteDoc(doc(db, 'areas', id))
}

export const addChannelPartner = async (partner: Omit<ChannelPartner, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString()
  return await addDoc(collection(db, 'channelPartners'), {
    ...partner,
    createdAt: now,
    updatedAt: now,
  })
}

export const updateChannelPartner = async (id: string, updates: Partial<ChannelPartner>) => {
  const docRef = doc(db, 'channelPartners', id)
  return await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export const deleteChannelPartner = async (id: string) => {
  return await deleteDoc(doc(db, 'channelPartners', id))
}

export const addListing = async (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString()
  return await addDoc(collection(db, 'listings'), {
    ...listing,
    createdAt: now,
    updatedAt: now,
  })
}

export const updateListing = async (id: string, updates: Partial<Listing>) => {
  const docRef = doc(db, 'listings', id)
  return await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export const deleteListing = async (id: string) => {
  return await deleteDoc(doc(db, 'listings', id))
}

export const getListing = async (id: string): Promise<Listing | null> => {
  const docRef = doc(db, 'listings', id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Listing
  }
  return null
}

/** Public detail page: tries Firestore first, then falls back to DUMMY_LISTINGS when Firestore is empty. */
export const getListingPublic = async (id: string): Promise<Listing | null> => {
  try {
    const fromDb = await getListing(id)
    if (fromDb) return fromDb
  } catch {
    /* ignore */
  }
  return DUMMY_LISTINGS.find((l) => l.id === id) ?? null
}

export const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString()
  return await addDoc(collection(db, 'testimonials'), {
    ...testimonial,
    status: testimonial.status ?? 'approved',
    createdAt: now,
    updatedAt: now,
  })
}

/** Public submission: creates testimonial with status 'pending'. No auth required when Firestore rules allow it. */
export const submitTestimonialPublic = async (data: {
  clientName: string
  area: string
  testimonial: string
  rating?: number
}) => {
  const now = new Date().toISOString()
  return await addDoc(collection(db, 'testimonials'), {
    clientName: data.clientName.trim(),
    area: data.area.trim(),
    testimonial: data.testimonial.trim(),
    rating: data.rating ?? 5,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  })
}

export const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
  const docRef = doc(db, 'testimonials', id)
  return await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export const deleteTestimonial = async (id: string) => {
  return await deleteDoc(doc(db, 'testimonials', id))
}

export const useEnquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const enquiriesCollection = collection(db, 'enquiries')
        const snapshot = await getDocs(enquiriesCollection)
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Enquiry[]
        setEnquiries(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch enquiries')
      } finally {
        setLoading(false)
      }
    }

    fetchEnquiries()
  }, [])

  return { enquiries, loading, error }
}

export const addEnquiry = async (enquiry: Omit<Enquiry, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, 'enquiries'), {
    ...enquiry,
    createdAt: new Date().toISOString(),
  })
}

export const deleteEnquiry = async (id: string) => {
  return await deleteDoc(doc(db, 'enquiries', id))
}

export const getArea = async (id: string): Promise<Area | null> => {
  const docRef = doc(db, 'areas', id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Area
  }
  return null
}

export const getChannelPartner = async (id: string): Promise<ChannelPartner | null> => {
  const docRef = doc(db, 'channelPartners', id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as ChannelPartner
  }
  return null
}

export const getTestimonial = async (id: string): Promise<Testimonial | null> => {
  const docRef = doc(db, 'testimonials', id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Testimonial
  }
  return null
}
