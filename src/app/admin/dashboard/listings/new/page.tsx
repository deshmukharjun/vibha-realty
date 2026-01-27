'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ListingForm } from '@/components/forms/ListingForm'
import { addListing } from '@/hooks/useCMS'

export default function NewListingPage() {
  const router = useRouter()

  const handleSubmit = async (payload: Parameters<typeof addListing>[0]) => {
    await addListing(payload)
    router.push('/admin/dashboard/listings')
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/dashboard/listings" className="text-green-600 hover:underline">
          ← Back to Listings
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">New Listing</h1>
      <p className="text-gray-600 mb-6 max-w-2xl">
        Add a listing. Transaction, category, property type, area, price range, and at least one image
        are used by the homepage filters. Use property types that match the filter modal options.
      </p>
      <ListingForm onSubmit={handleSubmit} onCancel={() => router.push('/admin/dashboard/listings')} submitLabel="Create listing" />
    </div>
  )
}
