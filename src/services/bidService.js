import apiClient from './apiClient.js';

/**
 * Places a bid on an auction listing.
 *
 * Sends a POST request to the auction API
 * with the bid amount for the selected listing.
 *
 * Requires authentication.
 *
 * @async
 * @function placeBid
 *
 * @param {string} listingId - ID of the listing to bid on.
 * @param {number} amount - Bid amount in credits/coins.
 *
 * @returns {Promise<Object>}
 * API response containing the created bid data.
 *
 * @throws {Error}
 * Throws an error if the API request fails
 * or the bid is invalid.
 *
 * @example
 * await placeBid('abc123', 500);
 */

export async function placeBid(listingId, amount) {
  return await apiClient(`/auction/listings/${listingId}/bids`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

/**
 * Fetches all bids for a specific auction listing.
 *
 * Sends a GET request to retrieve bid history
 * for the selected listing.
 *
 * @async
 * @function fetchBids
 *
 * @param {string} listingId - ID of the listing.
 *
 * @returns {Promise<Object>}
 * API response containing an array of bids.
 *
 * @throws {Error}
 * Throws an error if the request fails.
 *
 * @example
 * const bids = await fetchBids('abc123');
 */
export async function fetchBids(listingId) {
  return await apiClient(`/auction/listings/${listingId}/bids`);
}

/**
 * Fetches listings the authenticated user
 * has placed bids on.
 *
 * Requires authentication.
 *
 * @async
 * @function fetchMyBids
 *
 * @returns {Promise<Object>}
 * API response containing the user's bid history.
 *
 * @throws {Error}
 * Throws an error if the request fails
 * or the user is not authenticated.
 *
 * @example
 * const myBids = await fetchMyBids();
 */
export async function fetchMyBids() {
  return await apiClient('/auction/my-bids');
}
