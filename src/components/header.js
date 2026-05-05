import logInModal from './logInModal.js';
import { getAuthState } from '../state/authState.js';
import { logoutUser } from '../services/authService.js';
import { fetchMyProfile } from '../services/profileService.js';
import hamburgerMenu from './hamburgerMenu.js';

export default function Header() {
  const user = getAuthState();
  const base = import.meta.env.BASE_URL;
  const fallback = `${import.meta.env.BASE_URL}images/lemonmascot-1.png`;
  const header = document.createElement('header');
  header.className =
    ' fixed top-0 left-0 w-full z-50 flex flex-col justify-between items-center';

  const topHeader = document.createElement('div');
  topHeader.className =
    'bg-header p-4 flex flex-col md:flex-row justify-between items-center w-full';

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
  searchInput.className = 'input md:block md:w-[600px]';

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (!query) return;
      const base = import.meta.env.BASE_URL || '';
      history.pushState(
        {},
        '',
        `${base}listings?q=${encodeURIComponent(query)}`
      );
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  });

  const nav = document.createElement('nav');

  /** Dark mode toggle section*/
  const toggleWrapper = document.createElement('div');
  toggleWrapper.className = 'relative group flex items-center';

  const tooltip = document.createElement('span');
  tooltip.textContent = 'Theme';
  tooltip.className =
    'absolute top-[30px] left-1/2 -translate-x-1/2 bg-primary text-text text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity';

  const toggleButton = document.createElement('i');
  toggleButton.className =
    'text-xl text-primary mr-4 transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer mr-4';

  const isDarkMode = document.documentElement.classList.contains('dark');
  toggleButton.innerHTML = isDarkMode
    ? '<i class="fa-regular fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';

  toggleButton.addEventListener('click', () => {
    const isDarkMode = document.documentElement.classList.toggle('dark');

    localStorage.setItem('mode', isDarkMode ? 'dark' : 'light');

    // Animate spin
    toggleButton.classList.add('rotate-180');

    setTimeout(() => {
      toggleButton.innerHTML = isDarkMode
        ? '<i class="fa-regular fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

      toggleButton.classList.remove('rotate-180');
    }, 200);
  });

  const profileContainer = document.createElement('div');
  profileContainer.className = 'flex items-center gap-4';

  const userName = document.createElement('a');
  userName.className = 'text-sm text-primary font-semibold cursor-pointer';
  userName.textContent = user?.name || 'Guest';
  userName.href = '/profile';
  userName.dataset.link = '';

  const coins = document.createElement('div');
  coins.className =
    'bg-header text-primary px-3 py-1 border-2 border-primary rounded-full font-bold text-sm';
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

  const avatarLink = document.createElement('a');
  avatarLink.href = '/profile';
  avatarLink.dataset.link = '';
  avatarLink.addEventListener('click', (e) => {
    if (!user) {
      e.preventDefault();
      logInModal();
    }
  });

  const avatar = document.createElement('img');
  avatar.src = user?.avatar?.url || fallback;
  avatar.alt = 'User Avatar';
  avatar.className = 'w-8 h-8 rounded-full object-cover';

  const hamburger = document.createElement('i');
  hamburger.className =
    'fa-solid fa-bars text-2xl text-primary cursor-pointer ';
  hamburger.addEventListener('click', () => {
    hamburgerMenu();
  });

  toggleWrapper.appendChild(tooltip);
  toggleWrapper.appendChild(toggleButton);
  profileContainer.appendChild(avatarLink);
  avatarLink.appendChild(avatar);
  profileContainer.appendChild(toggleWrapper);

  imgContainer.appendChild(logo);
  topHeader.appendChild(imgContainer);
  topHeader.appendChild(searchInput);

  profileContainer.appendChild(coins);

  profileContainer.appendChild(hamburger);
  imgContainer.appendChild(title);

  topHeader.appendChild(profileContainer);
  topHeader.appendChild(nav);
  header.appendChild(topHeader);

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
      ? 'bg-primary text-text'
      : 'text-text hover:bg-primary hover:text-text');

  return link;
}
