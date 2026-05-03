import './styles/input.css';
import router from './router/router.js';
import navigate from './utils/navigate.js';

const prefersDarkMode = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;
if (prefersDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

document.body.addEventListener('click', (e) => {
  const link = e.target.closest('[data-link]');
  if (!link) return;
  e.preventDefault();
  const path = link.getAttribute('href');
  navigate(path);
});

document.addEventListener('auth:changed', () => {
  router();
});

window.addEventListener('DOMContentLoaded', router);
window.addEventListener('popstate', router);
