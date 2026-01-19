'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addArea, updateArea, getArea } from '@/hooks/useCMS'
import Link from 'next/link'
import type { Area } from '@/types/cms'

interface Props {
  params: { id?: string }
}

export default function AreaEditor({ params }: Props) {
  const router = useRouter()
  const isEditMode = params?.id && params.id !== 'new'

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadArea = async () => {
      if (isEditMode && params?.id) {
        setFetching(true)
        try {
          const area = await getArea(params.id)
          if (area) {
            setFormData({
              name: area.name,
              shortDescription: area.shortDescription,
              fullDescription: area.fullDescription,
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
  }, [isEditMode, params?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isEditMode && params?.id) {
        await updateArea(params.id, formData)
      } else {
        await addArea(formData)
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
