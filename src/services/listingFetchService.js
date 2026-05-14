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
 * Fetches paginated active auction listings.
 *
 * Includes:
 * - Seller information
 * - Bid information
 * - Sorting by newest listings first
 *
 * @async
 * @param {Object} [options={}] - Fetch configuration.
 * @param {number} [options.page=1] - Page number.
 * @param {number} [options.limit=18] - Number of listings per page.
 *
 * @returns {Promise<Object>}
 * API response containing listing data and metadata.
 *
 * @throws Will throw an error if the request fails.
 */
export async function fetchListings({ page = 1, limit = 18 } = {}) {
  try {
    const onlyActive = true;
    const result = await apiClient(
      `/auction/listings?_active=${onlyActive}&_bids=true&_seller=true&page=${page}&limit=${limit}&sort=created&sortOrder=desc`
    );

    console.log('PAGE:', page);
    console.log(
      'IDS:',
      result.data.map((l) => l.id)
    );

    return result;
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
