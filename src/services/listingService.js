import apiClient from './apiClient.js';

/**
 * Fetches auction listings from the API.
 *
 * Supports:
 * - Pagination
 * - Search queries
 * - Tag filtering
 * - Active auction filtering
 * - Sorting and sort order
 * - Expanded seller and bid data
 *
 * Query parameters are automatically converted
 * into URL search params before sending the request.
 *
 * @async
 * @function fetchListings
 *
 * @param {Object} [options={}] - Listing fetch options.
 *
 * @param {number} [options.page=1]
 * Current page number for pagination.
 *
 * @param {number} [options.limit=18]
 * Number of listings per page.
 *
 * @param {string} [options.query='']
 * Search query used to filter listings.
 *
 * @param {string} [options.tag='']
 * Tag filter for listings.
 *
 * @param {boolean} [options.active=false]
 * Whether to fetch only active auctions.
 *
 * @param {string} [options.sort='created']
 * Field used for sorting listings.
 *
 * @param {string} [options.sortOrder='desc']
 * Sort direction (`asc` or `desc`).
 *
 * @returns {Promise<Object>}
 * API response containing auction listings.
 *
 * @throws {Error}
 * Throws an error if the request fails.
 *
 * @example
 * const listings = await fetchListings();
 *
 * @example
 * const listings = await fetchListings({
 *   page: 2,
 *   limit: 12,
 *   query: 'gaming',
 *   active: true,
 *   sort: 'endsAt',
 *   sortOrder: 'asc',
 * });
 */
export async function fetchListings({
  page = 1,
  limit = 18,
  query = '',
  tag = '',
  active = false,
  sort = 'created',
  sortOrder = 'desc',
} = {}) {
  try {
    const params = new URLSearchParams({
      page,
      limit,
      sort,
      sortOrder,
      _bids: true,
      _seller: true,
    });

    if (query.trim()) {
      params.append('q', query.trim());
    }
    if (tag.trim()) {
      params.append('tag', tag.trim());
    }
    if (active) {
      params.append('active', 'true');
    }

    const endpoint = `/auction/listings?${params.toString()}`;

    return await apiClient(endpoint);
  } catch (error) {
    console.error('Error fetching the listings:', error);
    throw error;
  }
}
