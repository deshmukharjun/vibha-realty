'use client'

import { useState } from 'react'
import { useEnquiries, deleteEnquiry } from '@/hooks/useCMS'
import type { Enquiry } from '@/types/cms'

export default function EnquiriesPage() {
  const { enquiries, loading } = useEnquiries()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return

    setDeleting(id)
    try {
      await deleteEnquiry(id)
    } catch (error) {
      alert('Failed to delete enquiry: ' + error)
    } finally {
      setDeleting(null)
    }
  }

  const getRequirementColor = (requirement: string) => {
    switch (requirement) {
      case 'buy':
        return 'bg-blue-100 text-blue-800'
      case 'rent':
        return 'bg-green-100 text-green-800'
      case 'invest':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Enquiries</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Requirement</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Area</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Submitted</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{enquiry.name}</p>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  <a href={`tel:${enquiry.phone}`} className="text-blue-600 hover:text-blue-900">
                    {enquiry.phone}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getRequirementColor(
                      enquiry.requirement
                    )}`}
                  >
                    {enquiry.requirement.charAt(0).toUpperCase() + enquiry.requirement.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{enquiry.area}</td>
                <td className="px-6 py-4 text-gray-700">
                  {new Date(enquiry.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <a
                    href={`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={() => handleDelete(enquiry.id)}
                    disabled={deleting === enquiry.id}
                    className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                  >
                    {deleting === enquiry.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {enquiries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No enquiries yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
