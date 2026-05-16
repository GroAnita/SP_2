import { getCurrentUser, isLoggedIn } from '../state/authState.js';

/**
 * Updates UI elements based on authentication state.
 *
 * Features:
 * - Shows elements meant for logged-in users
 * - Hides elements meant for logged-out users
 * - Inserts the current username into UI elements
 *
 * Uses `data-auth` attributes:
 * - `data-auth="logged-in"`
 * - `data-auth="logged-out"`
 * - `data-auth="username"`
 *
 * Authentication state is retrieved from:
 * - isLoggedIn()
 * - getCurrentUser()
 *
 * @function updateAuthUI
 *
 * @returns {void}
 *
 * @example
 * updateAuthUI();
 *
 * @example
 * document.addEventListener('auth:changed', updateAuthUI);
 */
export function updateAuthUI() {
  const loggedIn = isLoggedIn();
  const user = getCurrentUser();

  document.querySelectorAll('[data-auth="logged-in"]').forEach((el) => {
    el.classList.toggle('hidden', !loggedIn);
  });

  document.querySelectorAll('[data-auth="logged-out"]').forEach((el) => {
    el.classList.toggle('hidden', loggedIn);
  });

  document.querySelectorAll('[data-auth="username"]').forEach((el) => {
    el.textContent = user ? user.username : '';
  });
}
