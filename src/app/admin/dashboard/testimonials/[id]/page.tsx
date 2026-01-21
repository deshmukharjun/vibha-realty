'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { addTestimonial, updateTestimonial, getTestimonial } from '@/hooks/useCMS'
import { useAreas } from '@/hooks/useCMS'
import Link from 'next/link'
import type { Testimonial } from '@/types/cms'

interface Props {
  params: Promise<{ id?: string }>
}

export default function TestimonialEditor({ params }: Props) {
  const router = useRouter()
  const { areas } = useAreas()
  const { id } = use(params)
  const isEditMode = id && id !== 'new'

  const [formData, setFormData] = useState({
    clientName: '',
    area: '',
    testimonial: '',
    rating: 5,
    image: '',
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTestimonial = async () => {
      if (isEditMode && id) {
        setFetching(true)
        try {
          const testimonial = await getTestimonial(id)
          if (testimonial) {
            setFormData({
              clientName: testimonial.clientName,
              area: testimonial.area,
              testimonial: testimonial.testimonial,
              rating: testimonial.rating,
              image: testimonial.image || '',
            })
          } else {
            setError('Testimonial not found')
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load testimonial')
        } finally {
          setFetching(false)
        }
      }
    }
    loadTestimonial()
  }, [isEditMode, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isEditMode && !id) {
      setError('Invalid testimonial ID')
      setLoading(false)
      return
    }

    try {
      if (isEditMode && id) {
        await updateTestimonial(id, formData)
      } else {
        await addTestimonial(formData)
      }

      router.push('/admin/dashboard/testimonials')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save testimonial')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/dashboard/testimonials" className="text-purple-600 hover:text-purple-900">
          ← Back to Testimonials
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Testimonial' : 'Create New Testimonial'}
      </h1>

      {fetching && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          Loading testimonial...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-4xl">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"
              placeholder="e.g., Rajesh Kumar, Priya Sharma"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <input
              type="text"
              list="area-list-testimonial"
              value={formData.area}
              onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"
              placeholder="Type or select an area (e.g., Baner, Wakad, Aundh)"
              required
            />
            <datalist id="area-list-testimonial">
              {areas.map((area) => (
                <option key={area.id} value={area.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial</label>
            <textarea
              value={formData.testimonial}
              onChange={(e) => setFormData((prev) => ({ ...prev, testimonial: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-black h-48"
              placeholder="Client's testimonial text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData((prev) => ({ ...prev, rating: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <span className="text-2xl text-yellow-500">★</span>
                <span className="text-xl font-bold text-gray-900">{formData.rating}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Image URL (Optional)</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"
              placeholder="https://example.com/client-photo.jpg"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || fetching}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Testimonial'}
          </button>
        </div>
      </form>
    </div>
  )
}
