import { getAuthToken } from '../state/authState.js';

const BASE_URL = 'https://v2.api.noroff.dev';

/**
 * Generic API client for making requests to the Noroff API.
 *
 * Automatically:
 * - Attaches base URL
 * - Adds JSON headers
 * - Adds API key from environment variables
 * - Adds Authorization header if user is logged in
 * - Parses JSON responses
 * - Handles API errors consistently
 *
 * @async
 * @function apiClient
 *
 * @param {string} endpoint - API endpoint (e.g. "/auction/listings")
 * @param {Object} [options={}] - Fetch options (method, headers, body, etc.)
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.headers] - Additional headers
 * @param {string} [options.body] - Request body (stringified JSON)
 *
 * @returns {Promise<Object|null>} Parsed JSON response data, or null for 204 responses
 *
 * @throws {Error} Throws an error if the API request fails or returns a non-OK status
 *
 * @example
 * // GET request
 * const listings = await apiClient('/auction/listings');
 *
 * @example
 * // POST request
 * await apiClient('/auction/listings', {
 *   method: 'POST',
 *   body: JSON.stringify({ title: 'New item' })
 * });
 *
 * @example
 * // Authenticated request (token automatically added)
 * const profile = await apiClient('/auction/profiles/username');
 */
export default async function apiClient(endpoint, options = {}) {
  try {
    const accessToken = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
      ...options.headers,
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let results = null;
    if (response.status !== 204) {
      results = await response.json();
    }

    if (!response.ok) {
      throw new Error(
        results.errors?.[0]?.message ||
          results.message ||
          `API error : ${response.status} ${response.statusText}`
      );
    }
    return results;
  } catch (error) {
    console.error('API Client Error:', error);
    throw new Error(
      'An error occurred while communicating with the API. Please try again later.'
    );
  }
}
