import Listings from '../views/listings.js';
import Header from '../components/header.js';
import ListingDetail from '../views/listingDetail.js';
import Register from '../views/register.js';
import Profile from '../views/profile.js';
import { getAuthState } from '../state/authState.js';
import navigate from '../utils/navigate.js';
import showToast from '../ui/showToast.js';

const routes = {
  '/': { view: Listings },
  '/listing': {
    view: () => {
      const data = JSON.parse(localStorage.getItem('selectedListing'));
      return ListingDetail(data);
    },
  },
  '/register': { view: Register },
  '/profile': { view: Profile, protected: true },
};

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

  // HANDLE ASYNC + SYNC
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

  document.querySelectorAll('[data-timer]').forEach((el) => {
    if (el._intervalId) {
      clearInterval(el._intervalId);
    }
  });

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
