import apiClient from './apiClient.js';
import { getAuthState } from '../state/authState.js';

/**
 * Fetches all listings created by the currently authenticated user.
 *
 * This function:
 * - Retrieves the current user from auth state
 * - Calls the Noroff API profile endpoint with `_listings=true`
 * - Returns the user's listings array
 *
 * @async
 * @function fetchOwnListings
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of listing objects.
 *
 * @example
 * const myListings = await fetchOwnListings();
 *
 * @returns {Promise<Array>} Returns an empty array if:
 * - The user is not logged in
 * - The API request fails
 */
export async function fetchOwnListings() {
  const user = getAuthState();
  if (!user?.name) return [];

  try {
    const response = await apiClient(
      `/auction/profiles/${user.name}?_listings=true`
    );

    return response.data.listings || [];
  } catch (error) {
    console.error('Error fetching own listings:', error);
    return [];
  }
}
