import Listings from '../views/listings.js';
import Header from '../components/header.js';
import ListingDetail from '../views/listingDetail.js';
import Register from '../views/register.js';
import Profile from '../views/profile.js';
import { getAuthState } from '../state/authState.js';
import navigate from '../utils/navigate.js';
import showToast from '../ui/showToast.js';

/**
 * Route configuration object.
 *
 * Each route can define:
 * - view: function that returns a DOM element (or Promise of one)
 * - protected: whether authentication is required
 * - title: optional page title
 *
 * @type {Object<string, {
 *   view: Function,
 *   protected?: boolean,
 *   title?: string
 * }>}
 */
const routes = {
  '/': { view: Listings },
  /**
   * Listing detail route.
   * Uses localStorage to retrieve selected listing data.
   *
   * @returns {HTMLElement}
   */
  '/listing': { view: ListingDetail, title: 'Listing Detail' },
  '/register': { view: Register, title: 'Register' },
  '/profile': { view: Profile, protected: true, title: 'Profile' },
};

/**
 * Main SPA router responsible for:
 * - Resolving the current URL path
 * - Matching it to a route
 * - Handling protected routes (auth guard)
 * - Rendering the correct view
 * - Injecting shared components (Header)
 * - Supporting both sync and async views
 * - Cleaning up intervals (e.g. countdown timers)
 * - Updating active navigation links
 *
 * Routing features:
 * - Base path support (for GitHub Pages deployment)
 * - Fallback to home route if path not found
 * - LocalStorage-based data passing (e.g. selected listing)
 *
 * @function router
 *
 * @returns {void}
 *
 * @example
 * // Trigger routing on page load
 * router();
 *
 * @example
 * // Trigger routing after navigation
 * window.addEventListener('popstate', router);
 */
export default function router() {
  const app = document.getElementById('app');
  app.classList.add('pt-32');
  const headerContainer = document.getElementById('header');

  const base = '/SP_2';

  //  Handle path
  let path = window.location.pathname;

  if (path.startsWith(base)) {
    path = path.slice(base.length) || '/';
  }

  const route = routes[path] || routes['/'];
  const user = getAuthState();
  /**
   * Prevent access to protected routes if user is not authenticated.
   */
  if (route.protected && !user) {
    showToast('You must be logged in to access this page.', 'warning');
    navigate('/');
    return;
  }

  const page = route.view();

  // Clear
  app.innerHTML = '';
  headerContainer.innerHTML = '';

  //  Render header
  headerContainer.appendChild(Header());

  /**
   * Handles both synchronous and asynchronous views.
   * If the view returns a Promise, wait for it before rendering.
   */
  if (page instanceof Promise) {
    page.then((resolvedView) => {
      app.innerHTML = '';
      app.appendChild(resolvedView);
    });
  } else {
    app.innerHTML = '';
    app.appendChild(page);
    setActiveLinks();
  }

  /**
   * Highlights the active navigation link based on current path.
   *
   * Adds/removes CSS classes for active state.
   *
   * @function setActiveLinks
   * @returns {void}
   */
  function setActiveLinks() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('[data-link]').forEach((link) => {
      const path = link.getAttribute('href');
      if (currentPath.endsWith(path)) {
        link.classList.add('bg-primary', 'text-text');
      } else {
        link.classList.remove('bg-primary');
      }
    });
  }

  document.querySelectorAll('[data-timer]').forEach((el) => {
    if (el._intervalId) {
      clearInterval(el._intervalId);
    }
  });
}
