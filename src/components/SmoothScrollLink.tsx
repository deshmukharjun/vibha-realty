'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'

interface SmoothScrollLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function SmoothScrollLink({
  href,
  children,
  className,
  onClick,
}: SmoothScrollLinkProps) {
  const pathname = usePathname()
  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.()
      const hash = href.includes('#') ? href.slice(href.indexOf('#')) : null
      if (pathname === '/' && hash && hash.length > 1) {
        e.preventDefault()
        const id = hash.slice(1)
        const el = document.getElementById(id)
        if (el) {
          const { gsap } = await import('gsap')
          const { ScrollToPlugin } = await import('gsap/ScrollToPlugin')
          gsap.registerPlugin(ScrollToPlugin)
          gsap.to(window, {
            duration: 1.2,
            scrollTo: hash,
            ease: 'power2.inOut',
          })
        } else {
          window.location.href = href
        }
      }
    },
    [href, pathname, onClick]
  )

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
