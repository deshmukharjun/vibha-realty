'use client'

import { useState } from 'react'
import { submitTestimonialPublic } from '@/hooks/useCMS'
import { useAreas } from '@/hooks/useCMS'
import { Button } from '@/components/ui/Button'

interface TestimonialSubmitFormProps {
  /** Called after successful submit; use to e.g. close a modal */
  onSuccess?: () => void
}

export function TestimonialSubmitForm({ onSuccess }: TestimonialSubmitFormProps) {
  const { areas } = useAreas()
  const [formData, setFormData] = useState({
    clientName: '',
    area: '',
    testimonial: '',
    rating: 5,
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await submitTestimonialPublic({
        clientName: formData.clientName.trim(),
        area: formData.area.trim(),
        testimonial: formData.testimonial.trim(),
        rating: formData.rating,
      })
      setSubmitted(true)
      setFormData({ clientName: '', area: '', testimonial: '', rating: 5 })
      onSuccess?.()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to submit testimonial'
      setError(msg)
      if (msg.toLowerCase().includes('permission') || (err as { code?: string })?.code === 'permission-denied') {
        setError('Submission is temporarily unavailable. Please contact us to share your feedback.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
        <p className="font-medium">Thank you! Your testimonial has been submitted.</p>
        <p className="text-sm mt-1">It will appear here after review.</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-3 text-green-700 underline text-sm hover:no-underline"
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="testimonial-clientName" className="block text-sm font-medium text-gray-700 mb-1">
          Your first name
        </label>
        <input
          id="testimonial-clientName"
          type="text"
          value={formData.clientName}
          onChange={(e) => setFormData((p) => ({ ...p, clientName: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-900"
          placeholder="e.g. Priya"
          required
        />
      </div>
      <div>
        <label htmlFor="testimonial-area" className="block text-sm font-medium text-gray-700 mb-1">
          Area you purchased in
        </label>
        <input
          id="testimonial-area"
          type="text"
          list="testimonial-area-list"
          value={formData.area}
          onChange={(e) => setFormData((p) => ({ ...p, area: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-900"
          placeholder="e.g. Baner, Wakad"
          required
        />
        <datalist id="testimonial-area-list">
          {areas.map((a) => (
            <option key={a.id} value={a.name} />
          ))}
        </datalist>
      </div>
      <div>
        <label htmlFor="testimonial-text" className="block text-sm font-medium text-gray-700 mb-1">
          Your experience (short narrative)
        </label>
        <textarea
          id="testimonial-text"
          value={formData.testimonial}
          onChange={(e) => setFormData((p) => ({ ...p, testimonial: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-900 h-28"
          placeholder="Share how Charushila helped you find your home..."
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={5}
            value={formData.rating}
            onChange={(e) => setFormData((p) => ({ ...p, rating: parseInt(e.target.value, 10) }))}
            className="flex-1 max-w-[120px]"
          />
          <span className="text-lg font-medium text-gray-900">{formData.rating} ★</span>
        </div>
      </div>
      <Button type="submit" variant="primary" size="md" disabled={loading} className="w-full sm:w-auto">
        {loading ? 'Submitting...' : 'Submit testimonial'}
      </Button>
    </form>
  )
}
