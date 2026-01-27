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
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Enquiries</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0">
          <table className="w-full min-w-[500px]">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Name</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Requirement</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 hidden sm:table-cell">Area</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 hidden md:table-cell">Submitted</th>
                <th className="px-3 md:px-6 py-3 text-right text-xs md:text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <p className="font-medium text-gray-900 text-sm">{enquiry.name}</p>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-700 text-sm">
                    <a href={`tel:${enquiry.phone}`} className="text-blue-600 hover:text-blue-900 touch-manipulation">
                      {enquiry.phone}
                    </a>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <span
                      className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-medium ${getRequirementColor(
                        enquiry.requirement
                      )}`}
                    >
                      {enquiry.requirement.charAt(0).toUpperCase() + enquiry.requirement.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-700 text-sm hidden sm:table-cell">{enquiry.area}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-700 text-sm hidden md:table-cell">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                    <a
                      href={`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-900 text-sm font-medium mr-2 touch-manipulation"
                    >
                      WhatsApp
                    </a>
                    <button
                      onClick={() => handleDelete(enquiry.id)}
                      disabled={deleting === enquiry.id}
                      className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50 touch-manipulation"
                    >
                      {deleting === enquiry.id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {enquiries.length === 0 && (
          <div className="text-center py-12 px-4">
            <p className="text-gray-600">No enquiries yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
