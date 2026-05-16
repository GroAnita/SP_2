/**
 * Applies image fallback handling to an image element.
 *
 * Features:
 * - Sets the primary image source
 * - Automatically replaces broken images
 *   with a fallback image
 * - Prevents infinite error loops if
 *   the fallback image also fails
 *
 * Common use cases:
 * - Missing API image URLs
 * - Broken external image links
 * - Default placeholder images
 *
 * @function imageFallback
 *
 * @param {HTMLImageElement} imgEl
 * Image element to apply fallback behavior to.
 *
 * @param {string} src
 * Primary image source URL.
 *
 * @param {string} fallback
 * Fallback image source URL.
 *
 * @returns {void}
 *
 * @example
 * imageFallback(
 *   image,
 *   listing.media?.[0]?.url,
 *   '/images/fallback.png'
 * );
 */
export function imageFallback(imgEl, src, fallback) {
  imgEl.onerror = () => {
    imgEl.onerror = null; //prevent loop if fallback also fails
    imgEl.src = fallback;
  };

  imgEl.src = src || fallback;
}
