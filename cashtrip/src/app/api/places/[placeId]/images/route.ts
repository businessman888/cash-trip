import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchCityPhotos, trackDownload } from '@/lib/unsplash/client'

/**
 * Generate image variant URLs using Supabase Image Transformations
 */
function generateVariants(path: string) {
  const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/places/${path}`
  
  return {
    original: baseUrl,
    hero_1920: `${baseUrl}?width=1920&quality=85&format=webp`,
    large_1080: `${baseUrl}?width=1080&quality=80&format=webp`,
    medium_720: `${baseUrl}?width=720&quality=75&format=webp`,
    thumb_240: `${baseUrl}?width=240&height=240&resize=cover&format=webp`,
  }
}

/**
 * GET /api/places/[placeId]/images
 * 
 * Fetches images for a specific place. Implements cache-first strategy:
 * 1. Try to return cached images from Supabase Storage
 * 2. If not found, fetch from Unsplash and cache
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { placeId: string } }
) {
  try {
    const supabase = await createClient()
    const { placeId } = params

    if (!placeId) {
      return NextResponse.json(
        { error: 'placeId is required' },
        { status: 400 }
      )
    }

    // 1. Check if images already exist in database
    const { data: existingImages, error: fetchError } = await supabase
      .from('images')
      .select('*')
      .eq('place_id', placeId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('Error fetching images:', fetchError)
      throw fetchError
    }

    // 2. If images exist, return them (cache hit)
    if (existingImages && existingImages.length > 0) {
      return NextResponse.json({
        images: existingImages.map(img => ({
          ...img,
          urls: generateVariants(img.path),
        })),
        cached: true,
        count: existingImages.length,
      })
    }

    // 3. Cache miss - need to fetch from Unsplash
    // First, get place information
    const { data: place, error: placeError } = await supabase
      .from('places')
      .select('id, name, city, country')
      .eq('id', placeId)
      .single()

    if (placeError || !place) {
      return NextResponse.json(
        { error: 'Place not found', placeId },
        { status: 404 }
      )
    }

    // 4. Search Unsplash for city photos
    const searchQuery = `${place.city} ${place.country}`
    const unsplashPhotos = await searchCityPhotos(searchQuery, 12)

    if (!unsplashPhotos || unsplashPhotos.length === 0) {
      return NextResponse.json({
        images: [],
        cached: false,
        message: 'No images found on Unsplash',
      })
    }

    // 5. Process the hero image (first photo) immediately
    const heroPhoto = unsplashPhotos[0]
    
    // Track download as required by Unsplash
    await trackDownload(heroPhoto.downloadUrl)

    // Download and upload hero image to Supabase Storage
    const heroResult = await processAndUploadImage({
      placeId,
      photo: heroPhoto,
      isPrimary: true,
      imageType: 'hero',
      supabase,
    })

    // 6. Process gallery images in background (non-blocking)
    // Only take first 6 additional images
    const galleryPromises = unsplashPhotos.slice(1, 7).map(async (photo) => {
      try {
        await trackDownload(photo.downloadUrl)
        return await processAndUploadImage({
          placeId,
          photo,
          isPrimary: false,
          imageType: 'gallery',
          supabase,
        })
      } catch (error) {
        console.error(`Error processing gallery image ${photo.id}:`, error)
        return null
      }
    })

    // Don't await gallery images - let them process in background
    Promise.all(galleryPromises).catch(err => 
      console.error('Error processing gallery images:', err)
    )

    // 7. Return hero image immediately
    return NextResponse.json({
      images: heroResult ? [heroResult] : [],
      cached: false,
      processing: true,
      message: 'Hero image ready, gallery images processing in background',
    })

  } catch (error: any) {
    console.error('Error in GET /api/places/[placeId]/images:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Helper function to download, process and upload an image to Supabase Storage
 */
async function processAndUploadImage({
  placeId,
  photo,
  isPrimary,
  imageType,
  supabase,
}: {
  placeId: string
  photo: any
  isPrimary: boolean
  imageType: 'hero' | 'gallery'
  supabase: any
}) {
  try {
    // 1. Download image from Unsplash
    const imageResponse = await fetch(photo.url)
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`)
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const imageBytes = new Uint8Array(imageBuffer)

    // 2. Calculate SHA-256 hash for deduplication
    const hashBuffer = await crypto.subtle.digest('SHA-256', imageBytes)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // 3. Check if image already exists (deduplication)
    const { data: existing } = await supabase
      .from('images')
      .select('id, path')
      .eq('hash_sha256', hashHex)
      .eq('place_id', placeId)
      .single()

    if (existing) {
      console.log(`Image already exists (deduplicated): ${existing.id}`)
      return {
        ...existing,
        urls: generateVariants(existing.path),
        deduplicated: true,
      }
    }

    // 4. Define storage path
    const fileName = isPrimary ? 'hero' : crypto.randomUUID()
    const fileExt = 'jpg' // Keep original format for now
    const storagePath = `${placeId}/${imageType === 'gallery' ? 'gallery/' : ''}${fileName}.${fileExt}`

    // 5. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('places')
      .upload(storagePath, imageBytes, {
        contentType: 'image/jpeg',
        cacheControl: '31536000, immutable',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    // 6. Save metadata to database
    const { data: imageRecord, error: dbError } = await supabase
      .from('images')
      .insert({
        place_id: placeId,
        bucket: 'places',
        path: storagePath,
        mime: 'image/jpeg',
        width: photo.width,
        height: photo.height,
        is_primary: isPrimary,
        image_type: imageType,
        source: 'unsplash',
        source_id: photo.id,
        source_url: photo.url,
        author: photo.author,
        author_url: photo.authorUrl,
        license: 'unsplash',
        hash_sha256: hashHex,
        dominant_hex: photo.color,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }

    return {
      ...imageRecord,
      urls: generateVariants(storagePath),
    }

  } catch (error) {
    console.error('Error processing image:', error)
    throw error
  }
}














