'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ListingForm } from '@/components/forms/ListingForm'
import { getListing, updateListing } from '@/hooks/useCMS'
import type { Listing } from '@/types/cms'

export default function EditListingPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [listing, setListing] = useState<Listing | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getListing(id)
      .then(setListing)
      .catch(() => setError('Failed to load listing.'))
  }, [id])

  const handleSubmit = async (payload: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!id) return
    await updateListing(id, payload)
    router.push('/admin/dashboard/listings')
  }

  if (listing === undefined || (id && listing === null && !error)) {
    return (
      <div>
        <Link href="/admin/dashboard/listings" className="text-green-600 hover:underline">
          ← Back to Listings
        </Link>
        <p className="mt-4 text-gray-600">Loading…</p>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div>
        <Link href="/admin/dashboard/listings" className="text-green-600 hover:underline">
          ← Back to Listings
        </Link>
        <p className="mt-4 text-red-600">{error ?? 'Listing not found.'}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/dashboard/listings" className="text-green-600 hover:underline">
          ← Back to Listings
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Listing {id}</h1>
      <p className="text-gray-600 mb-6 max-w-2xl">
        Update this listing. Fields must match the filter modal so listings show correctly when users
        filter by transaction, category, property type, and price.
      </p>
      <ListingForm
        initialListing={listing}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/dashboard/listings')}
        submitLabel="Save changes"
      />
    </div>
  )
}
