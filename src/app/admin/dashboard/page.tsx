'use client'

import { useBlogPosts, useAreas, useChannelPartners, useTestimonials } from '@/hooks/useCMS'

export default function AdminDashboard() {
  const { posts } = useBlogPosts(false)
  const { areas } = useAreas()
  const { partners } = useChannelPartners(false)
  const { testimonials } = useTestimonials()

  const stats = [
    { label: 'Blog Posts', value: posts.length, color: 'bg-blue-500' },
    { label: 'Areas', value: areas.length, color: 'bg-green-500' },
    { label: 'Channel Partners', value: partners.length, color: 'bg-yellow-500' },
    { label: 'Testimonials', value: testimonials.length, color: 'bg-purple-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.color} text-white p-6 rounded-lg shadow`}>
            <p className="text-sm opacity-80">{stat.label}</p>
            <p className="text-4xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/dashboard/blogs/new"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center transition"
          >
            + New Blog
          </a>
          <a
            href="/admin/dashboard/areas/new"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-center transition"
          >
            + New Area
          </a>
          <a
            href="/admin/dashboard/partners/new"
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded text-center transition"
          >
            + New Partner
          </a>
          <a
            href="/admin/dashboard/testimonials/new"
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded text-center transition"
          >
            + New Testimonial
          </a>
        </div>
      </div>
    </div>
  )
}
