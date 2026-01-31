'use client'

import { useState } from 'react'
import { useTestimonials, updateTestimonial, deleteTestimonial } from '@/hooks/useCMS'
import Link from 'next/link'
import type { Testimonial } from '@/types/cms'

export default function TestimonialsPage() {
  const { testimonials, loading } = useTestimonials(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [approving, setApproving] = useState<string | null>(null)

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

  const handleApprove = async (id: string) => {
    setApproving(id)
    try {
      await updateTestimonial(id, { status: 'approved' })
    } catch (error) {
      alert('Failed to approve testimonial: ' + error)
    } finally {
      setApproving(null)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Testimonials</h1>
        <Link
          href="/admin/dashboard/testimonials/new"
          className="bg-purple-600 hover:bg-purple-700 text-white py-3 sm:py-2 px-4 rounded-lg transition font-medium touch-manipulation text-center w-full sm:w-auto"
        >
          + New Testimonial
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0">
          <table className="w-full min-w-140">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Client</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Area</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 hidden md:table-cell">Testimonial</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Rating</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Status</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 hidden lg:table-cell">Created</th>
                <th className="px-3 md:px-6 py-3 text-right text-xs md:text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <p className="font-medium text-gray-900 text-sm">{testimonial.clientName}</p>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-700 text-sm">{testimonial.area}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-700 max-w-md truncate text-sm hidden md:table-cell">{testimonial.testimonial}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-700 font-medium text-sm">{testimonial.rating}</span>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <span
                      className={`inline-flex px-2 py-0.5 md:py-1 text-xs font-medium rounded ${
                        (testimonial.status ?? 'approved') === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {(testimonial.status ?? 'approved') === 'approved' ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-700 text-sm hidden lg:table-cell">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                    {(testimonial.status ?? 'approved') === 'pending' && (
                      <button
                        onClick={() => handleApprove(testimonial.id)}
                        disabled={approving === testimonial.id}
                        className="text-green-600 hover:text-green-900 text-sm font-medium disabled:opacity-50 mr-2 touch-manipulation"
                      >
                        {approving === testimonial.id ? '...' : 'Approve'}
                      </button>
                    )}
                    <Link
                      href={`/admin/dashboard/testimonials/${testimonial.id}`}
                      className="text-green-600 hover:text-green-900 text-sm font-medium mr-2 touch-manipulation"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      disabled={deleting === testimonial.id}
                      className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50 touch-manipulation"
                    >
                      {deleting === testimonial.id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12 px-4">
            <p className="text-gray-600">No testimonials yet.</p>
            <Link
              href="/admin/dashboard/testimonials/new"
              className="text-purple-600 hover:text-purple-900 mt-2 inline-block font-medium touch-manipulation"
            >
              Create your first testimonial
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
