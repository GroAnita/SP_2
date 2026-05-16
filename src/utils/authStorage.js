/**
 * Saves authentication data to localStorage.
 *
 * Stores the provided auth object under
 * the `authUser` storage key.
 *
 * Common stored data may include:
 * - Access token
 * - Username
 * - Email
 * - User profile information
 *
 * @function saveAuthToStorage
 *
 * @param {Object} authData - Authentication data object.
 *
 * @returns {void}
 *
 * @example
 * saveAuthToStorage({
 *   accessToken: 'abc123',
 *   name: 'LemonWizard',
 * });
 */
export function saveAuthToStorage(authData) {
  localStorage.setItem('authUser', JSON.stringify(authData));
}

/**
 * Loads authentication data from localStorage.
 *
 * Retrieves and parses the `authUser`
 * storage item.
 *
 * Returns `null` if:
 * - No auth data exists
 * - Stored JSON is invalid
 *
 * @function loadAuthFromStorage
 *
 * @returns {Object|null}
 * Parsed authentication object or null.
 *
 * @example
 * const user = loadAuthFromStorage();
 */
export function loadAuthFromStorage() {
  const stored = localStorage.getItem('authUser');
  if (!stored) {
    return null;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Removes authentication data from localStorage.
 *
 * Deletes the `authUser` storage key.
 *
 * Commonly used during logout.
 *
 * @function removeAuthFromStorage
 *
 * @returns {void}
 *
 * @example
 * removeAuthFromStorage();
 */
export function removeAuthFromStorage() {
  localStorage.removeItem('authUser');
}
