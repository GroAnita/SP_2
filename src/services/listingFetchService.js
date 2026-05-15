import apiClient from './apiClient.js';

/**
 * Updates an existing auction listing.
 *
 * Sends a PUT request to the Noroff Auction API
 * with updated listing data.
 *
 * @async
 * @param {string} id - Listing ID.
 * @param {Object} data - Updated listing payload.
 *
 * @returns {Promise<Object>}
 * API response containing updated listing data.
 */
export default async function updateListing(id, data) {
  return await apiClient(`/auction/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Fetch auction listings with optional
 * filtering, sorting and pagination.
 *
 * Includes:
 * - Seller information
 * - Bid information
 * - Search support
 * - Tag filtering
 * - Active listing filtering
 * - Sorting support
 *
 * @async
 * @param {Object} [options={}]
 * @param {number} [options.page=1]
 * Current pagination page.
 *
 * @param {number} [options.limit=18]
 * Listings per page.
 *
 * @param {string} [options.query='']
 * Search query.
 *
 * @param {string} [options.tag='']
 * Filter listings by tag.
 *
 * @param {boolean} [options.active=false]
 * Whether to fetch only active listings.
 *
 * @param {string} [options.sort='created']
 * Field to sort by.
 *
 * @param {'asc' | 'desc'} [options.sortOrder='desc']
 * Sorting direction.
 *
 * @returns {Promise<Object>}
 * API response containing listing data.
 *
 * @throws {Error}
 * Throws if the request fails.
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
      _bids: 'true',
      _seller: 'true',
    });

    if (query) {
      params.set('q', query);
    }
    if (tag) {
      params.set('_tag', tag);
    }
    if (active) {
      params.set('_active', 'true');
    }

    const endpoint = `/auction/listings?${params.toString()}`;

    return await apiClient(endpoint);
  } catch (error) {
    console.error('Error fetching the listings:', error);
    throw error;
  }
}

/**
 * Deletes an auction listing.
 *
 * Sends a DELETE request to the Noroff Auction API.
 *
 * @async
 * @param {string} id - Listing ID to delete.
 *
 * @returns {Promise<Object>}
 * API response confirming deletion.
 */
export async function deleteListing(id) {
  return await apiClient(`/auction/listings/${id}`, {
    method: 'DELETE',
  });
}
