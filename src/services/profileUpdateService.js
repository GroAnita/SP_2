import apiClient from './apiClient.js';
import { getAuthState } from '../state/authState.js';

/**
 * Updates the currently authenticated user's profile.
 *
 * Sends updated profile data to the API
 * using the logged-in user's username.
 *
 * Requires authentication.
 *
 * @async
 * @function updateProfile
 *
 * @param {Object} data - Updated profile data.
 *
 * @returns {Promise<Object>}
 * API response containing the updated profile.
 *
 * @throws {Error}
 * Throws an error if:
 * - No user is logged in
 * - The API request fails
 *
 * @example
 * await updateProfile({
 *   bio: 'Auction hunter ',
 *   avatar: {
 *     url: 'https://example.com/avatar.png',
 *   },
 * });
 */
export async function updateProfile(data) {
  const user = getAuthState();

  if (!user) {
    throw new Error('You must be logged in to update your profile.');
  }
  return await apiClient(`/auction/profiles/${user.name}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
