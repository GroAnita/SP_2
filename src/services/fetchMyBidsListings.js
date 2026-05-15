import apiClient from './apiClient.js';
import { getAuthState } from '../state/authState.js';

/**
 * Fetches all unique auction listings the current user has placed bids on.
 *
 * This function:
 * - Retrieves the authenticated user
 * - Fetches the user's bid history from the Noroff Auction API
 * - Extracts unique listing IDs from the returned bids
 * - Fetches full listing details for each listing
 * - Returns only valid listing objects
 *
 * Includes:
 * - Seller information
 * - Bid information
 *
 * @async
 * @function fetchMyBidsListings
 *
 * @returns {Promise<Array<Object>>}
 * Array of listings the user has previously bid on.
 *
 * @example
 * const listings = await fetchMyBidsListings();
 *
 * @throws Will not throw directly.
 * Returns an empty array if the request fails.
 */

export async function fetchMyBidsListings() {
  try {
    const user = getAuthState();

    const result = await apiClient(
      `/auction/profiles/${user.name}/bids?_listings=true`
    );

    const uniqueIds = [
      ...new Set(result.data.map((bid) => bid.listing?.id).filter(Boolean)),
    ];

    const listings = await Promise.all(
      uniqueIds.map(async (id) => {
        try {
          const res = await apiClient(
            `/auction/listings/${id}?_bids=true&_seller=true`
          );

          return res.data;
        } catch (error) {
          console.error(`Failed fetching listing ${id}`, error);
          return null;
        }
      })
    );

    return listings.filter(Boolean);
  } catch (error) {
    console.error('Error fetching my bids listings:', error);
    return [];
  }
}
