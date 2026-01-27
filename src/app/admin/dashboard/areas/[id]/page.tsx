'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { addArea, updateArea, getArea } from '@/hooks/useCMS'
import Link from 'next/link'
import type { Area } from '@/types/cms'

interface Props {
  params: Promise<{ id?: string }>
}

export default function AreaEditor({ params }: Props) {
  const router = useRouter()
  const { id } = use(params)
  const isEditMode = id && id !== 'new'

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    whatsappBroadcastLink: '',
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadArea = async () => {
      if (isEditMode && id) {
        setFetching(true)
        try {
          const area = await getArea(id)
          if (area) {
            setFormData({
              name: area.name,
              shortDescription: area.shortDescription,
              fullDescription: area.fullDescription,
              whatsappBroadcastLink: area.whatsappBroadcastLink ?? '',
            })
          } else {
            setError('Area not found')
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load area')
        } finally {
          setFetching(false)
        }
      }
    }
    loadArea()
  }, [isEditMode, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        whatsappBroadcastLink: formData.whatsappBroadcastLink.trim() || undefined,
      }
      if (isEditMode && id) {
        await updateArea(id, payload)
      } else {
        await addArea(payload)
      }

      router.push('/admin/dashboard/areas')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save area')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/dashboard/areas" className="text-green-600 hover:text-green-900">
          ← Back to Areas
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Area' : 'Create New Area'}
      </h1>

      {fetching && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          Loading area...
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Area Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
              placeholder="e.g., Baner, Wakad, Hadapsar"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea
              value={formData.shortDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black h-24"
              placeholder="Brief description shown on areas page (1-2 sentences)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea
              value={formData.fullDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullDescription: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black h-48"
              placeholder="Detailed description about the area"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp broadcast link (optional)</label>
            <input
              type="url"
              value={formData.whatsappBroadcastLink}
              onChange={(e) => setFormData((prev) => ({ ...prev, whatsappBroadcastLink: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
              placeholder="https://wa.me/group/xxx or wa.me chat link for this area"
            />
            <p className="text-xs text-gray-500 mt-1">
              When set, the Areas card links to this URL. Leave empty to use the default &quot;Hi Charushila, I&apos;m interested in [area]&quot; chat.
            </p>
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
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Area'}
          </button>
        </div>
      </form>
    </div>
  )
}
