'use client'

import { useListings, updateListing, deleteListing } from '@/hooks/useCMS'
import Link from 'next/link'
import type { Listing } from '@/types/cms'

export default function ListingsPage() {
  const { rawListings: listings, loading, error } = useListings(undefined, { forAdmin: true })

  const handleStatusChange = async (listing: Listing, newStatus: Listing['adminStatus']) => {
    try {
      await updateListing(listing.id, { adminStatus: newStatus })
    } catch (err) {
      alert('Failed to update: ' + (err instanceof Error ? err.message : err))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    try {
      await deleteListing(id)
    } catch (err) {
      alert('Failed to delete: ' + (err instanceof Error ? err.message : err))
    }
  }

  if (loading) return <div className="text-gray-600">Loading listings...</div>
  if (error) return <div className="text-red-600 py-4">Error: {error}</div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Listings</h1>
        <Link
          href="/admin/dashboard/listings/new"
          className="bg-green-600 hover:bg-green-700 text-white py-3 sm:py-2 px-4 rounded-lg transition font-medium touch-manipulation text-center w-full sm:w-auto"
        >
          + New Listing
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0">
          <table className="w-full min-w-[640px]">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Area</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Type</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Category</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Ownership</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Transaction</th>
              <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Status</th>
              <th className="px-3 md:px-6 py-3 text-right text-xs md:text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 md:px-6 py-12 text-center text-gray-500 text-sm">
                  No listings yet. Add one to show on the homepage.
                </td>
              </tr>
            ) : (
              listings.map((listing) => (
                <tr key={listing.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 md:px-6 py-3 md:py-4 font-medium text-gray-900 text-sm">{listing.area}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-700 text-sm">{listing.propertyType}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <span className="capitalize px-2 py-0.5 md:py-1 bg-gray-100 rounded text-xs">
                      {listing.category}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <span
                      className={`capitalize px-2 py-0.5 md:py-1 rounded text-xs ${
                        listing.ownership === 'personal'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {listing.ownership === 'personal' ? 'Personal' : 'Channel Partner'}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 capitalize text-gray-700 text-sm">{listing.transactionType}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <select
                      value={listing.adminStatus}
                      onChange={(e) =>
                        handleStatusChange(listing, e.target.value as Listing['adminStatus'])
                      }
                      className="text-xs md:text-sm border border-gray-300 rounded px-2 py-1 capitalize touch-manipulation"
                    >
                      <option value="active">Active</option>
                      <option value="sold">Sold</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                    <Link
                      href={`/admin/dashboard/listings/${listing.id}`}
                      className="text-green-600 hover:underline text-sm font-medium mr-2 md:mr-3 touch-manipulation"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(listing.id)}
                      className="text-red-600 hover:underline text-sm font-medium touch-manipulation"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
