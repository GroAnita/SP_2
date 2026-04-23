import './styles/input.css';
import router from './router/router.js';
const prefersDarkMode = window.matchMedia('(prefers-Dark-Mode: Dark)').matches;
if (prefersDarkMode) {
  document.dodumentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

document.body.addEventListener('click', (e) => {
  const link = e.target.closest('[data-link]');
  if (!link) return;
  e.preventDefault();
  window.history.pushState({}, '', path);
  router();
});

window.addEventListener('DOMContetLoaded', router);
window.addEventListener('popstate', router);

router();
