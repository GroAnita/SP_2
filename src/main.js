import './styles/input.css';
import router from './router/router.js';
import navigate from './utils/navigate.js';

/**
 * Entry point for the LemonBids application.
 *
 * Responsibilities:
 * - Loads global styles
 * - Initializes dark mode preference
 * - Handles SPA navigation
 * - Re-renders UI on auth state changes
 * - Initializes the router on page load
 * - Handles browser back/forward navigation
 *
 * Features:
 * - Uses History API navigation
 * - Supports `data-link` SPA links
 * - Detects system dark mode preference
 * - Responds to custom `auth:changed` events
 *
 * Events handled:
 * - click
 * - auth:changed
 * - DOMContentLoaded
 * - popstate
 *
 * @module main
 */

/**
 * Detects whether the user prefers dark mode
 * based on system/browser settings.
 *
 * @type {boolean}
 */
const prefersDarkMode = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;
if (prefersDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

/**
 * Handles SPA navigation using `data-link`.
 *
 * Prevents full page reloads and instead
 * routes navigation through the custom router.
 */
document.body.addEventListener('click', (e) => {
  const link = e.target.closest('[data-link]');
  if (!link) return;
  e.preventDefault();
  const path = link.getAttribute('href');
  navigate(path);
});

/**
 * Re-render application when authentication changes.
 *
 * Triggered after:
 * - Login
 * - Logout
 * - Registration
 */
document.addEventListener('auth:changed', () => {
  router();
});

/**
 * Initialize router when DOM is ready.
 */
window.addEventListener('DOMContentLoaded', router);
/**
 * Handle browser back/forward navigation.
 */
window.addEventListener('popstate', router);
