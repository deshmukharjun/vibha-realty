"use client";

import Image from "next/image";
import { WATERMARK_TEXT } from "@/lib/watermark";

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
        className="absolute bottom-2 right-2 px-2 py-1 rounded text-white text-xs font-medium bg-black/60 whitespace-nowrap"
        aria-hidden
      >
        {WATERMARK_TEXT}
      </div>
    </div>
  );
}
