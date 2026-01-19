'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { addChannelPartner, updateChannelPartner, getChannelPartner } from '@/hooks/useCMS'
import { useAreas } from '@/hooks/useCMS'
import Link from 'next/link'
import type { ChannelPartner } from '@/types/cms'

interface Props {
  params: Promise<{ id?: string }>
}

export default function PartnerEditor({ params }: Props) {
  const router = useRouter()
  const { areas } = useAreas()
  const { id } = use(params)
  const isEditMode = id && id !== 'new'

  const [formData, setFormData] = useState<{
    name: string
    description: string
    propertyTypes: string[]
    areas: string[]
    status: 'active' | 'inactive'
    logo: string
  }>({
    name: '',
    description: '',
    propertyTypes: [],
    areas: [],
    status: 'active',
    logo: '',
  })

  const [propertyTypeInput, setPropertyTypeInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPartner = async () => {
      if (isEditMode && id) {
        setFetching(true)
        try {
          const partner = await getChannelPartner(id)
          if (partner) {
            setFormData({
              name: partner.name,
              description: partner.description || '',
              propertyTypes: partner.propertyTypes || [],
              areas: partner.areas || [],
              status: partner.status,
              logo: partner.logo || '',
            })
          } else {
            setError('Partner not found')
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load partner')
        } finally {
          setFetching(false)
        }
      }
    }
    loadPartner()
  }, [isEditMode, id])

  const addPropertyType = () => {
    if (propertyTypeInput.trim() && !formData.propertyTypes.includes(propertyTypeInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        propertyTypes: [...prev.propertyTypes, propertyTypeInput.trim()],
      }))
      setPropertyTypeInput('')
    }
  }

  const removePropertyType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.filter((t) => t !== type),
    }))
  }

  const toggleArea = (areaName: string) => {
    setFormData((prev) => ({
      ...prev,
      areas: prev.areas.includes(areaName)
        ? prev.areas.filter((a) => a !== areaName)
        : [...prev.areas, areaName],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isEditMode && !id) {
      setError('Invalid partner ID')
      setLoading(false)
      return
    }

    try {
      if (isEditMode && id) {
        await updateChannelPartner(id, formData)
      } else {
        await addChannelPartner(formData)
      }

      router.push('/admin/dashboard/partners')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save partner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/dashboard/partners" className="text-yellow-600 hover:text-yellow-900">
          ← Back to Partners
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Channel Partner' : 'Create New Channel Partner'}
      </h1>

      {fetching && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          Loading partner...
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
              placeholder="e.g., ABC Builders, XYZ Developers"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black h-24"
              placeholder="Brief description about the partner"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Types</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={propertyTypeInput}
                onChange={(e) => setPropertyTypeInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addPropertyType()
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
                placeholder="e.g., 2 BHK, 3 BHK, Villas"
              />
              <button
                type="button"
                onClick={addPropertyType}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.propertyTypes.map((type) => (
                <span
                  key={type}
                  className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {type}
                  <button
                    type="button"
                    onClick={() => removePropertyType(type)}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Areas</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {areas.map((area) => (
                <label key={area.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.areas.includes(area.name)}
                    onChange={() => toggleArea(area.name)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{area.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as 'active' | 'inactive',
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (Optional)</label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
              placeholder="https://example.com/logo.png"
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
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Partner'}
          </button>
        </div>
      </form>
    </div>
  )
}
