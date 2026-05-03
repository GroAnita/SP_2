import logInModal from './logInModal.js';
import { getAuthState } from '../state/authState.js';
import { logoutUser } from '../services/authService.js';
import { fetchMyProfile } from '../services/profileService.js';

export default function Header() {
  const user = getAuthState();
  const base = import.meta.env.BASE_URL;
  const fallback = `${import.meta.env.BASE_URL}images/lemonmascot-1.png`;
  const header = document.createElement('header');
  header.className = '  flex flex-col justify-between items-center';

  const topHeader = document.createElement('div');
  topHeader.className =
    'bg-header p-4 flex justify-between items-center w-full';

  const imgContainer = document.createElement('div');
  imgContainer.className = 'flex items-center';
  const title = document.createElement('h1');
  title.className = 'text-primary text-4xl font-bold font-poppins';
  title.textContent = 'LemonBids';
  const logo = document.createElement('img');
  logo.src = `${import.meta.env.BASE_URL}images/lemonmascot-1.png`;
  logo.alt = 'LemonBids Logo';
  logo.className = 'w-14 h-14 mr-2';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search listings...';
  searchInput.className = 'input hidden md:block md:w-[600px]';

  const nav = document.createElement('nav');
  const toggleButton = document.createElement('i');
  toggleButton.className =
    'fa-solid fa-moon text-2xl text-primary cursor-pointer mr-4';

  const isDarkMode = document.documentElement.classList.contains('dark');
  toggleButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';

  toggleButton.addEventListener('click', () => {
    const isDarkMode = document.documentElement.classList.toggle('dark');
    localStorage.setItem('mode', isDarkMode ? 'dark' : 'light');
    toggleButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
  });

  const hamburger = document.createElement('i');
  hamburger.className =
    'fa-solid fa-bars text-2xl text-primary cursor-pointer md:hidden';

  const bottomHeader = document.createElement('div');
  bottomHeader.className =
    'flex items-center justify-between p-2 w-full bg-bottomnav';

  const left = document.createElement('div');
  left.className = 'flex-1';

  const center = document.createElement('div');
  center.className = 'flex justify-center flex-1';

  const right = document.createElement('div');
  right.className = 'flex items-center gap-4 flex-1 justify-end';

  center.appendChild(createNavLink('Home', '/'));
  center.appendChild(createNavLink('Listings', '/listings'));
  if (user) {
    center.appendChild(createNavLink('Logout', '/logout'));
  } else {
    center.appendChild(createNavLink('Login', '/login'));
  }

  const userName = document.createElement('a');
  userName.className = 'text-sm text-primary font-semibold cursor-pointer';
  userName.textContent = user?.name || 'Guest';
  userName.href = '/profile';
  userName.dataset.link = '';

  const coins = document.createElement('div');
  coins.className =
    'bg-primary text-grey-900 px-3 py-1 rounded-full font-bold text-sm';
  coins.textContent = '...';
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

  const avatar = document.createElement('img');
  avatar.src = user?.avatar?.url || fallback;
  avatar.alt = 'User Avatar';
  avatar.className = 'w-8 h-8 rounded-full object-cover';

  right.prepend(avatar);

  right.appendChild(userName);
  right.appendChild(coins);

  bottomHeader.appendChild(left);
  bottomHeader.appendChild(center);
  bottomHeader.appendChild(right);

  nav.appendChild(toggleButton);
  nav.appendChild(hamburger);

  imgContainer.appendChild(logo);
  topHeader.appendChild(imgContainer);
  nav.appendChild(toggleButton);
  nav.appendChild(hamburger);
  imgContainer.appendChild(title);
  topHeader.appendChild(searchInput);
  topHeader.appendChild(nav);
  header.appendChild(topHeader);
  header.appendChild(bottomHeader);

  document.addEventListener('credits:updated', async () => {
    const profile = await fetchMyProfile();
    coins.textContent = `${profile.credits} Coins`;
  });

  return header;
}

function createNavLink(text, path) {
  const link = document.createElement('a');
  link.href = path;
  link.textContent = text;

  if (path === '/login') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      logInModal();
    });
  } else if (path === '/logout') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
      document.dispatchEvent(new Event('auth:changed'));
    });
  } else {
    link.dataset.link = '';
  }

  const currentPath = window.location.pathname;
  link.className =
    'px-3 py-2 mx-1 rounded-md text-sm font-medium ' +
    (currentPath === path
      ? 'bg-primary text-[--color-btn-text]'
      : 'text-primary hover:bg-primary hover:text-[--color-btn-text]');

  return link;
}
