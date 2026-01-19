'use client'

import { useState } from 'react'
import { useAreas, updateArea, deleteArea } from '@/hooks/useCMS'
import Link from 'next/link'
import type { Area } from '@/types/cms'

export default function AreasPage() {
  const { areas, loading } = useAreas()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this area?')) return

    setDeleting(id)
    try {
      await deleteArea(id)
    } catch (error) {
      alert('Failed to delete area: ' + error)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Areas</h1>
        <Link
          href="/admin/dashboard/areas/new"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
        >
          + New Area
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Short Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Full Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{area.name}</p>
                </td>
                <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{area.shortDescription}</td>
                <td className="px-6 py-4 text-gray-700 max-w-md truncate">{area.fullDescription}</td>
                <td className="px-6 py-4 text-gray-700">
                  {new Date(area.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/dashboard/areas/${area.id}`}
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(area.id)}
                    disabled={deleting === area.id}
                    className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                  >
                    {deleting === area.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {areas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No areas yet.</p>
            <Link
              href="/admin/dashboard/areas/new"
              className="text-green-600 hover:text-green-900 mt-2 inline-block"
            >
              Create your first area
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
