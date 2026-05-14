import apiClient from './apiClient.js';

/**
 * Fetches all listings that the currently logged-in user has placed bids on.
 *
 * This function:
 * - Reads bid data from localStorage (`myBids`)
 * - Extracts unique listing IDs
 * - Fetches each listing from the Noroff Auction API
 * - Returns only valid listing objects
 *
 * @async
 * @function fetchMyBidsListings
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of listing objects.
 *
 * @example
 * const listings = await fetchMyBidsListings();
 *
 * @throws Will not throw errors directly; returns an empty array on failure.
 */
export async function fetchMyBidsListings() {
  try {
    const myBids = JSON.parse(localStorage.getItem('myBids') || '[]');

    if (!myBids.length) return [];

    const listingIds = [...new Set(myBids.map((b) => b.listingId))];

    const listings = await Promise.all(
      listingIds.map(async (id) => {
        try {
          const res = await apiClient(
            `/auction/listings/${id}?_seller=true&_bids=true`
          );
          return res?.data;
        } catch (error) {
          console.error(`Error fetching listing ${id}:`, error);
          return null;
        }
      })
    );

    return listings.filter((listing) => listing !== null);
  } catch (error) {
    console.error('Error fetching my bids listings:', error);
    return [];
  }
}
