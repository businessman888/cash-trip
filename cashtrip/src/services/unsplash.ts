import { createApi } from 'unsplash-js';

// Initialize the Unsplash API with the provided access key
const unsplash = createApi({
    accessKey: 'e3xqjC1QP2TkhHKpwv8hctW9gc3l_ZAohrsz-dZCn-4',
});

export interface UnsplashImage {
    id: string;
    url: string;
    alt_description: string | null;
    user: {
        name: string;
        username: string;
    };
}

const CACHE_PREFIX = 'cashtrip_unsplash_';

const getCachedData = <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (cached) {
        try {
            return JSON.parse(cached) as T;
        } catch (e) {
            console.error('Error parsing cache', e);
            return null;
        }
    }
    return null;
};

const setCachedData = (key: string, data: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
};

export const getRandomPhoto = async (query: string): Promise<UnsplashImage | null> => {
    const cacheKey = `single_${query}`;
    const cached = getCachedData<UnsplashImage>(cacheKey);
    if (cached) return cached;

    try {
        const result = await unsplash.photos.getRandom({
            query,
            count: 1,
        });

        if (result.errors) {
            console.error('Error fetching image from Unsplash:', result.errors[0]);
            return null;
        }

        const photo = Array.isArray(result.response) ? result.response[0] : result.response;

        if (!photo) return null;

        const imageData = {
            id: photo.id,
            url: photo.urls.regular,
            alt_description: photo.alt_description,
            user: {
                name: photo.user.name,
                username: photo.user.username,
            },
        };

        setCachedData(cacheKey, imageData);
        return imageData;
    } catch (error) {
        console.error('Error fetching image from Unsplash:', error);
        return null;
    }
};

export const getPhotos = async (query: string, count: number = 1): Promise<UnsplashImage[]> => {
    const cacheKey = `multi_${query}_${count}`;
    const cached = getCachedData<UnsplashImage[]>(cacheKey);
    if (cached) return cached;

    try {
        const result = await unsplash.photos.getRandom({
            query,
            count,
        });

        if (result.errors) {
            console.error('Error fetching images from Unsplash:', result.errors[0]);
            return [];
        }

        const photos = Array.isArray(result.response) ? result.response : [result.response];

        const imagesData = photos.map(photo => ({
            id: photo.id,
            url: photo.urls.regular,
            alt_description: photo.alt_description,
            user: {
                name: photo.user.name,
                username: photo.user.username,
            },
        }));

        setCachedData(cacheKey, imagesData);
        return imagesData;
    } catch (error) {
        console.error('Error fetching images from Unsplash:', error);
        return [];
    }
};
