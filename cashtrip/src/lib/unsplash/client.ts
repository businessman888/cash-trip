import { createApi } from 'unsplash-js'

// Initialize Unsplash client
export const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
})

export interface UnsplashPhoto {
  id: string
  url: string
  width: number
  height: number
  author: string
  authorUrl: string
  downloadUrl: string
  color: string | null
}

/**
 * Search for city photos on Unsplash
 * @param cityName - Name of the city to search
 * @param count - Number of photos to retrieve (default: 12)
 * @returns Array of photo objects or null if error
 */
export async function searchCityPhotos(
  cityName: string,
  count: number = 12
): Promise<UnsplashPhoto[] | null> {
  try {
    const result = await unsplash.search.getPhotos({
      query: `${cityName} city landscape travel`,
      page: 1,
      perPage: count,
      orientation: 'landscape',
      orderBy: 'relevant',
    })

    if (result.errors) {
      console.error('Unsplash API errors:', result.errors)
      return null
    }

    if (!result.response) {
      console.error('No response from Unsplash')
      return null
    }

    return result.response.results.map(photo => ({
      id: photo.id,
      url: photo.urls.raw,
      width: photo.width,
      height: photo.height,
      author: photo.user.name,
      authorUrl: photo.user.links.html,
      downloadUrl: photo.links.download_location,
      color: photo.color,
    }))
  } catch (error) {
    console.error('Unsplash API error:', error)
    return null
  }
}

/**
 * Track photo download (required by Unsplash API guidelines)
 * Must be called when using a photo from Unsplash
 * @param downloadUrl - The download_location URL from photo object
 */
export async function trackDownload(downloadUrl: string): Promise<void> {
  try {
    await unsplash.photos.trackDownload({ downloadLocation: downloadUrl })
  } catch (error) {
    console.error('Failed to track Unsplash download:', error)
  }
}

/**
 * Get a specific photo by ID
 * @param photoId - Unsplash photo ID
 */
export async function getPhotoById(photoId: string): Promise<UnsplashPhoto | null> {
  try {
    const result = await unsplash.photos.get({ photoId })

    if (result.errors) {
      console.error('Unsplash API errors:', result.errors)
      return null
    }

    if (!result.response) {
      return null
    }

    const photo = result.response
    return {
      id: photo.id,
      url: photo.urls.raw,
      width: photo.width,
      height: photo.height,
      author: photo.user.name,
      authorUrl: photo.user.links.html,
      downloadUrl: photo.links.download_location,
      color: photo.color,
    }
  } catch (error) {
    console.error('Unsplash API error:', error)
    return null
  }
}






