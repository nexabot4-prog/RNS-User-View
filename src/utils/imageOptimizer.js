/**
 * Optimizes Supabase storage URLs by adding transformation parameters.
 * @param {string} url - The original image URL.
 * @param {number} width - The desired width.
 * @param {number} quality - The desired quality (default 80).
 * @returns {string} - The optimized URL.
 */
export const getOptimizedImageUrl = (url, width = 800, quality = 80) => {
    if (!url) return '';
    if (url.includes('supabase.co') && url.includes('/storage/v1/object/public')) {
        // Supabase Storage Image Transformation
        // Format: /render/image/public/[bucket]/[key]?width=[width]&quality=[quality]&format=webp
        return `${url}?width=${width}&quality=${quality}&format=webp`;
    }
    return url;
};
