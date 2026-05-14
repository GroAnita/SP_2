import { getAuthState } from '../state/authState.js';
import { logoutUser } from '../services/authService.js';
import { fetchMyProfile } from '../services/profileService.js';
import logInModal from './logInModal';
import navigate from '../utils/navigate.js';
import { closeModal, setupEscapeClose } from '../utils/modalUtils.js';
import showToast from '../ui/showToast.js';
import confirmModal from './confirmModal.js';

/**
 * Creates and displays the mobile hamburger navigation menu.
 *
 * The menu adapts based on the user's authentication state:
 * - Guests can only access public navigation and login.
 * - Authenticated users can access profile pages, listings,
 *   bidding pages, and create new listings.
 *
 * Features:
 * - Animated slide-in mobile menu
 * - User profile preview
 * - Credits display
 * - Login/logout handling
 * - Search input for listings
 * - Protected "Create Listing" access
 * - Escape key and overlay close support
 * - Dynamic SPA navigation
 *
 * @returns {void}
 */
export default function hamburgerMenu() {
  const user = getAuthState();
  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Navigation menu');

  const container = document.createElement('aside');
  container.className =
    'relative h-full w-full md:w-80 bg-card text-text p-6 shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out';

  const closeButton = document.createElement('button');
  closeButton.className =
    'absolute top-2 right-2 text- text-4xl hover:text-secondary dark:hover:text-gray-300';
  closeButton.innerHTML = '&times;';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close navigation menu');
  closeButton.addEventListener('click', () => {
    closeModal(modal, container);
  });

  const userSection = document.createElement('div');
  userSection.className =
    'flex items-center gap-3 mb-2 pb-4 border-b border-text';

  const avatar = document.createElement('img');
  avatar.src =
    user?.avatar?.url || `${import.meta.env.BASE_URL}images/lemonmascot-1.png`;
  avatar.alt = 'User Avatar';
  avatar.className = 'w-12 h-12 rounded-full object-cover';

  const userInfo = document.createElement('div');

  const userName = document.createElement('p');
  userName.textContent = user?.name || 'Guest';
  userName.className = 'text-lg font-semibold text-text';

  const userEmail = document.createElement('p');
  userEmail.textContent = user?.email || '';
  userEmail.className = 'text-sm text-text';

  const logOutButton = document.createElement('button');
  logOutButton.className =
    'fa-solid fa-right-from-bracket mt-1 text-2xl text-text px-3 py-1 rounded  transition';
  logOutButton.setAttribute('aria-label', 'Log out');
  logOutButton.type = 'button';
  // Adding a confirmation modal before logging out to prevent accidental logouts.
  logOutButton.addEventListener('click', () => {
    confirmModal({
      title: 'Log Out',
      message: 'Are you sure you want to log out?',
      confirmText: 'Log Out',
      cancelText: 'Cancel',
      onConfirm: async () => {
        logoutUser();

        container.classList.add('translate-x-full');

        setTimeout(() => {
          modal.remove();
          document.dispatchEvent(new Event('auth:changed'));
        }, 300);
      },
    });
  });

  const coins = document.createElement('div');
  coins.className =
    'bg-header text-primary px-3 py-1 border-2 border-primary rounded-full font-bold text-sm';
  coins.textContent = '...';
  /**
   * Fetch and display the authenticated user's credits.
   * Falls back to locally stored credits if the request fails.
   */
  if (user) {
    fetchMyProfile()
      .then((profile) => {
        coins.textContent = `${profile.credits} Coins`;
      })
      .catch(() => {
        coins.textContent = `${user.credits || 0} Coins`;
      });
  } else {
    coins.style.display = 'none';
  }

  const menuItems = ['Home'];

  if (user) {
    menuItems.push('My Bids', 'My Listings', 'My Profile', '+ Create Listing');
  }

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Primary navigation');

  const menuList = document.createElement('ul');
  menuList.className = 'flex flex-col gap-4';

  const routes = {
    Home: '/',
    'My Bids': '/profile?tab=bids',
    'My Listings': '/profile?tab=listings',
    'My Profile': '/profile',
    '+ Create Listing': '/create-listing',
  };

  menuItems.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.className = 'text-lg hover:text-primary';

    const link = document.createElement('a');
    link.textContent = item;

    const route = routes[item];
    if (!route) return;

    link.href = route;
    link.dataset.link = '';

    link.className = 'block w-full cursor-pointer';

    link.addEventListener('click', (e) => {
      e.preventDefault();
      container.classList.add('translate-x-full');

      if (item === '+ Create Listing') {
        /**
         * Prevents guests from opening the create listing modal.
         *
         * Even though the menu item is hidden for unauthenticated users,
         * this acts as an additional layer of protection against manual
         * DOM manipulation or forced navigation attempts.
         */
        if (!user) {
          showToast('You must be logged in to create a listing.', 'warning');
          return;
        }
        setTimeout(() => {
          modal.remove();
          import('./createNewListing.js').then((module) => {
            module.default();
          });
        }, 300);
        return;
      }

      setTimeout(() => {
        modal.remove();
        navigate(route);
      }, 300);
    });

    listItem.appendChild(link);
    menuList.appendChild(listItem);
  });

  // USER SECTION
  userSection.appendChild(avatar);
  userSection.appendChild(userInfo);

  // ACTION BUTTONS
  const actionBtnSection = document.createElement('div');
  actionBtnSection.className =
    'flex gap-4 mb-4 justify-center items-center border-b border-text pb-4 w-full';
  if (user) {
    actionBtnSection.appendChild(logOutButton);
    actionBtnSection.appendChild(coins);
  } else {
    const logInButton = document.createElement('button');
    logInButton.textContent = 'Log In';
    logInButton.className =
      'text-text px-3 py-1 rounded hover:text-primary transition';
    logInButton.type = 'button';
    logInButton.setAttribute('aria-label', 'Log in to your account');

    logInButton.addEventListener('click', () => {
      modal.remove();
      logInModal();
    });

    actionBtnSection.appendChild(logInButton);
  }

  const searchLabel = document.createElement('label');
  searchLabel.textContent = 'Search Listings';
  searchLabel.className = 'sr-only';
  searchLabel.htmlFor = 'mobile-search';

  const searchInputMobile = document.createElement('input');
  searchInputMobile.type = 'text';
  searchInputMobile.placeholder = 'Search...';
  searchInputMobile.className = 'input block md:hidden w-full mt-4';
  searchInputMobile.id = 'mobile-search';

  /**
   * Handle listing search from the mobile navigation menu.
   * Navigates to the listings page with a query parameter.
   */
  searchInputMobile.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInputMobile.value.trim();
      if (!query) return;
      const base = import.meta.env.BASE_URL || '';
      history.pushState(
        {},
        '',
        `${base}listings?q=${encodeURIComponent(query)}`
      );
      window.dispatchEvent(new PopStateEvent('popstate'));
      modal.remove();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal, container);
    }
  });

  setupEscapeClose(modal, container);

  // BUILD MODAL
  container.appendChild(closeButton);
  container.appendChild(userSection);
  userInfo.appendChild(userName);
  userInfo.appendChild(userEmail);
  container.appendChild(actionBtnSection);
  nav.appendChild(menuList);
  container.appendChild(nav);
  container.appendChild(searchLabel);
  container.appendChild(searchInputMobile);

  modal.appendChild(container);
  document.body.appendChild(modal);
  requestAnimationFrame(() => {
    container.classList.remove('translate-x-full');
  });
}
