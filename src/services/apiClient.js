import { getAuthToken } from '../state/authState.js';

const BASE_URL = 'https://v2.api.noroff.dev';

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
      throw new Error(`API error: ${response.status} ${response.statusText}`);
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
