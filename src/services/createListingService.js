import apiClient from './apiClient.js';

/**
 * Create a new auction listing.
 *
 * @param {Object} data - Listing data payload.
 * @returns {Promise<Object>} Created listing data.
 */
export async function createListing(data) {
  const response = await apiClient('/auction/listings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
}

/**
 * Fetch a single listing including bids.
 *
 * @param {string} id - Listing ID.
 * @returns {Promise<Object>} Listing with bid data.
 */
export async function fetchSingleListing(id) {
  return await apiClient(`/auction/listings/${id}?_bids=true`);
}

/**
 * Fetch a single listing by ID.
 *
 * @param {string} id - Listing ID.
 * @returns {Promise<Object>} Listing data.
 */
export async function fetchListingById(id) {
  return await apiClient(`/auction/listings/${id}`);
}

/**
 * Delete a listing by ID.
 *
 * @param {string} id - Listing ID.
 * @returns {Promise<Object>} API response.
 */
export async function deleteListing(id) {
  return await apiClient(`/auction/listings/${id}`, {
    method: 'DELETE',
  });
}
