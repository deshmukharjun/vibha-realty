'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/admin')
      } else {
        setUser(currentUser)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/admin')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Vibha CMS</h1>
          <p className="text-gray-400 text-sm mt-2">{user.email}</p>
        </div>

        <nav className="mt-8">
          <Link
            href="/admin/dashboard"
            className="block px-6 py-3 hover:bg-gray-800 transition"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/dashboard/areas"
            className="block px-6 py-3 hover:bg-gray-800 transition"
          >
            📍 Areas
          </Link>
          <Link
            href="/admin/dashboard/partners"
            className="block px-6 py-3 hover:bg-gray-800 transition"
          >
            🏢 Channel Partners
          </Link>
          <Link
            href="/admin/dashboard/testimonials"
            className="block px-6 py-3 hover:bg-gray-800 transition"
          >
            ⭐ Testimonials
          </Link>
          <Link
            href="/admin/dashboard/enquiries"
            className="block px-6 py-3 hover:bg-gray-800 transition"
          >
            📧 Enquiries
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
