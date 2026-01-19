'use client'

import { useState } from 'react'
import { useChannelPartners, updateChannelPartner, deleteChannelPartner } from '@/hooks/useCMS'
import Link from 'next/link'
import type { ChannelPartner } from '@/types/cms'

export default function PartnersPage() {
  const { partners, loading } = useChannelPartners(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return

    setDeleting(id)
    try {
      await deleteChannelPartner(id)
    } catch (error) {
      alert('Failed to delete partner: ' + error)
    } finally {
      setDeleting(null)
    }
  }

  const toggleStatus = async (partner: ChannelPartner) => {
    try {
      await updateChannelPartner(partner.id, {
        status: partner.status === 'active' ? 'inactive' : 'active',
      })
    } catch (error) {
      alert('Failed to update partner: ' + error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Channel Partners</h1>
        <Link
          href="/admin/dashboard/partners/new"
          className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded transition"
        >
          + New Partner
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Property Types</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Areas</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{partner.name}</p>
                </td>
                <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{partner.description}</td>
                <td className="px-6 py-4 text-gray-700">
                  <div className="flex flex-wrap gap-1">
                    {partner.propertyTypes.slice(0, 2).map((type, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {type}
                      </span>
                    ))}
                    {partner.propertyTypes.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        +{partner.propertyTypes.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  <div className="flex flex-wrap gap-1">
                    {partner.areas.slice(0, 2).map((area, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 rounded text-xs">
                        {area}
                      </span>
                    ))}
                    {partner.areas.length > 2 && (
                      <span className="px-2 py-1 bg-blue-100 rounded text-xs">
                        +{partner.areas.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      partner.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {partner.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => toggleStatus(partner)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    {partner.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <Link
                    href={`/admin/dashboard/partners/${partner.id}`}
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(partner.id)}
                    disabled={deleting === partner.id}
                    className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                  >
                    {deleting === partner.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {partners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No channel partners yet.</p>
            <Link
              href="/admin/dashboard/partners/new"
              className="text-yellow-600 hover:text-yellow-900 mt-2 inline-block"
            >
              Create your first partner
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
