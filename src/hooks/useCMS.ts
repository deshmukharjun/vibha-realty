import { useEffect, useState, useCallback } from 'react'
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
import type { BlogPost, Area, ChannelPartner, Testimonial, Enquiry } from '@/types/cms'

export const useBlogPosts = (onlyPublished = true) => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        const postsCollection = collection(db, 'blogPosts')
        let q
        if (onlyPublished) {
          q = query(postsCollection, where('status', '==', 'published'))
        } else {
          // Fetch all posts without filter
          q = query(postsCollection)
        }
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BlogPost[]
        
        console.log(`Fetched ${data.length} blog posts (onlyPublished: ${onlyPublished})`)
        
        // Sort by publishedAt, handling potential missing dates
        const sortedData = data.sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
          return dateB - dateA
        })
        
        setPosts(sortedData)
      } catch (err) {
        console.error('Error fetching blog posts:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch blog posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [onlyPublished, refreshTrigger])

  // Expose refresh function - memoized to prevent infinite loops
  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  return { posts, loading, error, refresh }
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

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsCollection = collection(db, 'testimonials')
        const snapshot = await getDocs(testimonialsCollection)
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Testimonial[]
        setTestimonials(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch testimonials')
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  return { testimonials, loading, error }
}

// Admin functions
export const addBlogPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString()
  return await addDoc(collection(db, 'blogPosts'), {
    ...post,
    createdAt: now,
    updatedAt: now,
  })
}

export const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
  const docRef = doc(db, 'blogPosts', id)
  return await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export const deleteBlogPost = async (id: string) => {
  return await deleteDoc(doc(db, 'blogPosts', id))
}

export const getBlogPost = async (id: string): Promise<BlogPost | null> => {
  const docRef = doc(db, 'blogPosts', id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as BlogPost
  }
  return null
}

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

export const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString()
  return await addDoc(collection(db, 'testimonials'), {
    ...testimonial,
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
