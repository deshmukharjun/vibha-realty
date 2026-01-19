'use client'

import { useState } from 'react'
import { useTestimonials, updateTestimonial, deleteTestimonial } from '@/hooks/useCMS'
import Link from 'next/link'
import type { Testimonial } from '@/types/cms'

export default function TestimonialsPage() {
  const { testimonials, loading } = useTestimonials()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    setDeleting(id)
    try {
      await deleteTestimonial(id)
    } catch (error) {
      alert('Failed to delete testimonial: ' + error)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
        <Link
          href="/admin/dashboard/testimonials/new"
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition"
        >
          + New Testimonial
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Client Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Area</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Testimonial</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{testimonial.clientName}</p>
                </td>
                <td className="px-6 py-4 text-gray-700">{testimonial.area}</td>
                <td className="px-6 py-4 text-gray-700 max-w-md truncate">{testimonial.testimonial}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-gray-700 font-medium">{testimonial.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/dashboard/testimonials/${testimonial.id}`}
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    disabled={deleting === testimonial.id}
                    className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                  >
                    {deleting === testimonial.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No testimonials yet.</p>
            <Link
              href="/admin/dashboard/testimonials/new"
              className="text-purple-600 hover:text-purple-900 mt-2 inline-block"
            >
              Create your first testimonial
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
