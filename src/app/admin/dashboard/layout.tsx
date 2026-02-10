'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/dashboard/listings', label: 'Listings', icon: '🏠' },
  { href: '/admin/dashboard/areas', label: 'Areas', icon: '📍' },
  { href: '/admin/dashboard/testimonials', label: 'Testimonials', icon: '⭐' },
  { href: '/admin/dashboard/enquiries', label: 'Enquiries', icon: '📧' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

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

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-6 shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-white">Vibha CMS</h1>
        <p className="text-gray-400 text-xs md:text-sm mt-1 truncate" title={user.email ?? ''}>
          {user.email}
        </p>
      </div>

      <nav className="flex-1 mt-4 md:mt-8 overflow-y-auto scrollbar-hide">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 md:px-6 py-3 text-sm md:text-base transition touch-manipulation ${
              pathname === link.href || (link.href !== '/admin/dashboard' && pathname.startsWith(link.href + '/'))
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="mr-2" aria-hidden>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 md:p-6 shrink-0 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 md:py-2 rounded-lg text-sm font-medium transition touch-manipulation"
        >
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile: overlay when sidebar open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar: drawer on mobile, fixed on desktop */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white
          flex flex-col transform transition-transform duration-200 ease-out
          md:translate-x-0 md:shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebar}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar: mobile hamburger + title */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm md:shadow-none">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              className="md:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 touch-manipulation"
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
              Admin Dashboard
            </h2>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  )
}
