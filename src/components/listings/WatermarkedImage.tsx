"use client";

import Image from "next/image";

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
 * Renders a listing image. Watermark is baked in at upload time (centered, 10% opacity).
 * No overlay is applied here to avoid double watermarks.
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
    </div>
  );
}
