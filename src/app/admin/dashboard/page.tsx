'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { useAreas, useTestimonials, useListings } from '@/hooks/useCMS'

export default function AdminDashboard() {
  const { areas } = useAreas()
  const { rawListings: listings } = useListings(undefined, { forAdmin: true })
  const { testimonials: allTestimonials } = useTestimonials(false)
  
  const [notifications, setNotifications] = useState<any[]>([])
  const [loadingNotifs, setLoadingNotifs] = useState(true)

  // 1. Setup Stats
  const approvedCount = allTestimonials.filter((t) => (t.status ?? 'approved') === 'approved').length
  const stats = [
    { label: 'Listings', value: listings.length, color: 'bg-green-500' },
    { label: 'Areas', value: areas.length, color: 'bg-emerald-500' },
    { label: 'Testimonials', value: approvedCount, color: 'bg-purple-500' },
  ]

  // 2. Real-time Notification Listener (Matches Android Logic)
  useEffect(() => {
    const q = query(
      collection(db, 'notifications'),
      where('isRead', '==', false)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setNotifications(notifData)
      setLoadingNotifs(false)
    })

    return () => unsubscribe()
  }, [])

  // 3. Handlers
  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault() // Prevents Link navigation
    e.stopPropagation()
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true })
    } catch (err) {
      console.error("Failed to clear notification:", err)
    }
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.color} text-white p-4 md:p-6 rounded-lg shadow`}>
            <p className="text-sm opacity-80">{stat.label}</p>
            <p className="text-3xl md:text-4xl font-bold mt-1 md:mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
        
        {loadingNotifs ? (
          <p className="text-gray-400">Loading notifications...</p>
        ) : notifications.length > 0 ? (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li key={n.id} className="relative group">
                <Link
                  href={n.type === 'enquiry' ? '/admin/dashboard/enquiries' : '/admin/dashboard/testimonials'}
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-green-50/50 hover:bg-green-50 text-gray-800 border border-green-100 transition"
                >
                  <span className="font-medium">{n.text}</span>
                  
                  {/* The 'Cross' button */}
                  <button
                    onClick={(e) => markAsRead(n.id, e)}
                    className="ml-4 p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 transition"
                    title="Mark as read"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 py-2">All caught up — no new notifications.</p>
        )}
      </div>
    </div>
  )
}