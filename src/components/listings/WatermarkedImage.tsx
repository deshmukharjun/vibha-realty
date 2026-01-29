"use client";

import Image from "next/image";
import { WATERMARK_LINE1, WATERMARK_LINE2 } from "@/lib/watermark";

interface WatermarkedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Renders a listing image with mandatory watermark overlay.
 * PRD: All listing images must show "Vibha Realty - 98811 99152".
 */
export function WatermarkedImage({
  src,
  alt,
  fill = true,
  width,
  height,
  className = "",
  sizes,
  priority,
}: WatermarkedImageProps) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-100">
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`object-cover ${className}`}
        sizes={sizes}
        priority={priority}
      />
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center"
        aria-hidden
      >
        <span className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl opacity-35 leading-tight">
          {WATERMARK_LINE1}
        </span>
        <span className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl opacity-35 leading-tight">
          {WATERMARK_LINE2}
        </span>
      </div>
    </div>
  );
}
