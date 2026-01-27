'use client'

import Link from 'next/link'
import { useAreas, useTestimonials, useListings, useEnquiries } from '@/hooks/useCMS'

const DAYS_RECENT = 7
const isRecent = (iso: string, days: number) => {
  const then = new Date(iso).getTime()
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return then >= cutoff
}

export default function AdminDashboard() {
  const { areas } = useAreas()
  const { rawListings: listings } = useListings(undefined, { forAdmin: true })
  const { testimonials: allTestimonials } = useTestimonials(false)
  const { enquiries } = useEnquiries()

  const approvedCount = allTestimonials.filter((t) => (t.status ?? 'approved') === 'approved').length
  const pendingTestimonials = allTestimonials.filter((t) => t.status === 'pending').length
  const recentEnquiries = enquiries.filter((e) => isRecent(e.createdAt, DAYS_RECENT))

  const stats = [
    { label: 'Listings', value: listings.length, color: 'bg-green-500' },
    { label: 'Areas', value: areas.length, color: 'bg-emerald-500' },
    { label: 'Testimonials', value: approvedCount, color: 'bg-purple-500' },
  ]

  const notifications: { id: string; message: string; href: string }[] = []
  if (recentEnquiries.length > 0) {
    notifications.push({
      id: 'enquiries',
      message:
        recentEnquiries.length === 1
          ? 'You have a new enquiry'
          : `You have ${recentEnquiries.length} new enquiries`,
      href: '/admin/dashboard/enquiries',
    })
  }
  if (pendingTestimonials > 0) {
    notifications.push({
      id: 'testimonials',
      message:
        pendingTestimonials === 1
          ? 'You have a new testimonial pending approval'
          : `You have ${pendingTestimonials} testimonials pending approval`,
      href: '/admin/dashboard/testimonials',
    })
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.color} text-white p-4 md:p-6 rounded-lg shadow touch-manipulation`}>
            <p className="text-sm opacity-80">{stat.label}</p>
            <p className="text-3xl md:text-4xl font-bold mt-1 md:mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
        {notifications.length > 0 ? (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.href}
                  className="block py-2 px-3 rounded-lg bg-gray-50 hover:bg-green-50 text-gray-800 hover:text-green-800 transition font-medium touch-manipulation border border-gray-100 hover:border-green-200"
                >
                  {n.message}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 py-2">All caught up — no new enquiries or pending testimonials.</p>
        )}
      </div>
    </div>
  )
}
