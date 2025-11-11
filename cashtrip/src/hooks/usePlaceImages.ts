import { useEffect, useState } from 'react'

export interface PlaceImage {
  id: string
  path: string
  is_primary: boolean
  image_type: 'hero' | 'gallery' | 'avatar' | 'thumbnail'
  blurhash?: string
  dominant_hex?: string
  author?: string
  author_url?: string
  source: string
  urls: {
    original: string
    hero_1920: string
    large_1080: string
    medium_720: string
    thumb_240: string
  }
}

interface UsePlaceImagesResult {
  images: PlaceImage[]
  heroImage: PlaceImage | undefined
  galleryImages: PlaceImage[]
  loading: boolean
  error: string | null
  cached: boolean
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and manage images for a specific place
 * 
 * Features:
 * - Automatic fetching on mount
 * - Cache-first strategy
 * - Hero image separate from gallery
 * - Loading and error states
 * - Manual refetch capability
 * 
 * @param placeId - UUID of the place
 * @returns Object with images, loading state, and refetch function
 */
export function usePlaceImages(placeId: string | null): UsePlaceImagesResult {
  const [images, setImages] = useState<PlaceImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cached, setCached] = useState(false)

  const fetchImages = async () => {
    if (!placeId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/places/${placeId}/images`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`)
      }

      const data = await response.json()
      
      setImages(data.images || [])
      setCached(data.cached || false)
    } catch (err: any) {
      console.error('Error fetching place images:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [placeId])

  // Separate hero image from gallery
  const heroImage = images.find(img => img.is_primary) || images[0]
  const galleryImages = images.filter(img => !img.is_primary)

  return {
    images,
    heroImage,
    galleryImages,
    loading,
    error,
    cached,
    refetch: fetchImages,
  }
}




