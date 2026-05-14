/**
 * In-memory authentication state.
 * Synced with localStorage to persist login between sessions.
 *
 * @type {Object|null}
 */
let authState = null;

/**
 * Key used to store auth data in localStorage.
 * @constant {string}
 */
const AUTH_STORAGE_KEY = 'authUser';

/**
 * Sets the authentication state.
 *
 * Side effects:
 * - Updates in-memory state
 * - Saves auth data to localStorage
 * - Dispatches "auth:changed" event for UI updates
 *
 * @function setAuthState
 *
 * @param {Object} authData - Authenticated user data
 * @param {string} authData.name - Username
 * @param {string} authData.email - User email
 * @param {string} authData.accessToken - JWT token
 *
 * @returns {void}
 *
 * @example
 * setAuthState(userData);
 */
export function setAuthState(authData) {
  authState = authData;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  document.dispatchEvent(new Event('auth:changed'));
}

/**
 * Clears the authentication state.
 *
 * Side effects:
 * - Removes auth data from memory
 * - Removes auth data from localStorage
 * - Dispatches "auth:changed" event
 *
 * @function clearAuthState
 *
 * @returns {void}
 *
 * @example
 * clearAuthState();
 */
export function clearAuthState() {
  authState = null;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  document.dispatchEvent(new Event('auth:changed'));
}

/**
 * Retrieves the current authentication state.
 *
 * - Returns in-memory state if available
 * - Falls back to localStorage if needed
 * - Parses and caches stored state
 *
 * @function getAuthState
 *
 * @returns {Object|null} Auth state object or null if not logged in
 *
 * @example
 * const user = getAuthState();
 */
export function getAuthState() {
  if (authState) return authState;
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;
  try {
    authState = JSON.parse(stored);
    return authState;
  } catch {
    return null;
  }
}

/**
 * Checks if the user is currently logged in.
 *
 * @function isLoggedIn
 *
 * @returns {boolean} True if user has a valid access token
 *
 * @example
 * if (isLoggedIn()) {
 *   // show protected UI
 * }
 */
export function isLoggedIn() {
  return Boolean(getAuthToken());
}

/**
 * Returns basic user information.
 *
 * @function getCurrentUser
 *
 * @returns {{ username: string, email: string } | null}
 * Simplified user object or null if not logged in
 *
 * @example
 * const user = getCurrentUser();
 */
export function getCurrentUser() {
  const state = getAuthState();
  if (!state) return null;
  return {
    username: state.name,
    email: state.email,
  };
}

/**
 * Retrieves the current user's access token.
 *
 * @function getAuthToken
 *
 * @returns {string|null} JWT token or null if not logged in
 *
 * @example
 * const token = getAuthToken();
 */
export function getAuthToken() {
  const state = getAuthState();
  return state?.accessToken || null;
}
