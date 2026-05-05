import { getAuthState } from '../state/authState.js';
import { logoutUser } from '../services/authService.js';
import { fetchMyProfile } from '../services/profileService.js';
import logInModal from './logInModal';
import showToast from '../ui/showToast.js';

export default function hamburgerMenu() {
  const user = getAuthState();
  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50';

  const container = document.createElement('div');
  container.className =
    'relative h-full w-full md:w-80 bg-card text-text p-6 shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out';

  const closeButton = document.createElement('button');
  closeButton.className =
    'absolute top-2 right-2 text- text-4xl hover:text-secondary dark:hover:text-gray-300';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
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
  logOutButton.addEventListener('click', () => {
    logoutUser();

    container.classList.add('translate-x-full');

    setTimeout(() => {
      modal.remove();
      document.dispatchEvent(new Event('auth:changed'));
    }, 300);
  });

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

  const menuItems = [
    'Home',
    'My Bids',
    'My Listings',
    'My Profile',
    '+ Create Listing',
  ];
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
    link.dataset.link = ''; // 👈 THIS IS THE MAGIC

    link.className = 'block w-full cursor-pointer';

    link.addEventListener('click', () => {
      container.classList.add('translate-x-full');
      setTimeout(() => modal.remove(), 300);
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

    logInButton.addEventListener('click', () => {
      modal.remove();
      logInModal();
    });

    actionBtnSection.appendChild(logInButton);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      container.classList.add('translate-x-full');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  });

  // BUILD MODAL
  container.appendChild(closeButton);
  container.appendChild(userSection);
  userSection.appendChild(userInfo);
  userInfo.appendChild(userName);
  userInfo.appendChild(userEmail);
  container.appendChild(actionBtnSection);
  container.appendChild(menuList);

  modal.appendChild(container);
  document.body.appendChild(modal);
  requestAnimationFrame(() => {
    container.classList.remove('translate-x-full');
  });
}
