import apiClient from './apiClient.js';
import { setAuthState, clearAuthState } from '../state/authState.js';
import { updateAuthUI } from '../ui/authUi.js';

/**
 * Registers a new user via the Noroff API.
 *
 * @async
 * @function registerUser
 *
 * @param {Object} data - Registration payload
 * @param {string} data.name - Username
 * @param {string} data.email - User email (must be @stud.noroff.no)
 * @param {string} data.password - User password
 *
 * @returns {Promise<Object>} API response containing registered user data
 *
 * @throws {Error} If registration fails
 *
 * @example
 * await registerUser({
 *   name: 'Gro_Anita',
 *   email: 'gro@stud.noroff.no',
 *   password: 'password123'
 * });
 */
export async function registerUser(data) {
  try {
    const response = await fetch('https://v2.api.noroff.dev/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.errors?.[0]?.message || 'Registration failed. Please try again.'
      );
    }

    return result;
  } catch (error) {
    console.error('Registration Error:', error);
    throw new Error(
      'An error occurred during registration. Please check your input and try again.'
    );
  }
}

/**
 * Logs in a user and stores authentication state.
 *
 * Side effects:
 * - Saves user + token to localStorage via setAuthState
 * - Updates UI based on auth state
 *
 * @async
 * @function loginUser
 *
 * @param {Object} data - Login credentials
 * @param {string} data.email - User email
 * @param {string} data.password - User password
 *
 * @returns {Promise<Object>} Authenticated user data (including access token)
 *
 * @example
 * const user = await loginUser({
 *   email: 'gro@stud.noroff.no',
 *   password: 'password123'
 * });
 */
export async function loginUser(data) {
  const response = await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const authData = response.data;

  setAuthState(authData);
  updateAuthUI();

  return authData;
}

/**
 * Logs out the current user.
 *
 * Side effects:
 * - Clears authentication state
 * - Removes stored API key
 * - Updates UI to logged-out state
 *
 * @function logoutUser
 *
 * @returns {void}
 *
 * @example
 * logoutUser();
 */
export function logoutUser() {
  clearAuthState();
  localStorage.removeItem('apiKey');
  updateAuthUI();
}

/**
 * Creates a new API key for the authenticated user.
 *
 * The API key is required for accessing protected endpoints
 * in the Noroff API.
 *
 * Side effects:
 * - Stores API key in localStorage
 *
 * @async
 * @function createApiKey
 *
 * @param {string} accessToken - User's JWT access token
 *
 * @returns {Promise<string|null>} API key string or null if failed
 *
 * @throws {Error} If API request fails
 *
 * @example
 * const key = await createApiKey(user.accessToken);
 */
export async function createApiKey(accessToken) {
  try {
    const response = await fetch(
      'https://v2.api.noroff.dev/auth/create-api-key',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create API key');
    }

    const apiKey = result.data.key;
    localStorage.setItem('apiKey', apiKey);
    return apiKey;
  } catch (error) {
    console.error('Error creating API key:', error);
    return null;
  }
}
