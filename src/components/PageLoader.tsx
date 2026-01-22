'use client'

import { useEffect, useState } from 'react'

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAllImagesLoaded = () => {
      // Get all images including Next.js Image components (which use img tags)
      const allImages = Array.from(document.querySelectorAll('img'))
      
      // Filter out SVG icons and small icons (like WhatsApp icons)
      const contentImages = allImages.filter((img) => {
        const src = img.src || img.getAttribute('src') || ''
        // Exclude SVG icons and small icons
        if (src.includes('.svg') || src.includes('whatsapp') || img.width < 50 || img.height < 50) {
          return false
        }
        return true
      })

      // If no content images, hide loader
      if (contentImages.length === 0) {
        setIsLoading(false)
        return
      }

      // Check how many are already loaded
      const loadedImages = contentImages.filter((img) => img.complete && img.naturalHeight > 0)
      
      // If all are already loaded, hide loader
      if (loadedImages.length === contentImages.length) {
        setTimeout(() => setIsLoading(false), 200)
        return
      }

      let loadedCount = loadedImages.length
      const totalImages = contentImages.length

      const handleImageLoad = () => {
        loadedCount++
        if (loadedCount >= totalImages) {
          setTimeout(() => {
            setIsLoading(false)
          }, 300)
        }
      }

      const handleImageError = () => {
        loadedCount++
        if (loadedCount >= totalImages) {
          setTimeout(() => {
            setIsLoading(false)
          }, 300)
        }
      }

      // Add listeners to images that aren't loaded yet
      contentImages.forEach((img) => {
        if (!img.complete || img.naturalHeight === 0) {
          img.addEventListener('load', handleImageLoad, { once: true })
          img.addEventListener('error', handleImageError, { once: true })
        }
      })

      // Fallback timeout - hide loader after 5 seconds max
      const timeout = setTimeout(() => {
        setIsLoading(false)
      }, 5000)

      return () => {
        contentImages.forEach((img) => {
          img.removeEventListener('load', handleImageLoad)
          img.removeEventListener('error', handleImageError)
        })
        clearTimeout(timeout)
      }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(checkAllImagesLoaded, 100)
      })
    } else {
      setTimeout(checkAllImagesLoaded, 100)
    }

    // Watch for dynamically added images (like in AnimatedAreaCards)
    const observer = new MutationObserver(() => {
      setTimeout(checkAllImagesLoaded, 200)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Also listen for window load event
    window.addEventListener('load', () => {
      setTimeout(checkAllImagesLoaded, 200)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Green Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        {/* Optional: Loading text */}
        <p className="text-green-600 font-medium text-sm">Loading...</p>
      </div>
    </div>
  )
}
