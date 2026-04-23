export default function Header() {
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
  logo.src = '/SP_2/images/lemonmascot-1.png';
  logo.alt = 'LemonBids Logo';
  logo.className = 'w-14 h-14 mr-2';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search listings...';
  searchInput.className = 'input hidden md:block md:w-[600px]';

  const nav = document.createElement('nav');
  const toggleButton = document.createElement('button');
  toggleButton.className = 'btn-sm btn-primary mr-4';

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
  bottomHeader.className = 'flex justify-center p-2 w-full bg-bottomnav';

  bottomHeader.appendChild(createNavLink('Home', '/'));
  bottomHeader.appendChild(createNavLink('Listings', '/listings'));
  bottomHeader.appendChild(createNavLink('Login', '/login'));

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
  return header;
}

function createNavLink(text, path) {
  const link = document.createElement('a');
  link.href = path;
  link.textContent = text;
  link.dataset.link = '';
  const currentPath = window.location.pathname;
  link.className =
    'px-3 py-2 mx-1 rounded-md text-sm font-medium ' +
    (currentPath === path
      ? 'bg-primary text-[--color-btn-text]'
      : 'text-primary hover:bg-primary hover:text-[--color-btn-text]');

  return link;
}
