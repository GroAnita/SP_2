import apiClient from './apiClient.js';
import { getAuthState } from '../state/authState.js';

/**
 * Fetches auction profiles from the API.
 *
 * Supports optional query parameters
 * such as sorting, pagination, or profile expansions.
 *
 * @async
 * @param {string} [params='']
 * Optional query string parameters.
 * @returns {Promise<Object>}
 * API response containing profile data.
 * @example
 * const profiles = await fetchProfiles();
 *
 * @example
 * const profiles = await fetchProfiles('?page=1&limit=10');
 */
export async function fetchProfiles(params = '') {
  return await apiClient(`/auction/profiles${params}`);
}

/**
 * Fetches a single profile by username.
 *
 * Supports optional query parameters
 * for expanded profile data.
 *
 * @async
 *
 * @param {string} name - Profile username.
 * @param {string} [params='']
 * Optional query string parameters.
 *
 * @returns {Promise<Object>}
 * API response containing profile data.
 *
 * @throws {Error}
 * Throws an error if the request fails.
 *
 * @example
 * const profile = await fetchProfile('LemonWizard');
 */
export function fetchProfile(name, params = '') {
  return apiClient(`/auction/profiles/${name}${params}`);
}

/**
 * Fetches the currently authenticated user's profile.
 *
 * Uses auth state to determine
 * the logged-in user's profile name.
 *
 * @async
 * @returns {Promise<Object|null>}
 * User profile data or null if no user is logged in.
 *
 * @throws {Error}
 * Throws an error if the request fails.
 *
 * @example
 * const myProfile = await fetchMyProfile();
 */

export async function fetchMyProfile() {
  const user = getAuthState();
  if (!user) return null;
  const response = await apiClient(`/auction/profiles/${user.name}`);
  return response.data;
}

/**
 * Creates a new auction profile.
 *
 * Sends profile data to the API.
 *
 * @async
 * @param {Object} data - Profile data object.
 *
 * @returns {Promise<Object>}
 * API response containing the created profile.
 *
 * @throws {Error}
 * Throws an error if profile creation fails.
 *
 * @example
 * await createProfile({
 *   name: 'LemonWizard',
 *   email: 'wizard@stud.noroff.no',
 * });
 */
export async function createProfile(data) {
  return await apiClient('/auction/profiles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteProfile(name) {
  return await apiClient(`/auction/profiles/${name}`, {
    method: 'DELETE',
  });
}

/**
 * Searches auction profiles by query string.
 *
 * Returns an empty data array if
 * the query is missing or invalid.
 *
 * @async
 * @param {string} query - Search query string.
 *
 * @returns {Promise<Object>}
 * API response containing matching profiles.
 *
 * @throws {Error}
 * Throws an error if the request fails.
 *
 * @example
 * const results = await searchProfiles('lemon');
 */
export function searchProfiles(query) {
  if (!query || query.trim()) return Promise.resolve({ data: [] });
  return apiClient(`/auction/profiles?search=${encodeURIComponent(query)}`);
}
