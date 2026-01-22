'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Area {
  name: string
  description: string
  image?: string
}

const AREAS: Area[] = [
  { name: "Baner", description: "Premium locality with modern amenities and excellent connectivity", image: "/areas/baner.jpg" },
  { name: "Wakad", description: "Rapid growth area with great infrastructure and schools", image: "/areas/wakad.jpg" },
  { name: "Koregaon Park", description: "Established locality with heritage charm", image: "/areas/koregaon-park.jpg" },
  { name: "Pune City", description: "Central location with vibrant community", image: "/areas/punecity1.jpg" },
  { name: "Kalyani Nagar", description: "Upmarket area known for luxury apartments", image: "/areas/kalyani-nagar.jpg" },
  { name: "Kothrud", description: "Friendly neighborhood with good schools", image: "/areas/kothrud.jpg" },
  { name: "Viman Nagar", description: "Residential area near airport with good returns", image: "/areas/viman-nagar.jpg" },
]

export function AnimatedAreaCards() { 
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const getCardStyle = (index: number) => {
    const totalCards = AREAS.length
    const centerIndex = Math.floor(totalCards / 2)
    const offset = index - centerIndex
    
    // Horizontal fanning - cards spread further apart
    const horizontalSpread = 100 // Increased spread for more fanning
    const horizontalOffset = offset * horizontalSpread
    
    // Rotation creates the fan effect - left cards rotate counter-clockwise, right clockwise
    const maxRotation = 6 // Subtle rotation
    const rotation = (offset / (centerIndex + 1)) * maxRotation
    
    // Center card is largest, side cards scale down progressively
    const distanceFromCenter = Math.abs(offset)
    const scale = 1 - (distanceFromCenter * 0.1) // More pronounced scaling
    
    const isActive = activeIndex === index
    // Z-index: center card highest, then cards closer to center
    const baseZIndex = totalCards + 10 - distanceFromCenter
    const zIndex = isActive ? 100 : baseZIndex
    
    return {
      transform: `translateX(${horizontalOffset}px) rotate(${rotation}deg) scale(${isActive ? 1.15 : scale}) ${isActive ? 'translateY(-30px)' : ''}`,
      zIndex,
      opacity: 1, // All cards fully visible
      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), z-index 0.5s ease',
    }
  }

  return (
    <>
      {/* Desktop: Animated fanning cards - Lando Norris style */}
      <div className="hidden md:block relative h-[550px] lg:h-[650px] flex items-center justify-center overflow-visible px-8">
        <div className="relative w-full max-w-6xl h-full">
          {AREAS.map((area, index) => (
            <Link
              key={area.name}
              href="/areas"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center"
              style={getCardStyle(index)}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => setActiveIndex(index)}
            >
              <div className="w-[340px] h-[450px] bg-white rounded-2xl shadow-lg border border-green-200/50 overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300">
                {/* Card Content */}
                <div className="h-full flex flex-col">
                  {/* Top section with image */}
                  <div className="flex-1 bg-gradient-to-br from-green-50 via-green-50/80 to-green-100 relative overflow-hidden">
                    {area.image ? (
                      <Image
                        src={area.image}
                        alt={area.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 340px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                        <span className="text-gray-400 text-sm">Image placeholder</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom section with name and description */}
                  <div className="p-6 bg-white border-t border-green-200/40">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                      {area.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed text-center">
                      {area.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile: Simple grid layout */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        {AREAS.map((area) => (
          <Link key={area.name} href="/areas">
            <div className="bg-white rounded-xl shadow-md border border-green-200/40 overflow-hidden cursor-pointer hover:shadow-lg transition-all">
              <div className="h-full flex flex-col">
                <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden min-h-[120px]">
                  {area.image ? (
                    <Image
                      src={area.image}
                      alt={area.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 200px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white border-t border-green-200/40">
                  <h3 className="text-base font-bold text-gray-900 mb-1 text-center">
                    {area.name}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed text-center">
                    {area.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
