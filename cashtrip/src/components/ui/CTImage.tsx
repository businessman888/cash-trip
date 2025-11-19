'use client'

import { useState } from 'react'
import Image from 'next/image'

interface CTImageProps {
  src: string
  alt: string
  width: number
  height: number
  blurhash?: string
  dominantColor?: string
  priority?: boolean
  className?: string
  fill?: boolean
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

/**
 * CTImage - Cash Trip Image Component
 * 
 * Optimized image component with:
 * - Lazy loading
 * - Placeholder with blur effect
 * - Fade-in animation when loaded
 * - Support for Next.js Image optimization
 */
export function CTImage({
  src,
  alt,
  width,
  height,
  blurhash,
  dominantColor,
  priority = false,
  className = '',
  fill = false,
  objectFit = 'cover',
}: CTImageProps) {
  const [loaded, setLoaded] = useState(false)

  // Use dominant color as placeholder background
  const placeholderBg = blurhash || dominantColor || '#1E293B'

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={fill ? undefined : { width, height }}
    >
      {/* Placeholder */}
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundColor: placeholderBg,
          }}
        />
      )}

      {/* Main Image */}
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          onLoad={() => setLoaded(true)}
          className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectFit }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          onLoad={() => setLoaded(true)}
          className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectFit }}
        />
      )}
    </div>
  )
}














