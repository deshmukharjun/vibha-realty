"use client";

import Image from "next/image";

// Generate an array [1, 2, ..., 8]
const LOGO_IDS = Array.from({ length: 8 }, (_, i) => i + 1);

function LogoItem({ id }: { id: number }) {
  return (
    <li className="flex-shrink-0 mx-10 md:mx-16">
      {/* Mobile: w-32 h-20 (80px height) 
          Desktop: w-56 h-32 (128px height) 
      */}
      <div className="relative w-32 h-20 md:w-56 md:h-32">
        <Image
          src={`/logo${id}.png`}
          alt={`Industrialist Logo ${id}`}
          fill
          className="object-contain"
        />
      </div>
    </li>
  );
}

export function LogoCarousel() {
  return (
    <div className="w-full overflow-hidden py-10 logo-carousel-mask">
      <ul className="flex items-center animate-infinite-scroll w-max">
        {/* Original Set */}
        {LOGO_IDS.map((id) => (
          <LogoItem key={`logo-${id}`} id={id} />
        ))}
        {/* Duplicated Set for seamless looping */}
        {LOGO_IDS.map((id) => (
          <LogoItem key={`dup-${id}`} id={id} />
        ))}
      </ul>
    </div>
  );
}