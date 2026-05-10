/**
 * Optimizes image URLs from supported image providers.
 *
 * Supported providers:
 * - Pexels
 * - Unsplash
 *
 * Features:
 * - Automatically appends optimization query parameters
 * - Reduces image size for better performance
 * - Preserves existing query parameters using the correct separator
 * - Returns original URL for unsupported providers
 *
 * Optimization examples:
 * - Pexels:
 *   ?auto=compress&cs=tinysrgb&w=400
 *
 * - Unsplash:
 *   ?w=400&auto=format&fit=crop&q=80
 *
 * Behavior:
 * - If URL already contains query params (`?`),
 *   uses `&` instead of adding another `?`
 * - Returns `null` if no URL is provided
 *
 * @function optimizeImageUrl
 *
 * @param {string} url - Original image URL
 * @param {number} [width=400] - Desired image width
 *
 * @returns {string|null}
 * Optimized image URL or original URL if unsupported
 *
 * @example
 * optimizeImageUrl(
 *   'https://images.pexels.com/photo.jpg',
 *   600
 * );
 *
 * // Returns:
 * // https://images.pexels.com/photo.jpg?auto=compress&cs=tinysrgb&w=600
 *
 * @example
 * optimizeImageUrl(
 *   'https://images.unsplash.com/photo-123'
 * );
 *
 * // Returns optimized Unsplash URL
 */
export default function optimizeImageUrl(url, width = 400) {
  if (!url) return null;
  const separator = url.includes('?') ? '&' : '?';
  if (url.includes('pexels.com')) {
    return `${url}${separator}auto=compress&cs=tinysrgb&w=${width}`;
  }

  if (url.includes('unsplash.com')) {
    return `${url}${separator}w=${width}&auto=format&fit=crop&q=80`;
  }

  return url;
}
